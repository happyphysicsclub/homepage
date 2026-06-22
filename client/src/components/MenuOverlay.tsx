'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '/contact' },
]

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-40 bg-white flex flex-col justify-center px-6 md:px-12 transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
      <nav className='flex flex-col gap-3 md:gap-4'>
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`group flex items-baseline gap-4 transition-all duration-200 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}>
            <span
              className={`text-2xl md:text-4xl lg:text-6xl underline-offset-8 decoration-2 md:decoration-4 font-light tracking-tight leading-none transition-colors duration-200 ${
                pathname === item.href ? 'underline' : ' group-hover:text-gray'
              }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className='absolute bottom-0 left-0 right-0 pl-4 md:pl-8 pr-4 md:pr-6  py-5 md:py-6 flex items-end justify-between'>
        <a
          href='https://www.instagram.com/happyphysics.club'
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs tracking-widest uppercase text-black hover:text-black transition-colors duration-200'>
          Instagram
        </a>
        <span className='text-xs md:text-sm text-black'>© {new Date().getFullYear()} happyphysicsclub</span>
      </div>
    </div>
  )
}
