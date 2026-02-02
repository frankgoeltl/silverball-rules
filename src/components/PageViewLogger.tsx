'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewLogger() {
  const pathname = usePathname()

  useEffect(() => {
    // Only log rules pages
    if (!pathname.startsWith('/rules/')) {
      return
    }

    // Log page view via API
    fetch('/api/log-pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // Silently fail
    })
  }, [pathname])

  return null
}
