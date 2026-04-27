import type { ReactNode } from 'react'

interface ChartPanelProps {
  title: string
  annotation?: string
  caption: ReactNode
  children: ReactNode
  panelId?: string
}

export default function ChartPanel({
  title,
  annotation,
  caption,
  children,
  panelId,
}: ChartPanelProps) {
  return (
    <div className="border border-terminal-border bg-terminal-panel p-4 mb-4">
      <div className="flex items-start gap-2 mb-1">
        {panelId && (
          <span className="font-mono text-[9px] text-terminal-orange border border-terminal-orange/40 bg-[#1a1208] px-1 py-0.5 flex-shrink-0 mt-0.5">
            {panelId}
          </span>
        )}
        <h3 className="font-sans text-sm font-semibold text-terminal-text">{title}</h3>
      </div>
      {annotation && (
        <p className="font-sans text-xs text-terminal-cyan font-medium mb-3 max-w-2xl">{annotation}</p>
      )}
      <div className="mt-3">{children}</div>
      <p className="mt-4 font-sans text-[11px] text-terminal-dim leading-relaxed border-t border-terminal-border pt-3">
        {caption}
      </p>
    </div>
  )
}
