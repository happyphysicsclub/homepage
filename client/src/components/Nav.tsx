'use client'

import { HoverText } from './HoverText'
import { useRouter, usePathname } from 'next/navigation'

interface NavProps {
  menuOpen: boolean
  onMenuToggle: () => void
}

export function Nav({ menuOpen, onMenuToggle }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogoClick = () => {
    router.push('/')
    if (menuOpen) {
      onMenuToggle()
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-fit flex flex-row items-start justify-between pl-4 pr-4 md:pr-6 md:pl-6 py-5 md:py-6 z-50 gap-12'>
      <div
        onClick={handleLogoClick}
        className='text-3xl md:text-4xl lg:text-6xl text-black font-light leading-none animate-gravity mt-[-4px] md:mt-[-12px] active:translate-y-1 cursor-pointer transition-all'>
        <HoverText
          text={pathname === '/' ? 'happyphysicsclub is a physics-loving graphic club.' : 'happyphysicsclub'}
        />
      </div>
      <button
        onClick={onMenuToggle}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className='relative w-6 h-4 shrink-0 hover:opacity-50 transition-opacity duration-200 cursor-pointer'>
        <span
          className={`absolute left-0 w-full h-0.5 bg-black top-1/2 origin-center transition-all duration-300 ease-in-out ${
            menuOpen ? 'rotate-45' : '-translate-y-2'
          }`}
        />
        <span
          className={`absolute left-0 w-full h-0.5 bg-black top-1/2 transition-all duration-150 ease-in-out ${
            menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
          }`}
        />
        <span
          className={`absolute left-0 w-full h-0.5 bg-black top-1/2 origin-center transition-all duration-300 ease-in-out ${
            menuOpen ? '-rotate-45' : 'translate-y-2'
          }`}
        />
      </button>
    </div>
  )
}
