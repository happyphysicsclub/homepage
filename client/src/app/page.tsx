import { HoverText } from '@/components'
import { P5Canvas } from '@/components/p5'

export default function Page() {
  return (
    <>
      <section className='w-full h-[50vh] md:h-[70vh] relative'>
        <h1 className='z-10 p-2 md:p-2 text-3xl md:text-6xl text-black font-light absolute md:top-2 md:left-4 animate-gravity'>
          <HoverText text='happyphysicsclub is a physics-loving graphic club.' />
        </h1>
        <P5Canvas className='w-full h-full' />
      </section>
      <section className='w-full bg-background px-4 py-12 md:px-8'>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-2'>
              <div className='w-full aspect-[4/3] bg-gray-200' />
              <div className='h-3 w-3/4 bg-gray-200' />
              <div className='h-3 w-1/2 bg-gray-200' />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
