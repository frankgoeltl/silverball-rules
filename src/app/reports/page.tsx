import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import ReportsLogin from '@/components/ReportsLogin'
import ReportsDashboard from '@/components/ReportsDashboard'
import { getReportData, logoutAction } from './actions'

export const metadata: Metadata = {
  title: 'Reports - Silverball Rules',
  description: 'API usage reports and analytics',
  robots: 'noindex, nofollow',
}

// Cache report data for 5 minutes
export const revalidate = 300

async function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Logout
      </button>
    </form>
  )
}

export default async function ReportsPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('reports_auth')

  const isAuthenticated = authCookie?.value === 'authenticated'

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-8">Reports</h1>
        <ReportsLogin />
      </div>
    )
  }

  const reportData = await getReportData()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--dark-green)]">API Reports</h1>
        <LogoutButton />
      </div>
      <ReportsDashboard data={reportData} />
    </div>
  )
}
