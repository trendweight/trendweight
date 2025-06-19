import { ReactNode } from 'react'
import clsx from 'clsx'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-4',
        'sm:max-w-[640px]',
        'md:max-w-[768px]',
        'lg:max-w-[1024px]',
        'xl:max-w-[1280px]',
        className
      )}
    >
      {children}
    </div>
  )
}