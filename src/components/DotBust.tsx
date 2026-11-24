import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * The photo, ordered-dithered into dots on a fixed screen grid, wrapped on a sculpted
 * 2.5D bust (see tools/sculpt_bust.py). Facing front it is the photo; moving the
 * pointer turns the head a short way toward a three-quarter view, and the
 * fixed light re-shades the surfaces that turn toward or away from it.
 */

export type BustMeta = { width: number; height: number; depthMax: number; pivot: [number, number, number] }

type Props = {
  src: string
  meta: BustMeta
  /** dot cell size in CSS px */
  cell?: number
  /** max head turn left/right, degrees */
  maxYaw?: number
  /** max nod up/down, degrees */
  maxPitch?: number
  className?: string
}

// key light from upper left/front, soft fill from the right
const norm = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]); return v.map((c) => c / l) }
const KEY = norm([-0.55, -0.6, 0.6])
const FILL = norm([0.8, -0.1, 0.55])
const RELIEF = 1.2
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)

// how much light the surface catches; the photo is divided by its frontal value, so only changes show
const light = (x: number, y: number, z: number) =>
  0.45 + 0.55 * Math.max(0, x * KEY[0] + y * KEY[1] + z * KEY[2]) + 0.12 * Math.max(0, x * FILL[0] + y * FILL[1] + z * FILL[2])

type Source = {
  w: number
  h: number
  depth: Float32Array
  albedo: Float32Array
  nx: Float32Array
  ny: Float32Array
  nz: Float32Array
  mask: Uint8Array
}

function decode(img: HTMLImageElement, meta: BustMeta): Source {
  const w = img.naturalWidth, h = img.naturalHeight
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0)
  const px = ctx.getImageData(0, 0, w, h).data
  const n = w * h
  const depth = new Float32Array(n), albedo = new Float32Array(n), mask = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    mask[i] = px[i * 4 + 3] > 127 ? 1 : 0
    albedo[i] = px[i * 4] / 255 // tone-mapped photo
    depth[i] = (((px[i * 4 + 1] << 8) | px[i * 4 + 2]) / 65535) * meta.depthMax
  }
  const nx = new Float32Array(n), ny = new Float32Array(n), nz = new Float32Array(n)
  const at = (x: number, y: number) => depth[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))]
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!mask[i]) continue
      // 2px central differences smooth out 16-bit steps; relief is exaggerated for lighting only
      const dx = ((at(x + 2, y) - at(x - 2, y)) / 4) * RELIEF
      const dy = ((at(x, y + 2) - at(x, y - 2)) / 4) * RELIEF
      const l = Math.hypot(dx, dy, 1)
      nx[i] = -dx / l
      ny[i] = -dy / l
      nz[i] = 1 / l
    }
  return { w, h, depth, albedo, nx, ny, nz, mask }
}

type Points = { x: Float32Array; y: Float32Array; z: Float32Array; nx: Float32Array; ny: Float32Array; nz: Float32Array; alb: Float32Array; base: Float32Array; fade: Float32Array; count: number }

function samplePoints(s: Source, meta: BustMeta, step: number): Points {
  const cap = Math.ceil(s.w / step) * Math.ceil(s.h / step)
  const p: Points = {
    x: new Float32Array(cap), y: new Float32Array(cap), z: new Float32Array(cap),
    nx: new Float32Array(cap), ny: new Float32Array(cap), nz: new Float32Array(cap),
    alb: new Float32Array(cap), base: new Float32Array(cap), fade: new Float32Array(cap), count: 0,
  }
  const [px, py, pz] = meta.pivot
  for (let y = 0; y < s.h; y += step)
    for (let x = 0; x < s.w; x += step) {
      const i = Math.floor(y) * s.w + Math.floor(x)
      if (!s.mask[i]) continue
      const k = p.count++
      p.x[k] = x - px
      p.y[k] = y - py
      p.z[k] = s.depth[i] - pz
      p.nx[k] = s.nx[i]
      p.ny[k] = s.ny[i]
      p.nz[k] = s.nz[i]
      p.alb[k] = s.albedo[i]
      p.base[k] = light(s.nx[i], s.ny[i], s.nz[i])
      // dissolve the chest into black, like the reference
      const f = Math.min(1, (s.h - y) / (s.h * 0.3))
      p.fade[k] = f * f
    }
  return p
}

