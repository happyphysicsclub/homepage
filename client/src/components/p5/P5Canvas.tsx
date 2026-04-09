'use client'

import { useEffect, useRef } from 'react'
import type p5 from 'p5'
import { COLORS } from '@/constants'

export const EXCLAMATIONS = ['OH!', 'WOW!', 'YAY!', 'OOH!', 'AH!', 'HOP!']

interface Slide {
  type: 'curve' | 'box' | 'platform' | 'wave'
  color: string
  startX?: number
  startY?: number
  controlX?: number
  controlY?: number
  endX?: number
  endY?: number
  thickness?: number
  x?: number
  y?: number
  w?: number
  h?: number
}

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  onSlide: boolean
  slideT: number
  exclamation: string | null
  exclamationTimer: number
  hasBouncedOnPlatform: boolean
}

const createSlides = (width: number, height: number): Slide[] => [
  {
    type: 'curve',
    color: '#FFE66D',
    startX: width * 0.05,
    startY: height * 0.05,
    controlX: width * 0.15,
    controlY: height * 0.65,
    endX: width * 0.35,
    endY: height * 0.7,
    thickness: 120,
  },
  {
    type: 'box',
    color: '#FCBAD3',
    x: width * 0.55,
    y: height * 0.55,
    w: width * 0.25,
    h: height * 0.45,
  },
  {
    type: 'platform',
    color: '#FF9F43',
    x: width * 0.37,
    y: height * 0.89,
    w: width * 0.18,
    h: 12,
  },
  {
    type: 'wave',
    color: '#2D5BA8',
    y: height * 0.92,
  },
]

const createBall = (x: number, y: number, onSlide = false): Ball => ({
  x,
  y,
  vx: (Math.random() - 0.5) * 2,
  vy: 0,
  radius: 6 + Math.random() * 10,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  onSlide,
  slideT: 0,
  exclamation: null,
  exclamationTimer: 0,
  hasBouncedOnPlatform: false,
})

const getPointOnCurve = (slide: Slide, t: number) => ({
  x: Math.pow(1 - t, 2) * slide.startX! + 2 * (1 - t) * t * slide.controlX! + Math.pow(t, 2) * slide.endX!,
  y: Math.pow(1 - t, 2) * slide.startY! + 2 * (1 - t) * t * slide.controlY! + Math.pow(t, 2) * slide.endY!,
})

const getTangentOnCurve = (slide: Slide, t: number) => {
  const dx = 2 * (1 - t) * (slide.controlX! - slide.startX!) + 2 * t * (slide.endX! - slide.controlX!)
  const dy = 2 * (1 - t) * (slide.controlY! - slide.startY!) + 2 * t * (slide.endY! - slide.controlY!)
  const len = Math.sqrt(dx * dx + dy * dy)
  return { x: dx / len, y: dy / len }
}

