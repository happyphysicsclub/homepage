'use client'

import { Typography } from '@/components/Typography'
import { Logo } from '@/components/Logo'
import { useEffect, useRef, useState } from 'react'
import type p5 from 'p5'

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8D8EA',
  '#FF9F43',
  '#5F27CD',
  '#222222',
  '#10AC84',
]

const EXCLAMATIONS = ['OH!', 'WOW!', 'YAY!', 'OOH!', 'AH!', 'HOP!']

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

function HoverText({ text }: { text: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    e.currentTarget.style.color = randomColor
  }

  return (
    <>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className='transition-colors duration-200 inline-block cursor-pointer'
          onMouseEnter={handleMouseEnter}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

export default function Page() {
  const [timer, setTimer] = useState('00:00:00')
  const containerRef = useRef<HTMLDivElement>(null)
  const p5Instance = useRef<p5 | null>(null)

  useEffect(() => {
    const currentTimer = () => {
      const date = new Date()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      setTimer(`${hours}:${minutes}:${seconds}`)
    }

    currentTimer()
    const interval = setInterval(currentTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // 동적으로 p5 import
    import('p5').then((p5Module) => {
      const P5 = p5Module.default

      const sketch = (p: p5) => {
        let balls: Ball[] = []
        let slides: Slide[] = []
        let spawnTimer = 0

        // 베지어 곡선 위의 점 계산
        const getPointOnCurve = (slide: Slide, t: number) => {
          const x =
            Math.pow(1 - t, 2) * slide.startX! + 2 * (1 - t) * t * slide.controlX! + Math.pow(t, 2) * slide.endX!
          const y =
            Math.pow(1 - t, 2) * slide.startY! + 2 * (1 - t) * t * slide.controlY! + Math.pow(t, 2) * slide.endY!
          return { x, y }
        }

        // 베지어 곡선의 탄젠트 계산
        const getTangentOnCurve = (slide: Slide, t: number) => {
          const dx = 2 * (1 - t) * (slide.controlX! - slide.startX!) + 2 * t * (slide.endX! - slide.controlX!)
          const dy = 2 * (1 - t) * (slide.controlY! - slide.startY!) + 2 * t * (slide.endY! - slide.controlY!)
          const len = Math.sqrt(dx * dx + dy * dy)
          return { x: dx / len, y: dy / len }
        }

        // 슬라이드 생성
        const createSlides = (width: number, height: number): Slide[] => {
          return [
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
        }

        // 공 생성
        const createBall = (x: number, y: number, onSlide = false): Ball => {
          return {
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
          }
        }

        // 공-공 충돌 처리
        const handleBallCollisions = (ballsArray: Ball[]) => {
          for (let i = 0; i < ballsArray.length; i++) {
            for (let j = i + 1; j < ballsArray.length; j++) {
              const ball1 = ballsArray[i]
              const ball2 = ballsArray[j]

              // 슬라이드 위에 있는 공은 충돌 처리 안 함
              if (ball1.onSlide || ball2.onSlide) continue

              const dx = ball2.x - ball1.x
              const dy = ball2.y - ball1.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              const minDistance = ball1.radius + ball2.radius

              // 충돌 감지
              if (distance < minDistance && distance > 0.1) {
                // 정규화된 방향 벡터
                const nx = dx / distance
                const ny = dy / distance

                // 겹침 거리
                const overlap = minDistance - distance

                // 겹침 방지 - 공들을 완전히 분리 (더 강하게)
                const separationX = nx * overlap * 0.2
                const separationY = ny * overlap * 0.2

                ball1.x -= separationX
                ball1.y -= separationY
                ball2.x += separationX
                ball2.y += separationY

                // 상대 속도
                const dvx = ball2.vx - ball1.vx
                const dvy = ball2.vy - ball1.vy

                // 법선 방향 상대 속도
                const dvn = dvx * nx + dvy * ny

                // 이미 멀어지고 있으면 충돌 처리 안 함
                if (dvn >= 0) continue

                // 탄성 계수
                const restitution = 0.85

                // 충격량
                const impulse = (-(1 + restitution) * dvn) / 2

                // 속도 업데이트
                ball1.vx -= impulse * nx
                ball1.vy -= impulse * ny
                ball2.vx += impulse * nx
                ball2.vy += impulse * ny

                // 충돌 효과음(감탄사)
                if (Math.abs(dvn) > 2 && Math.random() < 0.3) {
                  ball1.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                  ball1.exclamationTimer = 40
                }
              }
            }
          }
        }

        // 공 업데이트
        const updateBall = (ball: Ball, index: number, allBalls: Ball[]): Ball => {
          const gravity = 0.7
          const friction = 0.99
          const bounce = 0.9

          const curveSlide = slides.find((s) => s.type === 'curve')!
          let newBall = { ...ball }

          if (newBall.onSlide && curveSlide) {
            newBall.slideT += 0.015

            if (newBall.slideT >= 1) {
              newBall.onSlide = false
              const tangent = getTangentOnCurve(curveSlide, 0.99)
              newBall.vx = tangent.x * 9 * (Math.random() * 0.9 + 0.8)
              newBall.vy = tangent.y * 9
            } else {
              const pos = getPointOnCurve(curveSlide, newBall.slideT)
              newBall.x = pos.x
              newBall.y = pos.y + curveSlide.thickness! / 2 - newBall.radius
            }
          } else {
            newBall.vy += gravity
            newBall.vx *= friction
            newBall.vy *= friction

            newBall.x += newBall.vx
            newBall.y += newBall.vy

            // 슬라이드 시작점 체크
            if (curveSlide && !newBall.onSlide) {
              const dist = Math.sqrt(
                Math.pow(newBall.x - curveSlide.startX!, 2) + Math.pow(newBall.y - curveSlide.startY!, 2),
              )
              if (dist < 50 && newBall.slideT === 0) {
                newBall.onSlide = true
                newBall.slideT = 0
              }
            }

            // 충돌 처리
            slides.forEach((slide) => {
              if (slide.type === 'platform') {
                if (
                  newBall.x > slide.x! &&
                  newBall.x < slide.x! + slide.w! &&
                  newBall.y + newBall.radius > slide.y! &&
                  newBall.y + newBall.radius < slide.y! + 60 &&
                  newBall.vy > 0
                ) {
                  newBall.y = slide.y! - newBall.radius
                  newBall.vy = -newBall.vy * bounce * 1.2

                  if (!newBall.hasBouncedOnPlatform) {
                    newBall.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    newBall.exclamationTimer = 50
                    newBall.hasBouncedOnPlatform = true
                  }
                }
              }

              if (slide.type === 'box') {
                if (
                  newBall.x + newBall.radius > slide.x! &&
                  newBall.x - newBall.radius < slide.x! &&
                  newBall.y > slide.y!
                ) {
                  newBall.x = slide.x! - newBall.radius
                  newBall.vx = -newBall.vx * bounce
                }
                if (
                  newBall.x > slide.x! &&
                  newBall.x < slide.x! + slide.w! &&
                  newBall.y + newBall.radius > p.height - 10
                ) {
                  newBall.y = p.height - 10 - newBall.radius
                  newBall.vy = -newBall.vy * bounce * Math.random() * 0.5 + 0.5
                  if (Math.abs(newBall.vy) > 2) {
                    newBall.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    newBall.exclamationTimer = 40
                  }
                }
              }

              if (slide.type === 'wave') {
                const waveY = slide.y! + Math.sin(newBall.x * 0.02) * 15
                if (newBall.y + newBall.radius > waveY) {
                  newBall.y = waveY - newBall.radius
                  newBall.vy = -newBall.vy * bounce * 0.7
                  if (Math.abs(newBall.vy) > 3) {
                    newBall.exclamation = EXCLAMATIONS[Math.floor(Math.random() * EXCLAMATIONS.length)]
                    newBall.exclamationTimer = 40
                  }
                }
              }
            })

            // 화면 경계
            if (newBall.x - newBall.radius < 0) {
              newBall.x = newBall.radius
              newBall.vx = -newBall.vx * bounce
            }
            if (newBall.x + newBall.radius > p.width) {
              newBall.x = p.width - newBall.radius
              newBall.vx = -newBall.vx * bounce
            }
            if (newBall.y - newBall.radius < 0) {
              newBall.y = newBall.radius
              newBall.vy = -newBall.vy * bounce
            }
          }

          if (newBall.exclamationTimer > 0) {
            newBall.exclamationTimer--
          }

          return newBall
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

            if (slide.type === 'box') {
              p.noStroke()
              p.fill(slide.color)
              p.rect(slide.x!, slide.y!, slide.w!, slide.h!)
            }

            if (slide.type === 'platform') {
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
                const y = slide.y! + Math.sin(x * 0.02) * 15
                p.vertex(x, y)
              }
              p.vertex(p.width, p.height)
              p.vertex(0, p.height)
              p.endShape(p.CLOSE)
            }
          })
        }

        // 공 그리기
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

        // 공 생성 함수
        const spawnBall = () => {
          const curveSlide = slides.find((s) => s.type === 'curve')
          if (curveSlide && balls.length < 60) {
            const ball = createBall(curveSlide.startX! + (Math.random() - 0.5) * 30, curveSlide.startY! - 20, true)
            balls.push(ball)
          }
        }

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight)
          slides = createSlides(p.width, p.height)

          // 초기 공 생성
          for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnBall(), i * 200)
          }
        }

        p.draw = () => {
          p.background(252, 246, 246)

          drawSlides()

          // 공 업데이트
          balls = balls
            .map((ball, index, array) => updateBall(ball, index, array))
            .filter((ball) => ball.y <= p.height + 100)

          // 공-공 충돌 처리 (여러 번 반복하여 겹침 완전히 해소)
          for (let iteration = 0; iteration < 3; iteration++) {
            handleBallCollisions(balls)
          }

          balls.forEach((ball) => drawBall(ball))

          spawnTimer++
          if (spawnTimer > 120) {
            spawnBall()
            spawnTimer = 0
          }
        }

        p.mousePressed = () => {
          const ball = createBall(p.mouseX + (Math.random() - 0.5) * 30, p.mouseY + (Math.random() - 0.5) * 30)
          balls.push(ball)
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight)
          slides = createSlides(p.width, p.height)
        }
      }

      if (containerRef.current) {
        p5Instance.current = new P5(sketch, containerRef.current)
      }
    })

    return () => {
      p5Instance.current?.remove()
    }
  }, [])

  return (
    <>
      {/* <Typography /> */}
      <div className='z-10 p-2 md:p-2 text-3xl md:text-6xl text-black font-extralight md:font-thin absolute md:top-2 md:left-4 animate-gravity leading-tight'>
        <HoverText text='happyphysicsclub is a physics-loving graphic ' />
        <span className='line-through'>studio</span>
        <HoverText text=' club.' />
      </div>
      <div className='z-10 absolute p-2 flex gap-2 bottom-0'>
        <button
          onClick={() => window.open('https://www.instagram.com/happyphysics.club')}
          className='text-md md:text-lg w-fit h-fit px-2 border border-white rounded-full bg-white text-black hover:bg-black hover:text-white'>
          @happyphysicsclub
        </button>
      </div>
      <div className='z-10 absolute p-2 flex gap-2 right-0 bottom-0'>
        <button className='text-md md:text-lg w-fit h-fit px-2 border border-white rounded-full hover:bg-white hover:text-black animate-pulse'>
          Timezone {timer}
        </button>
      </div>
      <div ref={containerRef} className='fixed z-0 top-0 w-full h-full' style={{ cursor: 'crosshair' }} />
    </>
  )
}
