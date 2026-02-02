import PinSearch from "@/components/PinSearch";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getRecentMachines() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('pinball_rules')
      .select(`
        opendb_id,
        pinball_machines!inner(name)
      `)
      .limit(20)

    if (error) return []

    return (data || []).map(item => ({
      opendbId: item.opendb_id,
      name: (item.pinball_machines as unknown as { name: string }).name,
    }))
  } catch {
    return [];
  }
}

export default async function Home() {
  const recentMachines = await getRecentMachines();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark-green)] mb-6">
          Welcome to Bob&apos;s Guide to Classic Pinball Machines
        </h1>

        <div className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto space-y-4">
          <p>
            This guide covers approx. 400 pinball machines made from the 1960&apos;s through the mid-1980&apos;s.
          </p>
          <p>
            The guide is presented free - if you like it, you can send a donation to{' '}
            <a
              href="https://projectpinball.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--bright-green)] hover:underline"
            >
              Project Pinball
            </a>
            {' '}and mention Bob.
          </p>
          <p>
            There&apos;s an{' '}
            <a
              href="https://youtu.be/PvgZ6LF4A-g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--bright-green)] hover:underline"
            >
              introduction video on YouTube
            </a>
            {' '}if you&apos;d like to learn more about all the features. Then take your time exploring
            the full guide — not just the quickie versions — it&apos;s worth it!
          </p>
        </div>

        {/* Search box */}
        <h2 className="text-xl font-semibold text-[var(--dark-grey)] mb-4">
          Search for a machine
        </h2>
        <div className="flex justify-center mb-4">
          <PinSearch autoFocus placeholder="Search for a pinball machine..." />
        </div>

        <p className="text-gray-600 mb-8">
          You can also{' '}
          <Link href="/list" className="text-[var(--bright-green)] hover:underline">
            explore the list
          </Link>
          ...
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/list"
            className="bg-[var(--bright-green)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--dark-green)] transition-colors"
          >
            Browse All Machines
          </Link>
          <Link
            href="/guide"
            className="border-2 border-[var(--bright-green)] text-[var(--bright-green)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--bright-green)] hover:text-white transition-colors"
          >
            Read the Guide
          </Link>
        </div>
      </section>

      {/* Featured machines */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-6">
          Featured Machines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentMachines.map((machine: { opendbId: string; name: string }) => (
            <Link
              key={machine.opendbId}
              href={`/rules/${machine.opendbId}`}
              className="p-4 border border-gray-200 rounded-lg hover:border-[var(--bright-green)] hover:shadow-md transition-all"
            >
              <span className="text-[var(--dark-green)] font-medium">{machine.name}</span>
            </Link>
          ))}
        </div>

        {recentMachines.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/list"
              className="text-[var(--bright-green)] hover:underline font-medium"
            >
              View all machines →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
