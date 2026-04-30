// loading.tsx

import { LoadingSpinner, LogoSpinner } from '@/components'

export default function Loading() {
  return (
    <div className='w-screen h-dvh flex flex-col items-center justify-center bg-background'>
      {/* <LoadingSpinner size={150} className='' /> */}
      <LogoSpinner />
    </div>
  )
}
