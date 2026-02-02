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
          About Bob&apos;s Guide
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This guide covers over 400 pinball machines made from the 1960&apos;s through
            the mid-1980&apos;s. The guide begins with general information about these
            games and some terminology, then moves on to skills, techniques and strategy.
            The main section has specific details and advice for each machine.
          </p>
          <p>
            You should be able to click any game or technique section at the left to go
            directly to it; it might take a few moments, though, since this is a long
            document. I occasionally add games or update the tips on existing games, so
            this guide does change over time.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          About Bob
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Hi, I&apos;m Bob Matthews, a.k.a. BobMathUse, a.k.a. BMU [high score initials].
            I started playing pinball in 1972. It was 10 cents a game, all Electro-Mechanical
            games, &quot;EMs&quot; for short. The machines were add-a-ball only, since replays were
            not permitted where I lived in upstate New York. (Fortunately, upstate and New
            York City often disagreed on things, and still do; there was no issue with
            pinball&apos;s legality where I was.)
          </p>
          <p>
            To make my dimes go the furthest, I had to strive for long games. This is some
            of my accumulated knowledge from the past 50 years. My ideas aren&apos;t always
            perfect, nor my execution of them, but they&apos;ve worked pretty well for me. In
            some cases, expert players may have different opinions on choices of shots or
            which flipper techniques to use than what I describe here. That&apos;s fine; if you
            find or hear of something better that works for you, use it! If you find the
            tips here help you, you&apos;re welcome, and spread the word. And if you want to
            pass this along to someone or somewhere else, go ahead, as long as it&apos;s
            attributed to me.
          </p>
          <p>
            You can reach me at{' '}
            <a
              href="mailto:bobmathuse@aol.com"
              className="text-[var(--dark-green)] hover:underline"
            >
              bobmathuse@aol.com
            </a>
            ; I&apos;ve done social media for 40 years, but I don&apos;t do fb.
          </p>
          <p>
            FYI, I do photography on the side. My wife and I sometimes sell them, but
            I&apos;ve put a large number of general photos online for public view. You can
            find them at the address below. Subjects include the Rose Parade, balloon
            festivals, auto shows and museums, gardens, trips to Europe, &quot;Fun with Ice,&quot;
            and some wacky races and parades. Like this guide, the photo catalog changes
            over time and I add descriptions when I can.
          </p>
          <p>
            <a
              href="https://flickr.com/photos/150168823@N06/albums"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--dark-green)] hover:underline"
            >
              flickr.com/photos/150168823@N06/albums
            </a>
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[var(--dark-green)] mb-4">
          About silverballmania
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            I&apos;m Frank aka FRG aka silverballmania. My journey into pinball began a bit
            later in life, in 2006, when we got a STTNG machine for some office fun.
            Before this, my pinball experience was limited to just one game on a Terminator
            2 back in the early &apos;90s, which quickly convinced me that I was more adept at
            enjoying a good beer than playing pinball. My real passion for pinball took off
            in 2009 after I added a second machine and started participating in tournaments
            from 2010.
          </p>
          <p>
            Fast forward to today, and my enthusiasm for pinball has only intensified.
            Every aspect of learning and playing the game brings immense joy, with
            competition sparking an even greater passion in me. Over the past decade, my
            interest has led to a rapid turnover of pinball machines, as I found myself
            falling in love with nearly every machine I played. This passion eventually
            drove me to delve deeper into the world of pinball in my own basement, where
            I could explore these machines in detail. My particular affection for classic
            pinball machines meant that discovering Bob&apos;s Guide on the IFPA page was like
            hitting the jackpot; it resonated with me on so many levels.
          </p>
          <p>
            Initially, my quest for knowledge had me turning to various resources such as
            the pinball archive, YouTube, flippermarkt, tiltforums, and pintips. But it
            was just a few weeks ago when I came across Bob&apos;s Guide. This guide proved
            to be an incredible source of inspiration. I contacted Bob to discuss making
            his guide more accessible for web and mobile users, and with his consent,
            we&apos;ve done just that - or at least, that&apos;s the hope!
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
