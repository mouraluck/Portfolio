import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import avatar from '@/assets/avatar.jpg'
import { cv, profile, type CvItem } from '@/data/cv'
import { LangToggle, useLang } from '@/lib/i18n'
import { href, linkTo } from '@/lib/router'

function Entry({ item }: { item: CvItem }) {
  const heading = item.org ? `${item.title} ${item.at ?? 'at'} ${item.org}` : item.title
  return (
    <li className="grid grid-cols-[96px_1fr] gap-x-6 max-sm:grid-cols-1 max-sm:gap-y-1">
      <div className="text-sm text-[#aaa]">{item.period}</div>
      <div>
        {item.url ? (
          <a href={item.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm text-[#eaeaea]">
            <span className="underline-offset-4 group-hover:underline">{heading}</span>
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        ) : (
          <div className="text-sm text-[#eaeaea]">{heading}</div>
        )}
        {item.text && <p className="mt-2 text-sm leading-[22px] text-[#aaa]">{item.text}</p>}
        {item.tags && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Stack">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/12 px-2 py-0.5 text-xs text-[#aaa]">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function Section({ title, items, spacing = 'gap-12' }: { title?: string; items: CvItem[]; spacing?: string }) {
  return (
    <section className="mt-16 first:mt-0">
      {title && <h2 className="mb-6 text-sm font-semibold text-[#eaeaea] sm:pl-[120px]">{title}</h2>}
      <ul className={`flex flex-col ${spacing}`}>
        {items.map((item) => (
          <Entry key={`${item.period}-${item.title}`} item={item} />
        ))}
      </ul>
    </section>
  )
}

export function CvPage() {
  const { lang } = useLang()
  const t = cv[lang]
  return (
    <main className="min-h-svh bg-black text-[#eaeaea]">
      <a
        href={href('/')}
        onClick={linkTo('/')}
        aria-label={t.back}
        className="fixed top-5 left-5 z-10 text-white transition-opacity hover:opacity-60"
      >
        <ArrowLeft className="size-5" />
      </a>
      <LangToggle className="fixed top-5 right-5 z-10 text-[13px]" />

      <div className="mx-auto max-w-[520px] px-4 pt-28 pb-24">
        <header className="mb-14 grid grid-cols-[96px_1fr] items-center gap-x-6">
          <img src={avatar} alt="" width={92} height={92} className="size-[92px] rounded-full object-cover" />
          <div>
            <h1 className="text-xl font-semibold">{profile.name}</h1>
            <p className="mt-1 text-sm text-[#aaa]">{t.role}</p>
          </div>
        </header>

        <Section items={t.experience} />
        <Section title={t.educationTitle} items={t.education} spacing="gap-6" />
        <Section title={t.volunteeringTitle} items={t.volunteering} />
      </div>
    </main>
  )
}
