import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { logApiRequest } from '@/lib/logging'
import { getClientIp, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ opendbId: string }> }
) {
  const ip = getClientIp(request)
  const { allowed, resetAt } = checkRateLimit(ip)
  if (!allowed) {
    return rateLimitResponse(resetAt)
  }

  const { opendbId } = await params
  const supabase = createServerClient()

  // Log the API request
  await logApiRequest(request, `/api/pinrules/${opendbId}`)

  // Fetch pinball machine
  const { data: machine } = await supabase
    .from('pinball_machines')
    .select('id, opendb_id, name')
    .eq('opendb_id', opendbId)
    .single()

  // Fetch pinball rules
  const { data: rules } = await supabase
    .from('pinball_rules')
    .select('*')
    .eq('opendb_id', opendbId)

  // Fetch OPDB machine data
  const { data: opdbMachine } = await supabase
    .from('opdb_machines')
    .select('*')
    .eq('opdb_id', opendbId)
    .single()

  if (!machine && !opdbMachine) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Format response to match existing .NET API format
  const response = {
    pinballMachine: machine ? {
      id: machine.id,
      name: machine.name,
      opendbId: machine.opendb_id,
    } : null,
    rules: (rules || []).map(r => ({
      opendbId: r.opendb_id,
      quickieVersion: r.quickie_version,
      goToFlipper: r.go_to_flipper,
      riskIndex: r.risk_index,
      shotsToMaster: r.shots_to_master,
      styleAlert: r.style_alert,
      skillShot: r.skill_shot,
      fullRules: r.full_rules,
      playfieldRisk: r.playfield_risk,
    })),
    opdbMachine: opdbMachine ? {
      opdbId: opdbMachine.opdb_id,
      is_machine: opdbMachine.is_machine,
      name: opdbMachine.name,
      shortname: opdbMachine.shortname,
      ipdb_id: opdbMachine.ipdb_id,
      manufacture_date: opdbMachine.manufacture_date,
      manufacturer_name: opdbMachine.manufacturer_name,
      type: opdbMachine.type,
      display: opdbMachine.display,
      player_count: opdbMachine.player_count,
      image_url_medium: opdbMachine.image_url_medium,
    } : null,
  }

  return NextResponse.json(response)
}
