import { HoverText } from '@/components'
import { P5Canvas } from '@/components/p5'

export default function Page() {
  return (
    <>
      <main>
        <h1 className='z-10 p-2 md:p-2 text-3xl md:text-6xl text-black font-sans md:font-thin absolute md:top-2 md:left-4 animate-gravity'>
          <HoverText text='happyphysicsclub is a physics-loving graphic club.' />
        </h1>
      </main>

      <footer className='z-10 absolute p-2 flex gap-2 bottom-0'>
        <a
          href='https://www.instagram.com/happyphysics.club'
          target='_blank'
          rel='noopener noreferrer'
          className='text-md md:text-lg w-fit h-fit px-2 border border-white rounded-full bg-white text-black hover:bg-black hover:text-white'>
          @happyphysicsclub
        </a>
      </footer>

      <P5Canvas className='w-full h-full' />
    </>
  )
}
