// TextScrambleDecoder from EasyUI (MIT, github.com/Surajmaurya1/easyui), adapted: it decodes
// the first time it scrolls into view (or on hover), and stays monochrome while decoding.
import { useCallback, useEffect, useMemo, useRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextScrambleDecoderProps extends HTMLAttributes<HTMLSpanElement> {
  text: string
  characters?: string
  /** ms for the whole string to resolve */
  duration?: number
  trigger?: 'inView' | 'hover'
}

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%&'

/** Text that resolves from random glyphs into the real copy, left to right. */
export function TextScrambleDecoder({
  text,
  characters = DEFAULT_CHARACTERS,
  duration = 800,
  trigger = 'inView',
  className,
  onMouseEnter,
  ...props
}: TextScrambleDecoderProps) {
  const [display, setDisplay] = useState(text)
  const [decoding, setDecoding] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const frame = useRef<number | null>(null)
  const glyphs = useMemo(() => characters.split(''), [characters])

  const stop = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = null
  }, [])

  const decode = useCallback(() => {
    stop()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text)
      return
    }
    const start = performance.now()
    const resolveAt = text.split('').map((c, i) => (c.trim() === '' ? 0 : 0.15 + (i / Math.max(text.length - 1, 1)) * 0.7 + Math.random() * 0.08))
    setDecoding(true)
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(
        text
          .split('')
          .map((c, i) => {
            if (c.trim() === '' || progress >= resolveAt[i]) return c
            const cadence = Math.floor((now + i * 19) / 36)
            return glyphs[(cadence + i * 7) % glyphs.length] || c
          })
          .join(''),
      )
      if (progress < 1) frame.current = requestAnimationFrame(tick)
      else {
        setDisplay(text)
        setDecoding(false)
        frame.current = null
      }
    }
    frame.current = requestAnimationFrame(tick)
  }, [duration, glyphs, stop, text])

  useEffect(() => {
    setDisplay(text)
    if (trigger !== 'inView' || !ref.current) return stop
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        decode()
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => {
      io.disconnect()
      stop()
    }
  }, [decode, stop, text, trigger])

  return (
    <span
      ref={ref}
      aria-label={text}
      className={cn('inline-block font-mono tabular-nums transition-colors duration-150', decoding ? 'text-white/45' : 'text-inherit', className)}
      onMouseEnter={(e) => {
        if (trigger === 'hover') decode()
        onMouseEnter?.(e)
      }}
      {...props}
    >
      <span aria-hidden>{display}</span>
    </span>
  )
}
