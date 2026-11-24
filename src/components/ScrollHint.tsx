import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Bottom-of-screen cue that there is more below: a thin line with a light running down it.
 * Fades out as soon as the page is scrolled.
 */
export function ScrollHint({ label, className }: { label: string; className?: string }) {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y < 40))

  return (
    <motion.a
      href="#about"
      aria-label={label}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: visible ? 0.6 : 0 }}
      className={cn('flex flex-col items-center gap-3 text-[11px] tracking-[0.2em] text-white/45 uppercase', !visible && 'pointer-events-none', className)}
    >
      <span>{label}</span>
      <span className="relative h-12 w-px overflow-hidden bg-white/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.3 }}
        />
      </span>
    </motion.a>
  )
}
