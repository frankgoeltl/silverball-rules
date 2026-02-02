import PinList from '@/components/PinList'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'All Machines - Silverball Rules',
  description: 'Browse all pinball machines with rules in our database. Filter by letter to find your machine.'
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getAllMachines() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('pinball_rules')
      .select(`
        opendb_id,
        pinball_machines!inner(name)
      `)

    if (error) return []

    const machines = (data || []).map(item => ({
      opendbId: item.opendb_id,
      name: (item.pinball_machines as unknown as { name: string }).name,
    }))

    return machines.sort((a, b) => a.name.localeCompare(b.name))
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
