'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, List, BookOpen, Info, HeartHandshake } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide navigation on print pages
  if (pathname?.startsWith('/print')) {
    return null
  }

  const navLinks = [
    { href: '/guide', label: 'Guide', icon: BookOpen },
    { href: '/list', label: 'List', icon: List },
    { href: '/about', label: 'About', icon: Info },
    { href: '/support', label: 'Support', icon: HeartHandshake },
    { href: '/search', label: 'Search', icon: Search },
  ]

  return (
    <header className="bg-black text-white">
      {/* Main navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide hover:text-[var(--bright-green)] transition-colors">
          SILVERBALL RULES
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 hover:text-[var(--bright-green)] transition-colors ${
                pathname === link.href ? 'text-[var(--bright-green)]' : ''
              }`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-black/95 z-50">
          <div className="flex flex-col items-center gap-8 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 text-xl hover:text-[var(--bright-green)] transition-colors ${
                  pathname === link.href ? 'text-[var(--bright-green)]' : ''
                }`}
              >
                <link.icon size={24} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sponsor bar */}
      <div className="bg-[var(--dark-grey)] text-center py-2 text-sm">
        <span className="text-gray-300">Bob&apos;s Guide to Classic Pinball Machines</span>
      </div>
    </header>
  )
}
