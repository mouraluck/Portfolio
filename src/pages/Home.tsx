import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import bust from '@/assets/bust.png'
import bustMeta from '@/assets/bust.json'
import { BlurName } from '@/components/BlurName'
import { DotBust, type BustMeta } from '@/components/DotBust'
import { HomeSections } from '@/components/HomeSections'
import { ScrollHint } from '@/components/ScrollHint'
import { SiteNav } from '@/components/SiteNav'
import { home } from '@/data/home'
import { useLang } from '@/lib/i18n'

export function HomePage() {
  const { lang } = useLang()
  // the page renders after load, so the browser can't jump to /#section on its own
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="relative min-h-svh overflow-x-clip bg-black text-white">
        <SiteNav />
        {/* first screen: exactly one viewport tall on desktop */}
        <section className="relative grid min-h-svh grid-cols-1 md:h-svh md:grid-cols-2">
          <div className="flex items-center justify-center px-4 py-10 md:px-10">
            <div
              className="h-[min(calc(100svh-6rem),calc((50vw-5rem)/var(--ar)))] max-md:h-auto max-md:w-full max-md:max-w-md"
              style={{ aspectRatio: `${bustMeta.width} / ${bustMeta.height}`, ['--ar' as string]: bustMeta.width / bustMeta.height }}
            >
              <DotBust src={bust} meta={bustMeta as unknown as BustMeta} />
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 pb-16 md:px-10 md:pb-0">
            <BlurName />
            <p className="mt-[clamp(1rem,2.2vw,2rem)] font-[Inter_Tight_Variable] text-[clamp(1.05rem,1.7vw,1.6rem)] font-medium tracking-[-0.02em] text-white/70">
              {home[lang].hero.subtitle}
            </p>
          </div>
          <ScrollHint label={home[lang].hero.scroll} className="absolute bottom-6 left-1/2 -translate-x-1/2" />
        </section>
        <HomeSections />
      </main>
    </MotionConfig>
  )
}
