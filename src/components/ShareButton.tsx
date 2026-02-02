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
      className={`flex items-center gap-2 rounded-full transition-colors ${
        copied
          ? 'px-4 py-2 bg-[var(--dark-green)] text-white'
          : 'p-3 bg-gray-100 hover:bg-gray-200'
      }`}
      title={copied ? 'Copied!' : 'Share'}
    >
      {copied ? (
        <>
          <Check size={18} />
          <span className="text-sm font-medium">Copied!</span>
        </>
      ) : (
        <Share2 size={20} className="text-gray-600" />
      )}
    </button>
  )
}
