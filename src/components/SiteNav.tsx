import { profile } from '@/data/cv'
import { home } from '@/data/home'
import { LangToggle, useLang } from '@/lib/i18n'
import { href, linkTo } from '@/lib/router'

const item = 'text-white/90 transition-colors hover:text-white/50'

/** Top bar of the home page: small label/value columns, like a colophon. */
export function SiteNav() {
  const { lang } = useLang()
  const t = home[lang].nav
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap justify-between gap-x-10 gap-y-4 px-4 py-4 text-[13px] leading-[1.45] md:px-6">
      <div className="pointer-events-auto flex gap-4">
        <span className="text-white/45">{t.label}</span>
        <span className="flex flex-col">
          <span className="text-white/90">{profile.name}</span>
          <span className="text-white/90">{t.location}</span>
        </span>
      </div>
      <div className="pointer-events-auto flex gap-8">
        <nav aria-label={t.links} className="flex gap-4">
          <span className="text-white/45">{t.links}</span>
          <span className="flex flex-col">
            <a href={href('/cv')} onClick={linkTo('/cv')} className={item}>
              {t.readCv}
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={item}>
              linkedin
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className={item}>
              github
            </a>
          </span>
        </nav>
        <LangToggle className="self-start" />
      </div>
    </header>
  )
}
