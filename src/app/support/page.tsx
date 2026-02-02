import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support - Silverball Rules',
  description: 'Get support for Silverball Rules or contribute to the project.'
}

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-8">
        Support
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          Contact Us
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Mail className="text-[var(--bright-green)] mt-1" size={24} />
            <div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-gray-600">
                For questions, corrections, or suggestions, please email us at{' '}
                <a
                  href="mailto:info@silverballmania.com"
                  className="text-[var(--bright-green)] hover:underline"
                >
                  info@silverballmania.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <MessageCircle className="text-[var(--bright-green)] mt-1" size={24} />
            <div>
              <h3 className="font-semibold mb-1">Feedback</h3>
              <p className="text-gray-600">
                Found an error in the rules? Have a suggestion for improvement?
                We&apos;d love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          Contributing
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Silverball Rules is a community resource. If you have expertise on
            a particular machine and would like to contribute or correct rules,
            please get in touch.
          </p>
          <p>
            We especially welcome:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Corrections to existing rules</li>
            <li>New machine rules for games not yet covered</li>
            <li>Updated strategies based on competitive play</li>
            <li>Translations to other languages</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-start gap-4 p-6 bg-[var(--light-grey)] rounded-lg">
          <Heart className="text-red-500 mt-1" size={24} />
          <div>
            <h2 className="text-xl font-bold text-[var(--dark-green)] mb-2">
              Support the Project
            </h2>
            <p className="text-gray-700">
              If you find Silverball Rules useful, please consider sharing it
              with your pinball friends. The more people use and contribute to
              this resource, the better it becomes for everyone!
            </p>
          </div>
        </div>
      </section>

      <div className="text-center pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="text-[var(--bright-green)] hover:underline font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
