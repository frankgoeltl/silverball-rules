import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Info, Printer, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ShareButton from '@/components/ShareButton'

interface Rule {
  opendbId: string
  quickieVersion: string | null
  goToFlipper: string | null
  riskIndex: string | null
  shotsToMaster: string | null
  styleAlert: string | null
  skillShot: string | null
  fullRules: string | null
  playfieldRisk: string | null
}

interface Machine {
  id: number
  name: string
  opendbId: string
}

interface OpdbMachine {
  opdbId: string
  name: string | null
  manufacture_date: string | null
  manufacturer_name: string | null
  type: string | null
  display: string | null
  player_count: number | null
  image_url_medium: string | null
  ipdb_id: number | null
}

interface PinData {
  pinballMachine: Machine | null
  rules: Rule[]
  opdbMachine: OpdbMachine | null
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getMachineData(opendbId: string): Promise<PinData | null> {
  try {
    const supabase = getSupabaseClient()

    // Fetch pinball machine
    const { data: machine } = await supabase
      .from('pinball_machines')
      .select('id, opendb_id, name')
      .eq('opendb_id', opendbId)
      .single()

    // Fetch pinball rules
    const { data: rules } = await supabase
      .from('pinball_rules')
      .select('*')
      .eq('opendb_id', opendbId)

    // Fetch OPDB machine data
    const { data: opdbMachine } = await supabase
      .from('opdb_machines')
      .select('*')
      .eq('opdb_id', opendbId)
      .single()

    if (!machine && !opdbMachine) {
      return null
    }

    return {
      pinballMachine: machine ? {
        id: machine.id,
        name: machine.name,
        opendbId: machine.opendb_id,
      } : null,
      rules: (rules || []).map(r => ({
        opendbId: r.opendb_id,
        quickieVersion: r.quickie_version,
        goToFlipper: r.go_to_flipper,
        riskIndex: r.risk_index,
        shotsToMaster: r.shots_to_master,
        styleAlert: r.style_alert,
        skillShot: r.skill_shot,
        fullRules: r.full_rules,
        playfieldRisk: r.playfield_risk,
      })),
      opdbMachine: opdbMachine ? {
        opdbId: opdbMachine.opdb_id,
        name: opdbMachine.name,
        manufacture_date: opdbMachine.manufacture_date,
        manufacturer_name: opdbMachine.manufacturer_name,
        type: opdbMachine.type,
        display: opdbMachine.display,
        player_count: opdbMachine.player_count,
        image_url_medium: opdbMachine.image_url_medium,
        ipdb_id: opdbMachine.ipdb_id,
      } : null,
    }
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const supabase = getSupabaseClient()

  // Pre-render pages for all machines with rules
  const { data: rules } = await supabase
    .from('pinball_rules')
    .select('opendb_id')

  return (rules || []).map((rule) => ({
    opendbId: rule.opendb_id,
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ opendbId: string }>
}): Promise<Metadata> {
  const { opendbId } = await params
  const data = await getMachineData(opendbId)
  if (!data) {
    return { title: 'Machine Not Found' }
  }
  const machineName = data.pinballMachine?.name || data.opdbMachine?.name || 'Unknown Machine'
  const description = `Rules and strategy for ${machineName} pinball machine. ${data.rules[0]?.quickieVersion?.slice(0, 150) || ''}`
  const imageUrl = data.opdbMachine?.image_url_medium

  return {
    title: `${machineName} - Silverball Rules`,
    description,
    openGraph: {
      title: `${machineName} Pinball Rules`,
      description,
      type: 'article',
      ...(imageUrl && {
        images: [{ url: imageUrl, alt: `${machineName} backglass` }],
      }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: `${machineName} Pinball Rules`,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

function formatYear(dateString: string | null): string {
  if (!dateString) return 'Unknown'
  const year = new Date(dateString).getFullYear()
  return isNaN(year) ? 'Unknown' : year.toString()
}

export default async function RulesPage({
  params
}: {
  params: Promise<{ opendbId: string }>
}) {
  const { opendbId } = await params
  const data = await getMachineData(opendbId)

  if (!data || (!data.pinballMachine && !data.opdbMachine)) {
    notFound()
  }

  const { pinballMachine, rules, opdbMachine } = data
  const rule = rules[0]
  const machineName = pinballMachine?.name || opdbMachine?.name || 'Unknown Machine'

  // JSON-LD structured data for rich search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${machineName} Pinball Rules`,
    description: rule?.quickieVersion || `Rules and strategy for ${machineName} pinball machine`,
    ...(opdbMachine?.image_url_medium && { image: opdbMachine.image_url_medium }),
    author: {
      '@type': 'Person',
      name: 'Bob Matthews',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Silverball Rules',
      url: 'https://silverball.rules',
    },
    mainEntity: {
      '@type': 'Product',
      name: machineName,
      category: 'Pinball Machine',
      ...(opdbMachine?.manufacturer_name && {
        manufacturer: { '@type': 'Organization', name: opdbMachine.manufacturer_name },
      }),
      ...(opdbMachine?.manufacture_date && {
        releaseDate: opdbMachine.manufacture_date,
      }),
      ...(opdbMachine?.image_url_medium && { image: opdbMachine.image_url_medium }),
    },
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark-green)] mb-2">
              {machineName}
            </h1>
            <p className="text-gray-600">
              {opdbMachine?.manufacturer_name && `${opdbMachine.manufacturer_name} • `}
              {opdbMachine && formatYear(opdbMachine.manufacture_date)}
              {opdbMachine?.type && ` • ${opdbMachine.type}`}
            </p>
            <p className="text-gray-400 text-sm font-mono mt-1">{opendbId}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <ShareButton />
            <a
              href="#machine-info"
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Machine Info"
            >
              <Info size={20} className="text-gray-600" />
            </a>
            <Link
              href={`/print/${opendbId}`}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Print"
            >
              <Printer size={20} className="text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quickie Version */}
      {rule?.quickieVersion && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
            Quickie Version
          </h2>
          <div className="bg-[var(--light-grey)] p-4 rounded-lg">
            <p className="text-lg preserve-linebreaks capitalize-first-letter">{rule.quickieVersion}</p>
          </div>
        </section>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {rule?.goToFlipper && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-gray-500 mb-1">Go-To Flipper</h3>
            <p className="text-lg font-semibold text-[var(--dark-green)]">{rule.goToFlipper}</p>
          </div>
        )}
        {rule?.riskIndex && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Risk Index</h3>
            <p className="text-lg font-semibold text-[var(--dark-green)]">{rule.riskIndex}</p>
          </div>
        )}
        {rule?.shotsToMaster && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-gray-500 mb-1">Shots to Master</h3>
            <p className="text-lg font-semibold text-[var(--dark-green)]">{rule.shotsToMaster}</p>
          </div>
        )}
      </div>

      {/* Skill Shot */}
      {rule?.skillShot && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
            Skill Shot
          </h2>
          <p className="preserve-linebreaks">{rule.skillShot}</p>
        </section>
      )}

      {/* Style Alert */}
      {rule?.styleAlert && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--dark-orange)] mb-3">
            Style Alert
          </h2>
          <p className="preserve-linebreaks italic">{rule.styleAlert}</p>
        </section>
      )}

      {/* Full Rules */}
      {rule?.fullRules && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
            Full Rules
          </h2>
          <div className="space-y-4">
            {rule.fullRules.split('\n\n').map((paragraph, index) => (
              <p key={index} className="preserve-linebreaks capitalize-first-letter">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Playfield Risk */}
      {rule?.playfieldRisk && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
            Playfield Risk
          </h2>
          <p className="preserve-linebreaks">{rule.playfieldRisk}</p>
        </section>
      )}

      {/* External Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
          External Links
        </h2>
        <div className="flex flex-wrap gap-3">
          <ExternalLinkButton
            href={`https://pintips.net/opdb/${opendbId}`}
            label="PinTips"
          />
          <ExternalLinkButton
            href={`https://pinballvideos.com/m/?q=${opendbId}`}
            label="PinVideos"
          />
          <ExternalLinkButton
            href={`https://next.matchplay.events/pintips/${opendbId}`}
            label="Match Play"
          />
          <ExternalLinkButton
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(machineName + ' pinball')}`}
            label="YouTube"
          />
          <ExternalLinkButton
            href={`https://opdb.org/search?q=${opendbId}`}
            label="OPDB"
          />
          <ExternalLinkButton
            href={opdbMachine?.ipdb_id
              ? `https://www.ipdb.org/machine.cgi?id=${opdbMachine.ipdb_id}`
              : `https://www.ipdb.org/search.pl?name=${encodeURIComponent(machineName)}&searchtype=quick`}
            label="IPDB"
          />
          <ExternalLinkButton
            href={`https://nypinball.com/flyers/${machineName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
            label="Flyer"
          />
        </div>
      </section>

      {/* Machine Info */}
      <section id="machine-info" className="mb-8 scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--dark-green)] mb-3">
          Machine Information
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {opdbMachine?.image_url_medium && (
            <div className="p-4 bg-gray-50">
              <div className="relative w-full md:w-1/2 mx-auto aspect-[3/4]">
                <Image
                  src={opdbMachine.image_url_medium}
                  alt={`${machineName} backglass`}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </div>
          )}
          <div className="p-4">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="font-medium">{machineName}</dd>
              </div>
              {opdbMachine?.manufacturer_name && (
                <div>
                  <dt className="text-sm text-gray-500">Manufacturer</dt>
                  <dd className="font-medium">{opdbMachine.manufacturer_name}</dd>
                </div>
              )}
              {opdbMachine?.manufacture_date && (
                <div>
                  <dt className="text-sm text-gray-500">Year</dt>
                  <dd className="font-medium">{formatYear(opdbMachine.manufacture_date)}</dd>
                </div>
              )}
              {opdbMachine?.type && (
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="font-medium">{opdbMachine.type}</dd>
                </div>
              )}
              {opdbMachine?.display && (
                <div>
                  <dt className="text-sm text-gray-500">Display</dt>
                  <dd className="font-medium">{opdbMachine.display}</dd>
                </div>
              )}
              {opdbMachine?.player_count && (
                <div>
                  <dt className="text-sm text-gray-500">Players</dt>
                  <dd className="font-medium">{opdbMachine.player_count}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/list"
          className="text-[var(--dark-green)] hover:underline font-medium"
        >
          ← Back to machine list
        </Link>
      </div>
    </div>
  )
}

function ExternalLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--dark-green)] text-white rounded-lg hover:bg-[var(--dark-green)] transition-colors text-sm font-medium"
    >
      {label}
      <ExternalLink size={14} />
    </a>
  )
}
