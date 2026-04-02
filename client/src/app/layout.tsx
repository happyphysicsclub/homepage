import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'happyphysicsclub',
  description: 'Hello, We are happyphysicsclub!',
  keywords: 'happyphysicsclub',
  authors: [{ name: 'happyphysicsclub' }],
  openGraph: {
    title: 'happyphysicsclub',
    type: 'website',
    url: 'https://happyphysics.club',
    images: [{ url: '/icon/share/logo.png' }],
    siteName: 'happyphysicsclub',
    description: 'Hello, We are happyphysicsclub!',
  },
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/icons/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <div className='flex flex-col w-screen h-full'>
          {children}
        </div>
      </body>
    </html>
  )
}
