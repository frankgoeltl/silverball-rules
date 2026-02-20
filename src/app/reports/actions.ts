'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Authentication actions

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const envPassword = process.env.REPORTS_PASSWORD

  if (!envPassword) {
    return { success: false, error: 'Reports not configured' }
  }

  if (password === envPassword) {
    const cookieStore = await cookies()
    cookieStore.set('reports_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    revalidatePath('/reports')
    return { success: true }
  }

  return { success: false, error: 'Invalid password' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('reports_auth')
  revalidatePath('/reports')
}

// Data types

export interface ReportData {
  summary: {
    totalRequests: number
    todayRequests: number
    last7DaysRequests: number
    last30DaysRequests: number
  }
  requestsByPath: Array<{ path: string; count: number }>
  requestsByDay: Array<{ date: string; count: number }>
}

export interface TopMachine {
  opendbId: string
  name: string
  count: number
}

export interface LogEntry {
  id: number
  method: string | null
  path: string | null
  query_string: string | null
  timestamp: string
  ip_address: string | null
}

export interface PaginatedLogs {
  entries: LogEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  machineNames: Record<string, string>
}

// Data fetching

export async function getReportData(): Promise<ReportData> {
  const supabase = createServerClient()

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Run all queries in parallel
  const [totalResult, todayResult, last7Result, last30Result, pathCountsResult, monthCountsResult] = await Promise.all([
    supabase.from('api_log_entries').select('*', { count: 'exact', head: true }),
    supabase.from('api_log_entries').select('*', { count: 'exact', head: true }).gte('timestamp', today.toISOString()),
    supabase.from('api_log_entries').select('*', { count: 'exact', head: true }).gte('timestamp', last7Days.toISOString()),
    supabase.from('api_log_entries').select('*', { count: 'exact', head: true }).gte('timestamp', last30Days.toISOString()),
    supabase.rpc('get_path_counts'),
    supabase.rpc('get_monthly_counts'),
  ])

  const requestsByPath = (pathCountsResult.data || []).map((row: { path: string; count: number }) => ({
    path: row.path,
    count: Number(row.count),
  }))

  const requestsByMonth = (monthCountsResult.data || []).map((row: { month: string; count: number }) => ({
    date: row.month,
    count: Number(row.count),
  }))

  return {
    summary: {
      totalRequests: totalResult.count || 0,
      todayRequests: todayResult.count || 0,
      last7DaysRequests: last7Result.count || 0,
      last30DaysRequests: last30Result.count || 0,
    },
    requestsByPath,
    requestsByDay: requestsByMonth,
  }
}

export async function getTopMachines(): Promise<TopMachine[]> {
  const supabase = createServerClient()

  // Use RPC function for aggregation
  const { data: topMachinesData } = await supabase.rpc('get_top_machines')

  if (!topMachinesData || topMachinesData.length === 0) return []

  const topOpendbIds = (topMachinesData.map((row: { opendb_id: string; count: number }) => [
    row.opendb_id,
    Number(row.count),
  ]) as [string, number][]).slice(0, 10)

  if (topOpendbIds.length === 0) return []

  // Get machine names
  const { data: machinesData } = await supabase
    .from('pinball_machines')
    .select('opendb_id, name')
    .in(
      'opendb_id',
      topOpendbIds.map(([id]) => id)
    )

  const nameMap = new Map(machinesData?.map(m => [m.opendb_id, m.name]) || [])

  return topOpendbIds.map(([opendbId, count]) => ({
    opendbId,
    name: nameMap.get(opendbId) || opendbId,
    count,
  }))
}

export async function getPaginatedLogs(page: number = 1, pageSize: number = 50): Promise<PaginatedLogs> {
  const supabase = createServerClient()

  // Get total count
  const { count: total } = await supabase
    .from('api_log_entries')
    .select('*', { count: 'exact', head: true })

  const totalCount = total || 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const offset = (page - 1) * pageSize

  // Get page of entries
  const { data } = await supabase
    .from('api_log_entries')
    .select('id, method, path, query_string, timestamp, ip_address')
    .order('timestamp', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const entries = data || []

  // Resolve machine names for paths like /rules/XXXXX or /api/pinrules/XXXXX
  const opendbIds = [...new Set(
    entries
      .map(e => e.path?.match(/(?:\/rules\/|\/api\/pinrules\/)([A-Za-z0-9_-]+)/)?.[1])
      .filter((id): id is string => !!id)
  )]

  let machineNames: Record<string, string> = {}
  if (opendbIds.length > 0) {
    const { data: machines } = await supabase
      .from('pinball_machines')
      .select('opendb_id, name')
      .in('opendb_id', opendbIds)

    machineNames = Object.fromEntries(
      (machines || []).map(m => [m.opendb_id, m.name])
    )
  }

  return {
    entries,
    total: totalCount,
    page,
    pageSize,
    totalPages,
    machineNames,
  }
}