export function DotBust({ src, meta, cell = 3.5, maxYaw = 14, maxPitch = 4, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let disposed = false
    let pts: Points | null = null
    let source: Source | null = null
    let raf = 0
    let w = 0, h = 0, dpr = 1, scale = 1, step = 0
    let cols = 0, rows = 0
    let zbuf = new Float32Array(0), shade = new Float32Array(0), tmp = new Float32Array(0)
    let acc = new Float32Array(0), cnt = new Uint16Array(0), proj = new Int32Array(0), pz = new Float32Array(0)
    // pose in -1..1 on each axis: where the pointer is, and what is currently drawn
    const pointer = { x: 0, y: 0 }
    const drawn = { x: 0, y: 0 }

    const render = () => {
      if (!pts) return
      const yaw = (drawn.x * maxYaw * Math.PI) / 180
      const pitch = (-drawn.y * maxPitch * Math.PI) / 180
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
      // screen position of the pivot (between the eyes), keeping the whole bust in frame
      const ox = w / 2 + (meta.pivot[0] - meta.width / 2) * scale
      const oy = h / 2 + (meta.pivot[1] - meta.height / 2) * scale
      const invCell = 1 / cell

      // two passes: find the front surface per cell, then average every point on it.
      // Averaging (instead of keeping one winner) stops cells from flipping as the head turns.
      zbuf.fill(-1e9)
      shade.fill(-1)
      acc.fill(0)
      cnt.fill(0)
      const P = pts
      for (let k = 0; k < P.count; k++) {
        const x1 = P.x[k] * cy + P.z[k] * sy
        const z1 = -P.x[k] * sy + P.z[k] * cy
        const y2 = P.y[k] * cp - z1 * sp
        const z2 = P.y[k] * sp + z1 * cp
        const gx = ((ox + x1 * scale) * invCell) | 0
        const gy = ((oy + y2 * scale) * invCell) | 0
        if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) { proj[k] = -1; continue }
        const gi = gy * cols + gx
        proj[k] = gi
        pz[k] = z2
        if (z2 > zbuf[gi]) zbuf[gi] = z2
      }
      const eps = 8 // source px: points this close behind the front belong to the same surface
      for (let k = 0; k < P.count; k++) {
        const gi = proj[k]
        if (gi < 0 || pz[k] < zbuf[gi] - eps) continue
        // rotate the normal the same way and re-light it relative to the photo's own lighting
        const n1x = P.nx[k] * cy + P.nz[k] * sy
        const n1z = -P.nx[k] * sy + P.nz[k] * cy
        const n2y = P.ny[k] * cp - n1z * sp
        const n2z = P.ny[k] * sp + n1z * cp
        const relight = Math.min(1.45, Math.max(0.55, light(n1x, n2y, n2z) / P.base[k]))
        acc[gi] += P.alb[k] * relight * P.fade[k]
        cnt[gi]++
      }
      for (let gi = 0; gi < cols * rows; gi++) if (cnt[gi]) shade[gi] = acc[gi] / cnt[gi]

      // close pinholes left where the surface stretches while turning
      tmp.set(shade)
      for (let gy = 1; gy < rows - 1; gy++)
        for (let gx = 1; gx < cols - 1; gx++) {
          const gi = gy * cols + gx
          if (tmp[gi] >= 0) continue
          let s = 0, c = 0
          if (tmp[gi - 1] >= 0) { s += tmp[gi - 1]; c++ }
          if (tmp[gi + 1] >= 0) { s += tmp[gi + 1]; c++ }
          if (tmp[gi - cols] >= 0) { s += tmp[gi - cols]; c++ }
          if (tmp[gi + cols] >= 0) { s += tmp[gi + cols]; c++ }
          if (c >= 3) shade[gi] = s / c
        }

      // ordered (Bayer) dither: each cell has a fixed threshold, so a dot only changes when its
      // own tone crosses it, never because of its neighbours
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#fff'
      const dot = cell * 0.66
      const off = (cell - dot) / 2
      for (let gy = 0; gy < rows; gy++)
        for (let gx = 0; gx < cols; gx++) {
          const v = shade[gy * cols + gx]
          if (v > BAYER4[(gy & 3) * 4 + (gx & 3)]) ctx.fillRect(gx * cell + off, gy * cell + off, dot, dot)
        }
    }

    // The head only moves while the pointer moves: one redraw per frame at most, in steps of
    // ~1.2°, with a dead zone so a pointer resting on a step boundary can't flip back and forth.
    const STEP = 1 / 40
    const frame = () => {
      raf = 0
      if (disposed) return
      const nx = Math.abs(pointer.x - drawn.x) > STEP * 0.75 ? Math.round(pointer.x / STEP) * STEP : drawn.x
      const ny = Math.abs(pointer.y - drawn.y) > STEP * 0.75 ? Math.round(pointer.y / STEP) * STEP : drawn.y
      if (nx === drawn.x && ny === drawn.y) return
      drawn.x = nx
      drawn.y = ny
      render()
    }
    const onMove = (e: PointerEvent) => {
      pointer.x = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1))
      pointer.y = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1))
      if (!raf) raf = requestAnimationFrame(frame)
    }

    // size the grid to the canvas; resizing clears a canvas, so redraw the current pose
    const layout = () => {
      if (!source) return
      const r = canvas.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      cols = Math.ceil(w / cell)
      rows = Math.ceil(h / cell)
      zbuf = new Float32Array(cols * rows)
      shade = new Float32Array(cols * rows)
      tmp = new Float32Array(cols * rows)
      acc = new Float32Array(cols * rows)
      cnt = new Uint16Array(cols * rows)
      scale = Math.min(w / meta.width, h / meta.height) * 0.96
      // ~1.7 source samples per screen cell, so turning the head leaves no holes
      const nextStep = Math.max(1, cell / (scale * 1.7))
      if (!pts || Math.abs(nextStep - step) > 0.05) {
        step = nextStep
        pts = samplePoints(source, meta, step)
        proj = new Int32Array(pts.count)
        pz = new Float32Array(pts.count)
      }
      render()
    }

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (disposed) return // an unmounted instance must never draw
      source = decode(img, meta)
      layout()
    }
    img.src = src

    const ro = new ResizeObserver(layout)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    return () => {
      disposed = true
      img.onload = null
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [src, meta, cell, maxYaw, maxPitch])

  return <canvas ref={canvasRef} role="img" aria-label="Busto de Lucas Moura em pontos" className={cn('block h-full w-full', className)} />
}
