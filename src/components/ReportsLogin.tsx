'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/reports/actions'
import { Lock } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[var(--dark-green)] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'Verifying...' : 'Access Reports'}
    </button>
  )
}

export default function ReportsLogin() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await loginAction(formData)
    if (!result.success) {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[var(--light-grey)] rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[var(--dark-green)] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-[var(--dark-grey)] mb-6">
          Enter Password to View Reports
        </h2>

        <form action={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dark-green)] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
