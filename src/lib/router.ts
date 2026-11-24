import { useSyncExternalStore, type MouseEvent } from 'react'

// A two-page site doesn't need a router library: the History API and one hook are enough.

const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify)
  return () => window.removeEventListener('popstate', notify)
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Current path without the deploy base, e.g. "/" or "/cv". */
export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname.slice(base.length) || '/')
}

export function navigate(to: string) {
  window.history.pushState(null, '', base + to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** onClick for internal <a> links: keeps cmd/ctrl-click opening a new tab. */
export function linkTo(to: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }
}

export const href = (to: string) => base + to
