'use client'

import { useState, useEffect } from 'react'

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return isMobile
}
