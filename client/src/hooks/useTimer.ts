'use client'

import { useEffect, useState } from 'react'

export const useTimer = (): string => {
  const [timer, setTimer] = useState('00:00:00')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTimer([d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':'))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return timer
}
