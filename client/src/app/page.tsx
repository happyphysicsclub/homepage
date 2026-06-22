'use client'

import { P5Canvas } from '@/components/p5'

export default function Page() {
  return (
    <>
      {/* <div className='fixed top-1/2 left-1/2 -translate-x-1/2 p-4 -translate-y-1/2 w-fit h-16 flex items-center justify-center bg-white z-50'>
        <span className='text-xs md:text-sm text-black text-left'>
          Site is under construction. We will be back with a great look soon!
          <br /> 사이트는 현재 공사 중입니다. 곧 멋진 모습으로 찾아뵙겠습니다!
        </span>
      </div> */}
      <section className='w-full h-[calc(100dvh-3rem)] relative'>
        {/* <h1 className='z-10 p-2 md:p-2 text-3xl md:text-6xl text-black font-light absolute md:top-2 md:left-4 animate-gravity'>
          <HoverText text='happyphysicsclub is a physics-loving graphic club.' />
        </h1> */}
        <P5Canvas className='w-full h-full' />
      </section>
      {/* <section className='w-full bg-background px-4 py-12 md:px-8'>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-2'>
              <div className='w-full aspect-[4/3] bg-gray-200' />
              <div className='h-3 w-3/4 bg-gray-200' />
              <div className='h-3 w-1/2 bg-gray-200' />
            </div>
          ))}
        </div>
      </section> */}
    </>
  )
}
