'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Machine {
  opendbId: string
  name: string
}

interface PinListProps {
  machines: Machine[]
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9']

export default function PinList({ machines }: PinListProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>('A')

  const filteredMachines = useMemo(() => {
    if (selectedLetter === '0-9') {
      return machines.filter((m) => /^[0-9]/.test(m.name))
    }
    return machines.filter((m) =>
      m.name.toUpperCase().startsWith(selectedLetter)
    )
  }, [machines, selectedLetter])

  const availableLetters = useMemo(() => {
    const letters = new Set<string>()
    machines.forEach((m) => {
      const firstChar = m.name.charAt(0).toUpperCase()
      if (/[0-9]/.test(firstChar)) {
        letters.add('0-9')
      } else if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar)
      }
    })
    return letters
  }, [machines])

  return (
    <div>
      {/* Letter filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {LETTERS.map((letter) => {
          const isAvailable = availableLetters.has(letter)
          const isSelected = selectedLetter === letter

          return (
            <button
              key={letter}
              onClick={() => isAvailable && setSelectedLetter(letter)}
              disabled={!isAvailable}
              className={`
                w-10 h-10 rounded-lg font-medium text-sm transition-colors
                ${isSelected
                  ? 'bg-[var(--bright-green)] text-white'
                  : isAvailable
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Machine count */}
      <p className="text-gray-600 mb-4">
        {filteredMachines.length} machine{filteredMachines.length !== 1 ? 's' : ''} starting with &quot;{selectedLetter}&quot;
      </p>

      {/* Machine list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredMachines.map((machine) => (
          <Link
            key={machine.opendbId}
            href={`/rules/${machine.opendbId}`}
            className="p-3 border border-gray-200 rounded-lg hover:border-[var(--bright-green)] hover:shadow-md transition-all"
          >
            <span className="text-[var(--dark-green)] font-medium">{machine.name}</span>
          </Link>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No machines found starting with &quot;{selectedLetter}&quot;
        </p>
      )}
    </div>
  )
}
