import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BlurName } from '@/components/BlurName'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TextScrambleDecoder } from '@/components/ui/TextScrambleDecoder'
import { profile } from '@/data/cv'
import { contact, home } from '@/data/home'
import { useLang } from '@/lib/i18n'
import { motionTransitions } from '@/lib/motion-tokens'
import { href, linkTo } from '@/lib/router'

const display = 'font-[Inter_Tight_Variable]'
const YEAR = new Date().getFullYear()

/** A numbered section: label column on the left, content on the right; fades up on entry. */
function Section({ index, label, id, children }: { index: string; label: string; id: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={motionTransitions.springGentle}
      className="grid gap-x-10 gap-y-8 border-t border-white/10 py-20 md:grid-cols-[200px_1fr] md:py-28"
    >
      <h2 id={`${id}-title`} className="flex gap-3 text-[13px] leading-none text-white/45">
        <span>{index}</span>
        <TextScrambleDecoder text={label} className="text-[13px] text-white/90 uppercase tracking-[0.08em]" />
      </h2>
      <div className="min-w-0">{children}</div>
    </motion.section>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {items.map((t) => (
        <li key={t} className="rounded-full border border-white/12 px-2 py-0.5 text-xs text-white/60">
          {t}
        </li>
      ))}
    </ul>
  )
}

function About() {
  const { lang } = useLang()
  const about = home[lang].about
  return (
    <Section index="01" label={home[lang].sections.about} id="about">
      <p className={`${display} max-w-[22ch] text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-white`}>{about.lead}</p>
      <p className="mt-8 max-w-[62ch] text-[15px] leading-[1.7] text-white/60">{about.body}</p>
      <dl className="mt-12 grid gap-6 sm:grid-cols-3">
        {about.facts.map((f) => (
          <div key={f.label} className="border-t border-white/10 pt-4">
            <dt className="text-[13px] text-white/45">{f.label}</dt>
            <dd className="mt-1 text-[15px] text-white/90">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function SelectedWork() {
  const { lang } = useLang()
  return (
    <Section index="02" label={home[lang].sections.work} id="work">
      <ul className="grid gap-4 lg:grid-cols-3">
        {home[lang].work.map((w) => (
          <li key={w.title}>
            <SpotlightCard className="flex h-full min-h-[320px] flex-col">
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[13px] text-white/45">{w.meta}</p>
                  {w.url && <ArrowUpRight aria-hidden className="size-4 text-white/45 transition-colors group-hover:text-white" />}
                </div>
                <h3 className={`${display} mt-6 text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-white`}>
                  {w.url ? (
                    // the link covers the whole card
                    <a href={w.url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 after:content-['']">
                      {w.title}
                    </a>
                  ) : (
                    w.title
                  )}
                </h3>
                {w.result && (
                  <p className={`${display} mt-5 text-[2.6rem] leading-none font-[800] tracking-[-0.05em] text-white`}>{w.result}</p>
                )}
                <p className="mt-5 text-sm leading-[1.65] text-white/60">{w.text}</p>
                <div className="mt-auto pt-8">
                  <Tags items={w.tags} />
                </div>
              </div>
            </SpotlightCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function SideProjects() {
  const { lang } = useLang()
  return (
    <Section index="03" label={home[lang].sections.side} id="side-projects">
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {home[lang].sideProjects.map((p) => (
          <li key={p.title}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[56px_1fr_auto] items-baseline gap-x-6 py-5 transition-colors hover:bg-white/[0.02] max-sm:grid-cols-[44px_1fr_auto] max-sm:gap-x-4"
            >
              <span className="text-[13px] text-white/45 tabular-nums">{p.year}</span>
              <span className="min-w-0">
                <span className={`${display} block text-xl font-semibold tracking-[-0.02em] text-white`}>{p.title}</span>
                <span className="mt-1 block text-sm text-white/55">{p.text}</span>
              </span>
              <ArrowUpRight aria-hidden className="size-4 self-center text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Stack() {
  const { lang } = useLang()
  return (
    <Section index="04" label={home[lang].sections.stack} id="stack">
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {home[lang].stack.map((g) => (
          <div key={g.group}>
            <h3 className="text-[13px] text-white/45">{g.group}</h3>
            <ul className={`${display} mt-4 space-y-1.5 text-[1.35rem] font-medium tracking-[-0.02em] text-white`}>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Contact() {
  const { lang } = useLang()
  const t = home[lang].contact
  return (
    <section id="contact" aria-label="Contact" className="border-t border-white/10 pt-24 pb-12 md:pt-32">
      <p className="text-[13px] text-white/45">05 — {home[lang].sections.contact}</p>
      <BlurName as="h2" lines={t.lines} size="clamp(4rem, 12vw, 12rem)" className="mt-10" />
      <p className="mt-10 max-w-[48ch] text-[15px] leading-[1.7] text-white/60">
        {t.text}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton href={`mailto:${contact.email}`} size="lg">
          {t.email} <ArrowUpRight aria-hidden className="size-4" />
        </MagneticButton>
        <MagneticButton href={profile.links.linkedin} external variant="outline" size="lg">
          LinkedIn
        </MagneticButton>
        <MagneticButton href={profile.links.github} external variant="outline" size="lg">
          GitHub
        </MagneticButton>
        <MagneticButton href={href('/cv')} onClick={linkTo('/cv')} variant="outline" size="lg">
          {t.cv}
        </MagneticButton>
      </div>
      <footer className="mt-28 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/45">
        <span>
          © {YEAR} {profile.name} · {home[lang].nav.location}
        </span>
        <a href="#top" className="transition-colors hover:text-white">
          {t.backToTop} ↑
        </a>
      </footer>
    </section>
  )
}

export function HomeSections() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 md:px-10">
      <About />
      <SelectedWork />
      <SideProjects />
      <Stack />
      <Contact />
    </div>
  )
}
