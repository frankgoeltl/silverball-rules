'use client'

import { Share2, Check } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      title={copied ? 'Copied!' : 'Share'}
    >
      {copied ? (
        <Check size={20} className="text-[var(--dark-green)]" />
      ) : (
        <Share2 size={20} className="text-gray-600" />
      )}
    </button>
  )
}
