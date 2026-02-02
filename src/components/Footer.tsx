'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  // Hide footer on print and guide pages
  if (pathname?.startsWith('/print') || pathname === '/guide') {
    return null
  }

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()}{' '}
              <a
                href="https://www.silverballmania.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                silverballmania
              </a>
              . All rights reserved.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <Link href="/guide" className="hover:text-white transition-colors">
              Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
