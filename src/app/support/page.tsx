import type { Metadata } from 'next'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support - Silverball Rules',
  description: 'Get support for Silverball Rules or report issues.'
}

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-8">
        Support
      </h1>

      <div className="space-y-6 text-gray-700">
        <p>
          Bob put a lot of effort into this, and I also spent several hours bringing
          it into this format. However, there might still be some typos, misspellings,
          or incorrect connections to backglasses, pinball names, etc. since there was
          some automation importing the Google doc.
        </p>

        <div className="flex items-start gap-4 p-6 bg-[var(--light-grey)] rounded-lg">
          <Mail className="text-[var(--dark-green)] mt-1" size={24} />
          <div>
            <p>
              If you find any issues, please feel free to drop me an email at{' '}
              <a
                href="mailto:info@silverballmania.com"
                className="text-[var(--dark-green)] hover:underline"
              >
                info@silverballmania.com
              </a>
              , and I will fix them.
            </p>
          </div>
        </div>

        <p>
          But please be aware that we follow the rules as they are, since they may
          still be correct on machines with different settings. ;-)
        </p>
      </div>

    </div>
  )
}
