import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Silverball Rules',
  description: 'Learn about Bob Matthews and his guide to classic pinball machines.'
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-8">
        About
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          About Bob Matthews
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Bob Matthews is a legendary figure in the competitive pinball community.
            His &quot;Guide to Classic Pinball Machines&quot; has been an invaluable resource
            for pinball players of all skill levels since the 1990s.
          </p>
          <p>
            Bob&apos;s guides provide practical, no-nonsense advice for getting the most
            out of classic pinball machines. His &quot;Quickie Version&quot; summaries help
            players quickly understand the key shots and strategies for each machine,
            while his detailed full rules provide deep insights for those looking to
            master a particular game.
          </p>
          <p>
            The guides cover hundreds of machines from the golden age of pinball,
            including games from manufacturers like Williams, Bally, Gottlieb,
            Stern, and Data East.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          About Silverball Rules
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Silverball Rules is a web application that makes Bob&apos;s pinball guides
            accessible to players everywhere. Whether you&apos;re at a tournament,
            visiting an arcade, or playing at home, you can quickly look up
            strategies for any machine in our database.
          </p>
          <p>
            This project is maintained by Frank Goeltl at{' '}
            <a
              href="https://silverballmania.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              silverballmania.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          Useful Links
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.abeflips.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              Abe Flips
            </a>
            {' '}- Master pinball techniques with in-depth tutorials
          </li>
          <li>
            <a
              href="https://www.ifpapinball.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              IFPA
            </a>
            {' '}- International Flipper Pinball Association
          </li>
          <li>
            <a
              href="https://app.matchplay.events"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              Match Play Events
            </a>
            {' '}- Tournament software
          </li>
          <li>
            <a
              href="https://opdb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              OPDB.org
            </a>
            {' '}- Open Pinball Database
          </li>
          <li>
            <a
              href="https://pinballmap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              Pinball Map
            </a>
            {' '}- Find pinball machines near you
          </li>
          <li>
            <a
              href="https://pinballprimer.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              Pinball Primer
            </a>
            {' '}- Modern pinball machine rulesets
          </li>
          <li>
            <a
              href="https://pintips.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              PinTips.net
            </a>
            {' '}- Community pinball tips and strategies
          </li>
          <li>
            <a
              href="https://tiltforums.com/c/game-specific/rulesheet-wikis/18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              Tilt Forums Rulesheets
            </a>
            {' '}- Community-maintained rulesheet wikis
          </li>
        </ul>
      </section>

    </div>
  )
}
