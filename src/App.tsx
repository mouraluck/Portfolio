import { useEffect } from 'react'
import { usePath } from '@/lib/router'
import { CvPage } from '@/pages/Cv'
import { HomePage } from '@/pages/Home'

export default function App() {
  const path = usePath()
  const isCv = path.replace(/\/$/, '') === '/cv'

  useEffect(() => {
    document.title = isCv ? 'Lucas Moura — CV' : 'Lucas Moura'
    // a new page starts at the top; 'instant' so the page's smooth scrolling doesn't animate it
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [isCv])

  return isCv ? <CvPage /> : <HomePage />
}
