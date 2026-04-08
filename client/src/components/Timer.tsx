'use client'

import { useTimer } from '@/hooks/useTimer'

export function Timer() {
  const timer = useTimer()

  return (
    <span className='text-md md:text-lg w-fit h-fit px-2 border border-white rounded-full hover:bg-white hover:text-black animate-pulse'>
      Timezone {timer}
    </span>
  )
}
