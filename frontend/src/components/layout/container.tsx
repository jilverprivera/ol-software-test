import React from 'react'

type ContainerProps = {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="max-w-screen-2xl w-11/12 mx-auto min-h-[calc(100vh-5rem)] py-4">
      {children}
    </div>
  )
}
