// SpotlightCard from EasyUI (MIT, github.com/Surajmaurya1/easyui), restyled monochrome.
import { useRef, type HTMLAttributes, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  spotlightColor?: string
  spotlightSize?: number
}

/** A dark surface whose border and inside light up under the pointer. */
export function SpotlightCard({
  children,
  spotlightColor = 'rgba(255, 255, 255, 0.06)',
  spotlightSize = 350,
  className,
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const cardRef = useRef<HTMLDivElement>(null)

  const backgroundGradient = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`
  const borderGradient = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.18), transparent 80%)`

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const { left, top } = cardRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - left)
        mouseY.set(e.clientY - top)
      }}
      onMouseLeave={() => {
        mouseX.set(-1000)
        mouseY.set(-1000)
      }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] p-6 transition-colors duration-300 hover:border-white/25',
        className,
      )}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: borderGradient }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: backgroundGradient }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
