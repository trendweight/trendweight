import { ReactNode } from 'react'

interface QuestionProps {
  title: string
  children: ReactNode
}

export function Question({ title, children }: QuestionProps) {
  return (
    <div>
      <dt className="text-gray-900 text-lg font-semibold leading-6">
        {title}
      </dt>
      <dd className="mt-2 text-gray-600 text-base prose prose-gray">
        {children}
      </dd>
    </div>
  )
}