'use client'

import { useRef, useEffect, useState } from 'react'

export interface Member {
  name: string
  role: string
  email: string
  website: string
  websiteShort: string
}

const RENDER_W = 1280
const RENDER_H = 800

function SitePreview({ url, name }: { url: string; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setScale(el.offsetWidth / RENDER_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className='w-full overflow-hidden bg-stone-100'
      style={{ height: `${RENDER_H * scale}px` }}
    >
      <iframe
        src={url}
        title={name}
        style={{
          width: `${RENDER_W}px`,
          height: `${RENDER_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          border: 'none',
        }}
      />
    </div>
  )
}

export function MemberCard({ member }: { member: Member }) {
  const { name, role, email, website, websiteShort } = member

  return (
    <div className='flex flex-col gap-3'>
      <a href={website} target='_blank' rel='noopener noreferrer' className='group block overflow-hidden'>
        <div className='transition-opacity duration-200 group-hover:opacity-80'>
          <SitePreview url={website} name={name} />
        </div>
      </a>

      <div>
        <p className='text-sm font-medium leading-snug'>{name}</p>
        <p className='text-xs text-gray mb-2'>{role}</p>
        <div className='flex flex-col gap-0.5 text-xs'>
          <a
            href={`mailto:${email}`}
            className='text-black/60 hover:text-black transition-colors duration-150'
          >
            {email}
          </a>
          <a
            href={website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-black/60 hover:text-black transition-colors duration-150'
          >
            {websiteShort}
          </a>
        </div>
      </div>
    </div>
  )
}
