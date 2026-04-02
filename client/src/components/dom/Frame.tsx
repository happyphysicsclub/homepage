'use client'

import { useRef, forwardRef, useImperativeHandle } from 'react'

const Frame = forwardRef(
  (
    {
      children,
      ...props
    }: {
      children: React.ReactNode
    },
    ref,
  ) => {
    const localRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => localRef.current)

    return (
      <div {...props} ref={localRef} className='flex flex-col w-screen h-full'>
        {children}
      </div>
    )
  },
)
Frame.displayName = 'Frame'

export default Frame
