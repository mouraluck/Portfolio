import '@fontsource-variable/inter-tight'
import { useId, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Heavy lowercase grotesk, two lines set almost touching, sharp in the middle and out of
 * focus toward the edges (a blur vignette), with film grain — the "portf / olio" poster
 * look, in white on black.
 *
 * Two copies of the text are stacked: a blurred one underneath and a sharp one on top
 * whose opacity fades out from the centre with a radial mask.
 */

const type: CSSProperties = {
  fontSize: 'clamp(4.5rem, 13vw, 13rem)',
  lineHeight: 0.74,
  letterSpacing: '-0.075em',
  // room around the letters so the blur isn't clipped by the mask's box; the negative
  // margin keeps the layout where it was
  padding: '0.25em',
  margin: '-0.25em',
}

// sharp in an ellipse around the centre, fully soft by the edges; the blurred copy gets the
// inverse mask so its halo never shows over the sharp middle
const vignette = 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 45%, transparent 85%)'
const inverse = 'radial-gradient(ellipse 50% 50% at 50% 50%, transparent 40%, #000 80%)'

function Lines({ lines }: { lines: string[] }) {
  return lines.map((l) => (
    <span key={l} className="block">
      {l}
    </span>
  ))
}

type Props = {
  lines?: string[]
  /** heading level; the hero uses h1, other sections h2 */
  as?: 'h1' | 'h2'
  /** font-size, defaults to the hero size */
  size?: string
  className?: string
}

export function BlurName({ lines = ['lucas', 'moura'], as: Tag = 'h1', size, className }: Props) {
  const grainId = `blurname-grain-${useId().replace(/:/g, '')}`
  const sized = size ? { ...type, fontSize: size } : type
  const text = 'block font-[Inter_Tight_Variable] font-[850] lowercase text-white'
  return (
    <Tag className={cn('relative flow-root w-fit select-none', className)} aria-label={lines.join(' ')}>
      <span aria-hidden className={text} style={{ ...sized, filter: 'blur(0.045em) contrast(1.1)', maskImage: inverse, WebkitMaskImage: inverse }}>
        <Lines lines={lines} />
      </span>
      <span
        aria-hidden
        className={cn(text, 'absolute')}
        style={{ ...sized, inset: '-0.25em', margin: 0, maskImage: vignette, WebkitMaskImage: vignette }}
      >
        <Lines lines={lines} />
      </span>
      {/* film grain over the letters only */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16] mix-blend-multiply">
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.1" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </Tag>
  )
}
