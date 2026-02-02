'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

interface Machine {
  opendbId: string
  name: string
}

interface PinSearchProps {
  autoFocus?: boolean
  placeholder?: string
}

export default function PinSearch({ autoFocus = false, placeholder = 'Search for a pinball machine...' }: PinSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Machine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    const searchMachines = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/pinrules/search?query=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchMachines, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (machine: Machine) => {
    setQuery('')
    setShowResults(false)
    router.push(`/rules/${machine.opendbId}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        break
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--bright-green)] focus:outline-none text-lg"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
        >
          {results.map((machine, index) => (
            <button
              key={machine.opendbId}
              onClick={() => handleSelect(machine)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                index === selectedIndex ? 'bg-gray-100' : ''
              } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-[var(--dark-green)] font-medium">{machine.name}</span>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No machines found
        </div>
      )}
    </div>
  )
}
