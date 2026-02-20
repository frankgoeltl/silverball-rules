'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { BarChart3, Clock, TrendingUp, Trophy, List, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import type { ReportData, TopMachine, PaginatedLogs } from '@/app/reports/actions'
import { getTopMachines, getPaginatedLogs } from '@/app/reports/actions'

interface Props {
  data: ReportData
}

// Normalize legacy PascalCase paths to lowercase
function normalizePath(path: string | null): string {
  if (!path) return ''
  return path.replace(/\/api\/PinRules\//i, '/api/pinrules/')
}

type TabType = 'overview' | 'top-machines' | 'logs'

export default function ReportsDashboard({ data }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          icon={BarChart3}
          label="Overview"
        />
        <TabButton
          active={activeTab === 'top-machines'}
          onClick={() => setActiveTab('top-machines')}
          icon={Trophy}
          label="Top Machines"
        />
        <TabButton
          active={activeTab === 'logs'}
          onClick={() => setActiveTab('logs')}
          icon={List}
          label="All Logs"
        />
      </div>

      {activeTab === 'overview' && <OverviewTab data={data} />}
      {activeTab === 'top-machines' && <TopMachinesTab />}
      {activeTab === 'logs' && <LogsTab />}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-3 px-1 font-medium transition-colors ${
        active
          ? 'text-[var(--dark-green)] border-b-2 border-[var(--dark-green)]'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

function OverviewTab({ data }: { data: ReportData }) {
  const { summary, requestsByPath, requestsByDay } = data

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={BarChart3} label="Total Requests" value={summary.totalRequests.toLocaleString()} />
        <StatCard icon={Clock} label="Today" value={summary.todayRequests.toLocaleString()} />
        <StatCard icon={TrendingUp} label="Last 7 Days" value={summary.last7DaysRequests.toLocaleString()} />
      </div>

      {/* Requests by path */}
      <div className="bg-[var(--light-grey)] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[var(--dark-green)] mb-4">Requests by Endpoint (All Time)</h3>
        <div className="space-y-3">
          {requestsByPath.map(({ path, count }) => (
            <div key={path} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-gray-700 truncate">{path}</div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-[var(--dark-green)] rounded-full"
                    style={{
                      width: `${(count / requestsByPath[0].count) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 w-20 text-right">{count.toLocaleString()}</div>
            </div>
          ))}
          {requestsByPath.length === 0 && <div className="text-gray-500 text-center py-4">No data available</div>}
        </div>
      </div>

      {/* Requests by day */}
      <div className="bg-[var(--light-grey)] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[var(--dark-green)] mb-4">Monthly Requests (Last 12 Months)</h3>
        {requestsByDay.length > 0 ? (
          (() => {
            const maxCount = Math.max(...requestsByDay.map(d => d.count))
            const chartHeight = 128 // h-32 = 8rem = 128px
            return (
              <div>
                <div className="flex items-end gap-2 h-32 mb-2">
                  {requestsByDay.map(({ date, count }) => {
                    const barHeight = Math.max(4, Math.round((count / maxCount) * chartHeight))
                    return (
                      <div key={date} className="flex-1 flex flex-col justify-end items-center max-w-16">
                        <div
                          className="w-full bg-[var(--dark-green)] rounded-t hover:bg-[var(--bright-green)] transition-colors cursor-pointer group relative"
                          style={{ height: `${barHeight}px` }}
                          title={`${date}: ${count.toLocaleString()} requests`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {count.toLocaleString()} requests
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  {requestsByDay.map(({ date }) => (
                    <div key={date} className="flex-1 text-center text-xs text-gray-500 max-w-16">
                      {date.slice(5)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()
        ) : (
          <div className="text-gray-500 text-center py-8">No recent activity</div>
        )}
      </div>
    </div>
  )
}

function TopMachinesTab() {
  const [machines, setMachines] = useState<TopMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(() => {
    startTransition(() => {
      getTopMachines().then(data => {
        setMachines(data)
        setLoading(false)
      })
    })
  }, [])

  useEffect(() => { refresh() }, [refresh])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading top machines...</div>
  }

  return (
    <div className="bg-[var(--light-grey)] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[var(--dark-green)]">Top 10 Most Viewed Machines</h3>
        <button
          onClick={refresh}
          disabled={isPending}
          className="p-2 rounded hover:bg-white/50 disabled:opacity-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={isPending ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 px-2 font-medium text-gray-600 w-12">#</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Machine</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600 w-24">Views</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine, index) => (
              <tr key={machine.opendbId} className="border-b border-gray-200 hover:bg-white/50">
                <td className="py-3 px-2 text-gray-500 font-medium">{index + 1}</td>
                <td className="py-3 px-2">
                  <Link
                    href={`/rules/${machine.opendbId}`}
                    className="text-[var(--dark-green)] hover:underline font-medium"
                  >
                    {machine.name}
                  </Link>
                </td>
                <td className="py-3 px-2 text-right font-mono text-gray-700">{machine.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {machines.length === 0 && <div className="text-gray-500 text-center py-8">No machine data available</div>}
      </div>
    </div>
  )
}

function LogsTab() {
  const [logsData, setLogsData] = useState<PaginatedLogs | null>(null)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      getPaginatedLogs(page).then(setLogsData)
    })
  }, [page])

  if (!logsData) {
    return <div className="text-center py-8 text-gray-500">Loading logs...</div>
  }

  const { entries, total, totalPages, machineNames } = logsData

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">{total.toLocaleString()} total entries</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isPending}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isPending}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[var(--light-grey)] rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 px-3 font-medium text-gray-600">Time</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600 w-20">Method</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Path</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600 w-32">IP</th>
            </tr>
          </thead>
          <tbody className={isPending ? 'opacity-50' : ''}>
            {entries.map(entry => (
              <tr key={entry.id} className="border-b border-gray-200 hover:bg-white/50">
                <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="py-2 px-3">
                  <span className="px-2 py-1 bg-[var(--dark-green)] text-white text-xs rounded">{entry.method}</span>
                </td>
                <td className="py-2 px-3 font-mono text-gray-700">
                  {normalizePath(entry.path)}
                  {entry.query_string && <span className="text-gray-400">{entry.query_string}</span>}
                  {(() => {
                    const id = entry.path?.match(/(?:\/rules\/|\/api\/pinrules\/)([A-Za-z0-9_-]+)/)?.[1]
                    const name = id && machineNames[id]
                    return name ? <span className="block text-xs text-gray-500">{name}</span> : null
                  })()}
                </td>
                <td className="py-2 px-3 text-gray-500 font-mono text-xs">{entry.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && <div className="text-center py-8 text-gray-500">No log entries found</div>}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
  value: string
}) {
  return (
    <div className="bg-[var(--light-grey)] rounded-lg p-4 text-center flex flex-col items-center">
      <Icon size={20} className="text-gray-500 mb-1" />
      <span className="text-xs text-gray-600 mb-1">{label}</span>
      <div className="text-2xl font-bold text-[var(--dark-green)]">{value}</div>
    </div>
  )
}
