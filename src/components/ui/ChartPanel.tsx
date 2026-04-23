import type { ReactNode } from 'react'

interface ChartPanelProps {
  title: string
  annotation?: string
  caption: ReactNode
  children: ReactNode
}

export default function ChartPanel({
  title,
  annotation,
  caption,
  children,
}: ChartPanelProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 sm:p-8 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {annotation && (
        <p className="text-sm text-syracuse-navy font-medium mb-5 max-w-2xl">{annotation}</p>
      )}
      <div className="mt-4">{children}</div>
      <p className="mt-5 text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-4">
        {caption}
      </p>
    </div>
  )
}
