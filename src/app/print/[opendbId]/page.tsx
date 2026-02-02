import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

interface Rule {
  opendbId: string
  quickieVersion: string | null
  goToFlipper: string | null
  riskIndex: string | null
  shotsToMaster: string | null
  styleAlert: string | null
  skillShot: string | null
  fullRules: string | null
  playfieldRisk: string | null
}

interface Machine {
  id: number
  name: string
  opendbId: string
}

interface OpdbMachine {
  opdbId: string
  name: string | null
  shortname: string | null
  manufacture_date: string | null
  manufacturer_name: string | null
  type: string | null
  display: string | null
  player_count: number | null
  image_url_medium: string | null
}

interface PinData {
  pinballMachine: Machine | null
  rules: Rule[]
  opdbMachine: OpdbMachine | null
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getMachineData(opendbId: string): Promise<PinData | null> {
  try {
    const supabase = getSupabaseClient()

    const { data: machine } = await supabase
      .from('pinball_machines')
      .select('id, opendb_id, name')
      .eq('opendb_id', opendbId)
      .single()

    const { data: rules } = await supabase
      .from('pinball_rules')
      .select('*')
      .eq('opendb_id', opendbId)

    const { data: opdbMachine } = await supabase
      .from('opdb_machines')
      .select('*')
      .eq('opdb_id', opendbId)
      .single()

    if (!machine && !opdbMachine) {
      return null
    }

    return {
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
        name: opdbMachine.name,
        shortname: opdbMachine.shortname,
        manufacture_date: opdbMachine.manufacture_date,
        manufacturer_name: opdbMachine.manufacturer_name,
        type: opdbMachine.type,
        display: opdbMachine.display,
        player_count: opdbMachine.player_count,
        image_url_medium: opdbMachine.image_url_medium,
      } : null,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ opendbId: string }>
}): Promise<Metadata> {
  const { opendbId } = await params
  const data = await getMachineData(opendbId)
  if (!data) {
    return { title: 'Machine Not Found' }
  }
  const machineName = data.pinballMachine?.name || data.opdbMachine?.name || 'Unknown Machine'
  return {
    title: `${machineName} (Print) - Silverball Rules`,
  }
}

function formatYear(dateString: string | null): string {
  if (!dateString) return ''
  const year = new Date(dateString).getFullYear()
  return isNaN(year) ? '' : year.toString()
}

export default async function PrintPage({
  params
}: {
  params: Promise<{ opendbId: string }>
}) {
  const { opendbId } = await params
  const data = await getMachineData(opendbId)

  if (!data || (!data.pinballMachine && !data.opdbMachine)) {
    notFound()
  }

  const { pinballMachine, rules, opdbMachine } = data
  const rule = rules[0]
  const machineName = pinballMachine?.name || opdbMachine?.name || 'Unknown Machine'

  const typeDisplay = opdbMachine?.type?.toUpperCase() || ''
  const titleParts = [machineName]
  if (typeDisplay) titleParts[0] += ` ${typeDisplay}`
  if (opdbMachine?.manufacturer_name) titleParts.push(opdbMachine.manufacturer_name)
  if (opdbMachine?.manufacture_date) titleParts.push(formatYear(opdbMachine.manufacture_date))

  return (
    <div className="max-w-3xl mx-auto p-8 print:p-4">
      {/* Header with title */}
      <h1 className="text-2xl font-bold text-dark-green mb-4">
        {titleParts[0]}{titleParts.length > 1 ? ` - ${titleParts.slice(1).join(' | ')}` : ''}
      </h1>

      {/* Image and machine info section */}
      <div className="flex gap-6 mb-6">
        {opdbMachine?.image_url_medium && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opdbMachine.image_url_medium}
              alt={`${machineName} backglass`}
              className="w-40 h-auto"
            />
          </div>
        )}
        <div className="flex-1">
          {opdbMachine?.shortname && (
            <p className="mb-1"><strong>Shortname:</strong> {opdbMachine.shortname}</p>
          )}
          {opdbMachine?.player_count && (
            <p className="mb-1"><strong>Players:</strong> {opdbMachine.player_count}</p>
          )}
          {opdbMachine?.display && (
            <p className="mb-1"><strong>Display:</strong> {opdbMachine.display}</p>
          )}
          {rule?.quickieVersion && (
            <>
              <p className="font-bold mt-3 mb-1">Quickie Version:</p>
              <p className="whitespace-pre-line capitalize-first-letter">{rule.quickieVersion}</p>
            </>
          )}
        </div>
      </div>

      {/* Go-to Flipper */}
      {rule?.goToFlipper && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-dark-green mb-1">Go-to Flipper:</h2>
          <p>{rule.goToFlipper}</p>
        </section>
      )}

      {/* Playfield Risk */}
      {rule?.playfieldRisk && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-dark-green mb-1">Playfield Risk:</h2>
          <p className="whitespace-pre-line">{rule.playfieldRisk}</p>
        </section>
      )}

      {/* Full Rules */}
      {rule?.fullRules && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-dark-green mb-1">Full Rules:</h2>
          <div className="space-y-3">
            {rule.fullRules.split('\n\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line capitalize-first-letter">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Skill Shot */}
      {rule?.skillShot && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-dark-green mb-1">Skill Shot:</h2>
          <p className="whitespace-pre-line capitalize-first-letter">{rule.skillShot}</p>
        </section>
      )}

      {/* Style Alert */}
      {rule?.styleAlert && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-dark-orange mb-1">Style Alert:</h2>
          <p className="whitespace-pre-line italic">{rule.styleAlert}</p>
        </section>
      )}
    </div>
  )
}