export function P5Canvas({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5Instance = useRef<p5 | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    import('p5').then((p5Module) => {
      const P5 = p5Module.default

      if (!containerRef.current) return

      const sketch = (p: p5) => {
        let balls: Ball[] = []
        let slides: Slide[] = []
        let spawnTimer = 0

        const spawnBall = () => {
          const curveSlide = slides.find((s) => s.type === 'curve')
          if (curveSlide && balls.length < 60) {
            balls.push(createBall(curveSlide.startX! + (Math.random() - 0.5) * 30, curveSlide.startY! - 20, true))
          }
        }

        const handleBallCollisions = (ballsArray: Ball[]) => {
          for (let i = 0; i < ballsArray.length; i++) {
            for (let j = i + 1; j < ballsArray.length; j++) {
              const b1 = ballsArray[i]
              const b2 = ballsArray[j]
              if (b1.onSlide || b2.onSlide) continue

              const dx = b2.x - b1.x
              const dy = b2.y - b1.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              const minDist = b1.radius + b2.radius

              if (dist >= minDist || dist <= 0.1) continue

              const nx = dx / dist
              const ny = dy / dist
              const overlap = minDist - dist
              const sep = overlap * 0.2

              b1.x -= nx * sep
              b1.y -= ny * sep
              b2.x += nx * sep
              b2.y += ny * sep

              const dvn = (b2.vx - b1.vx) * nx + (b2.vy - b1.vy) * ny
              if (dvn >= 0) continue

              const impulse = (-(1 + 0.85) * dvn) / 2
              b1.vx -= impulse * nx
              b1.vy -= impulse * ny
              b2.vx += impulse * nx
              b2.vy += impulse * ny

              if (Math.abs(dvn) > 2 && Math.random() < 0.3) {
                b1.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                b1.exclamationTimer = 40
              }
            }
          }
        }

        const updateBall = (ball: Ball): Ball => {
          const gravity = 0.7
          const friction = 0.99
          const bounce = 0.9
          const curveSlide = slides.find((s) => s.type === 'curve')!
          const b = { ...ball }

          if (b.onSlide && curveSlide) {
            b.slideT += 0.015
            if (b.slideT >= 1) {
              b.onSlide = false
              const tangent = getTangentOnCurve(curveSlide, 0.99)
              b.vx = tangent.x * 9 * (Math.random() * 0.9 + 0.8)
              b.vy = tangent.y * 9
            } else {
              const pos = getPointOnCurve(curveSlide, b.slideT)
              b.x = pos.x
              b.y = pos.y + curveSlide.thickness! / 2 - b.radius
            }
          } else {
            b.vy += gravity
            b.vx *= friction
            b.vy *= friction
            b.x += b.vx
            b.y += b.vy

            if (curveSlide && !b.onSlide) {
              const dist = Math.sqrt(Math.pow(b.x - curveSlide.startX!, 2) + Math.pow(b.y - curveSlide.startY!, 2))
              if (dist < 50 && b.slideT === 0) {
                b.onSlide = true
                b.slideT = 0
              }
            }

            slides.forEach((slide) => {
              if (slide.type === 'platform') {
                if (
                  b.x > slide.x! &&
                  b.x < slide.x! + slide.w! &&
                  b.y + b.radius > slide.y! &&
                  b.y + b.radius < slide.y! + 60 &&
                  b.vy > 0
                ) {
                  b.y = slide.y! - b.radius
                  b.vy = -b.vy * bounce * 1.2
                  if (!b.hasBouncedOnPlatform) {
                    b.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    b.exclamationTimer = 50
                    b.hasBouncedOnPlatform = true
                  }
                }
              }

              if (slide.type === 'box') {
                if (b.x + b.radius > slide.x! && b.x - b.radius < slide.x! && b.y > slide.y!) {
                  b.x = slide.x! - b.radius
                  b.vx = -b.vx * bounce
                }
                if (b.x > slide.x! && b.x < slide.x! + slide.w! && b.y + b.radius > p.height - 10) {
                  b.y = p.height - 10 - b.radius
                  b.vy = -b.vy * bounce * Math.random() * 0.5 + 0.5
                  if (Math.abs(b.vy) > 2) {
                    b.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    b.exclamationTimer = 40
                  }
                }
              }

              if (slide.type === 'wave') {
                const waveY = slide.y! + Math.sin(b.x * 0.02) * 15
                if (b.y + b.radius > waveY) {
                  b.y = waveY - b.radius
                  b.vy = -b.vy * bounce * 0.7
                  if (Math.abs(b.vy) > 3) {
                    b.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    b.exclamationTimer = 40
                  }
                }
              }
            })

            if (b.x - b.radius < 0) {
              b.x = b.radius
              b.vx = -b.vx * bounce
            }
            if (b.x + b.radius > p.width) {
              b.x = p.width - b.radius
              b.vx = -b.vx * bounce
            }
            if (b.y - b.radius < 0) {
              b.y = b.radius
              b.vy = -b.vy * bounce
            }
          }

          if (b.exclamationTimer > 0) b.exclamationTimer--
          return b
        }

        const drawSlides = () => {
          slides.forEach((slide) => {
            if (slide.type === 'curve') {
              p.noFill()
              p.stroke(slide.color)
              p.strokeWeight(slide.thickness!)
              p.strokeCap(p.ROUND)
              const cx1 = slide.startX! + (2 / 3) * (slide.controlX! - slide.startX!)
              const cy1 = slide.startY! + (2 / 3) * (slide.controlY! - slide.startY!)
              const cx2 = slide.endX! + (2 / 3) * (slide.controlX! - slide.endX!)
              const cy2 = slide.endY! + (2 / 3) * (slide.controlY! - slide.endY!)
              p.bezier(slide.startX!, slide.startY!, cx1, cy1, cx2, cy2, slide.endX!, slide.endY!)
            }

            if (slide.type === 'box' || slide.type === 'platform') {
              p.noStroke()
              p.fill(slide.color)
              p.rect(slide.x!, slide.y!, slide.w!, slide.h!)
            }

            if (slide.type === 'wave') {
              p.noStroke()
              p.fill(slide.color)
              p.beginShape()
              p.vertex(0, slide.y!)
              for (let x = 0; x <= p.width; x += 10) {
                p.vertex(x, slide.y! + Math.sin(x * 0.02) * 15)
              }
              p.vertex(p.width, p.height)
              p.vertex(0, p.height)
              p.endShape(p.CLOSE)
            }
          })
        }

        const drawBall = (ball: Ball) => {
          p.noStroke()
          p.fill(ball.color)
          p.circle(ball.x, ball.y, ball.radius * 2)

          if (ball.exclamationTimer > 0 && ball.exclamation) {
            p.textFont('monospace')
            p.textStyle(p.BOLD)
            p.textSize(14)
            p.textAlign(p.CENTER, p.CENTER)
            const offsetY = (40 - ball.exclamationTimer) * 0.5
            const alpha = (ball.exclamationTimer / 40) * 255
            p.fill(34, 34, 34, alpha)
            p.text(ball.exclamation, ball.x, ball.y - ball.radius - 10 - offsetY)
          }
        }

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight)
          slides = createSlides(p.width, p.height)
          for (let i = 0; i < 5; i++) setTimeout(() => spawnBall(), i * 200)
        }

        p.draw = () => {
          p.background(252, 246, 246)
          drawSlides()

          balls = balls.map((ball) => updateBall(ball)).filter((ball) => ball.y <= p.height + 100)
          for (let i = 0; i < 3; i++) handleBallCollisions(balls)
          balls.forEach(drawBall)

          if (++spawnTimer > 120) {
            spawnBall()
            spawnTimer = 0
          }
        }

        p.mousePressed = () => {
          balls.push(createBall(p.mouseX + (Math.random() - 0.5) * 30, p.mouseY + (Math.random() - 0.5) * 30))
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight)
          slides = createSlides(p.width, p.height)
        }
      }

      p5Instance.current = new P5(sketch, containerRef.current)
    }).catch((err) => {
      console.error('[P5Canvas] p5 load failed:', err)
    })

    return () => {
      p5Instance.current?.remove()
    }
  }, [])

  return <div ref={containerRef} className={className} style={{ cursor: 'crosshair' }} />
}
