'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, Preload, useProgress } from '@react-three/drei'
import { Spinner } from '@/components/Spinner'
import React from 'react'

export const Common = ({ color }: { color?: string }) => (
  <>
    {color && <color attach='background' args={[color]} />}
  </>
)

export const Loader = () => {
  const progress = Math.floor(useProgress().progress)
  return (
    <Html center>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-black justify-center items-center w-screen h-screen z-50'>
        <Spinner progress={progress} />
      </div>
    </Html>
  )
}

const Scene = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef(null)

  return (
    <Canvas
      ref={canvasRef}
      camera={{ fov: 30, near: 0.1, far: 1000, position: [5, 5, 5] }}
      shadows>
      <fog attach='fog' args={['#111', 0, 50]} />
      <Suspense fallback={<Loader />}>
        {children}
        <Preload all />
      </Suspense>
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI * 0.495}
        autoRotate={true}
        autoRotateSpeed={1}
      />
    </Canvas>
  )
}

export default Scene
