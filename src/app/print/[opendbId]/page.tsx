import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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
  manufacture_date: string | null
  manufacturer_name: string | null
  type: string | null
  display: string | null
  player_count: number | null
  image_url_medium: string | null
}

interface PinData {
  pinballMachine: Machine
  rules: Rule[]
  opdbMachine: OpdbMachine | null
}

async function getMachineData(opendbId: string): Promise<PinData | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/pinrules/${opendbId}`, {
      next: { revalidate: 3600 }
    })
    if (!response.ok) return null
    return response.json()
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
  return {
    title: `${data.pinballMachine.name} (Print) - Silverball Rules`,
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

  if (!data) {
    notFound()
  }

  const { pinballMachine, rules, opdbMachine } = data
  const rule = rules[0]

  return (
    <div className="max-w-3xl mx-auto p-8 print:p-4">
      {/* Header */}
      <header className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold">{pinballMachine.name}</h1>
        <p className="text-gray-600">
          {opdbMachine?.manufacturer_name && `${opdbMachine.manufacturer_name}`}
          {opdbMachine?.manufacture_date && ` (${formatYear(opdbMachine.manufacture_date)})`}
          {opdbMachine?.type && ` • ${opdbMachine.type}`}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          From Bob&apos;s Guide to Classic Pinball Machines • silverballrules.com
        </p>
      </header>

      {/* Quickie Version */}
      {rule?.quickieVersion && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Quickie Version
          </h2>
          <p className="whitespace-pre-line">{rule.quickieVersion}</p>
        </section>
      )}

      {/* Quick stats in a row */}
      <section className="mb-6 grid grid-cols-3 gap-4 text-sm">
        {rule?.goToFlipper && (
          <div>
            <strong>Go-To Flipper:</strong> {rule.goToFlipper}
          </div>
        )}
        {rule?.riskIndex && (
          <div>
            <strong>Risk Index:</strong> {rule.riskIndex}
          </div>
        )}
        {rule?.shotsToMaster && (
          <div>
            <strong>Shots to Master:</strong> {rule.shotsToMaster}
          </div>
        )}
      </section>

      {/* Skill Shot */}
      {rule?.skillShot && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Skill Shot
          </h2>
          <p className="whitespace-pre-line">{rule.skillShot}</p>
        </section>
      )}

      {/* Style Alert */}
      {rule?.styleAlert && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Style Alert
          </h2>
          <p className="whitespace-pre-line italic">{rule.styleAlert}</p>
        </section>
      )}

      {/* Full Rules */}
      {rule?.fullRules && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Full Rules
          </h2>
          <div className="space-y-3 text-sm">
            {rule.fullRules.split('\n\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Playfield Risk */}
      {rule?.playfieldRisk && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Playfield Risk
          </h2>
          <p className="whitespace-pre-line">{rule.playfieldRisk}</p>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
        Printed from Silverball Rules • Bob&apos;s Guide to Classic Pinball Machines
      </footer>
    </div>
  )
}
