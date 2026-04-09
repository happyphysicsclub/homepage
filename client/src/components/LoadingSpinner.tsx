// components/LoadingSpinner.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { COLORS } from '@/constants'

interface Props {
  size?: number
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 300, className, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (!label) return
    const id = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'))
    }, 400)
    return () => clearInterval(id)
  }, [label])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = size,
      H = size
    const PAD = 40 * (size / 500)
    const BALL_D = 100 * (size / 500)
    const SW = 10 * (size / 500)
    const SPEED = 2
    const LINE_GAP = 65 * (size / 500)
    const ARC_H = 80 * (size / 500)
    const LAST_ARC_END = 0.75

    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function dist(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    }

    function buildPath() {
      const rx = W - 2 * PAD,
        ry = H - 2 * PAD
      const bpts = [
        { x: PAD, y: H - PAD },
        { x: PAD + rx / 3, y: H - PAD - ry / 3 + BALL_D / 4 },
        { x: PAD + (rx * 2) / 3, y: H - PAD - (ry * 2) / 3 + BALL_D / 4 },
        { x: W - PAD, y: PAD + BALL_D },
      ]
      const STEPS = 60
      const pts: { x: number; y: number }[] = []

      for (let seg = 0; seg < bpts.length - 1; seg++) {
        const p1 = bpts[seg],
          p2 = bpts[seg + 1]
        const isLast = seg === bpts.length - 2
        const maxStep = isLast ? Math.floor(STEPS * LAST_ARC_END) : STEPS

        for (let i = seg === 0 ? 0 : 1; i <= maxStep; i++) {
          const s = i / STEPS
          pts.push({
            x: lerp(p1.x, p2.x, s),
            y: lerp(p1.y, p2.y, s) - Math.sin(s * Math.PI) * ARC_H,
          })
        }
      }
      return pts
    }

    const path = buildPath()
    const shuffle = [...COLORS].sort(() => Math.random() - 0.5)
    const [trailColor, ballStroke] = shuffle
    let t = 0
    let animId: number
    let lastTime = 0

    function draw(now: number) {
      if (now - lastTime < 1000 / 60) {
        animId = requestAnimationFrame(draw)
        return
      }
      lastTime = now
      ctx.clearRect(0, 0, W, H)

      t += SPEED
      if (t >= path.length - 1) t = 0

      const idx = Math.min(Math.floor(t), path.length - 1)
      const pos = path[idx]

      // trail
      let trailEndIdx = 0
      for (let i = idx; i >= 0; i--) {
        if (dist(path[i].x, path[i].y, pos.x, pos.y) > LINE_GAP) {
          trailEndIdx = i
          break
        }
      }

      ctx.strokeStyle = trailColor
      ctx.lineWidth = SW
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      for (let i = 0; i <= trailEndIdx; i++) {
        if (i === 0) ctx.moveTo(path[i].x, path[i].y)
        else ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()

      // ball
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, BALL_D / 2, 0, Math.PI * 2)
      ctx.lineWidth = SW
      ctx.strokeStyle = ballStroke
      ctx.stroke()

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <div className='flex flex-col items-center gap-4'>
      <canvas ref={canvasRef} className={className} />
      {label && (
        <p className='text-sm tracking-widest'>
          {label}<span>{dots}</span>
        </p>
      )}
    </div>
  )
}
