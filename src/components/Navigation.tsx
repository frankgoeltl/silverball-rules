'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, List, BookOpen, Info, Mail } from 'lucide-react'

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
    { href: '/support', label: 'Support', icon: Mail },
    { href: '/search', label: 'Search', icon: Search },
  ]

  return (
    <header className="bg-black text-white">
      {/* Main navbar */}
      <nav className="flex items-center justify-between px-6 pt-4 pb-0">
        <Link href="/" className="text-3xl font-black tracking-wide hover:text-[var(--dark-green)] transition-colors font-[family-name:var(--font-montserrat)]">
          Bob&apos;s Guide
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 font-[family-name:var(--font-montserrat)] font-semibold text-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2"
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile search + menu button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/search"
            className="p-2 text-white"
            aria-label="Search"
          >
            <Search size={24} />
          </Link>
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-black/95 z-50">
          <div className="flex flex-col items-center gap-8 pt-12 font-[family-name:var(--font-montserrat)] font-semibold text-white">
            {navLinks.filter(link => link.href !== '/search').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-xl"
              >
                <link.icon size={24} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sponsor bar */}
      <div className="bg-black text-center pt-0 pb-1 text-[13px] leading-tight">
        <span className="text-gray-300">
          Hosting provided by{' '}
          <a
            href="https://www.playfield-protectors.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--bright-green)] hover:text-white transition-colors"
          >
            playfield protectors
          </a>
        </span>
      </div>
    </header>
  )
}
