// MagneticButton from EasyUI (MIT, github.com/Surajmaurya1/easyui), adapted to render a link
// when given an href, since every action on this site goes somewhere.
import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, useSpring } from 'framer-motion'
import { motionTransitions } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

export interface MagneticButtonProps {
  children: ReactNode
  href: string
  /** how strongly the button follows the pointer */
  strength?: number
  variant?: 'primary' | 'outline'
  size?: 'md' | 'lg'
  external?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  className?: string
}

const variants = {
  primary: 'bg-[#FAFAFA] text-[#050505] hover:bg-white font-medium',
  outline: 'bg-transparent text-[#FAFAFA] border border-white/15 hover:border-white/40 hover:bg-white/[0.04]',
}

const sizes = {
  md: 'px-5 py-2.5 text-sm rounded-full gap-2',
  lg: 'px-7 py-3.5 text-base rounded-full gap-2.5',
}

/** A link styled as a pill that is pulled toward the cursor while hovered. */
export function MagneticButton({
  children,
  href,
  strength = 0.35,
  variant = 'primary',
  size = 'md',
  external,
  onClick,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)
  const x = useSpring(0, { stiffness: 280, damping: 20 })
  const y = useSpring(0, { stiffness: 280, damping: 20 })

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      style={{ x, y }}
      onMouseMove={(e) => {
        if (!ref.current) return
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        x.set((e.clientX - (left + width / 2)) * strength)
        y.set((e.clientY - (top + height / 2)) * strength)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        x.set(0)
        y.set(0)
      }}
      whileTap={{ scale: 0.96 }}
      transition={motionTransitions.springSnappy}
      className={cn(
        'relative inline-flex items-center justify-center transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {hovered && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 blur-sm" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  )
}
