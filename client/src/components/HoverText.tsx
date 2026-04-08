'use client'

import { COLORS } from '@/constants'

export function HoverText({ text }: { text: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
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
