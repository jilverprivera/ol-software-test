import React from 'react'

type ContainerProps = {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="max-w-screen-2xl mx-auto min-h-screen py-4">
      {children}
    </div>
  )
}
