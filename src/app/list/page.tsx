import PinList from '@/components/PinList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Machines - Silverball Rules',
  description: 'Browse all pinball machines with rules in our database. Filter by letter to find your machine.'
}

async function getAllMachines() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/pinrules/opendbids`, {
      next: { revalidate: 3600 }
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name)
    )
  } catch {
    return []
  }
}

export default async function ListPage() {
  const machines = await getAllMachines()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-2">
        All Machines
      </h1>
      <p className="text-gray-600 mb-8">
        Browse {machines.length} pinball machines with rules in our database.
      </p>

      <PinList machines={machines} />
    </div>
  )
}
