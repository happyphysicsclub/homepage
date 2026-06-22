'use client'

import { useState } from 'react'
import { Nav } from './Nav'
import { MenuOverlay } from './MenuOverlay'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Nav menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((v) => !v)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className='w-full min-h-dvh h-fit relative'>
        {children}
        <footer className='w-full h-12 self-end flex flex-row items-center justify-between px-4 md:px-6 py-4'>
          <span className='text-xs md:text-sm text-black'>
            © {new Date().getFullYear()} happyphysicsclub. All rights reserved.
          </span>
        </footer>
      </main>
    </>
  )
}
