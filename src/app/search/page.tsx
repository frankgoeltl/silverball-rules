import PinSearch from '@/components/PinSearch'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search - Silverball Rules',
  description: 'Search for pinball machines by name to find rules and strategies.'
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-4">
          Search Machines
        </h1>
        <p className="text-gray-600 mb-8">
          Search for a pinball machine by name to find rules and strategies.
        </p>

        <div className="flex justify-center">
          <PinSearch autoFocus placeholder="Type to search..." />
        </div>
      </div>
    </div>
  )
}
