import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Lang = 'en' | 'pt'

const STORAGE_KEY = 'lang'

// English on a first visit; afterwards, whatever the viewer picked last on this browser.
function readSaved(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'pt' ? 'pt' : 'en'
  } catch {
    return 'en'
  }
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSaved)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // private mode or blocked storage: the choice just won't survive a reload
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Small text button that offers the other language: "pt-br" while in English, "en" in Portuguese. */
export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  const next: Lang = lang === 'en' ? 'pt' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      lang={next === 'pt' ? 'pt-BR' : 'en'}
      aria-label={next === 'pt' ? 'Ver em português' : 'View in English'}
      className={cn('cursor-pointer text-white/45 transition-colors hover:text-white', className)}
    >
      {next === 'pt' ? 'pt-br' : 'en'}
    </button>
  )
}
