// loading.tsx

import React from 'react'
import { LoadingSpinner } from '@/components'

export default function Loading() {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center bg-background'>
      <LoadingSpinner size={150} className='' />
    </div>
  )
}
