import type { ReactNode } from 'react'

interface WorkedExampleProps {
  children: ReactNode
}

export default function WorkedExample({ children }: WorkedExampleProps) {
  return (
    <div
      className="border-l-[3px] bg-terminal-panel px-4 py-3 mb-2"
      style={{ borderLeftColor: '#ff8a1a' }}
    >
      <p className="font-mono text-[12px] text-terminal-orange uppercase tracking-widest mb-2">
        Worked Example
      </p>
      <div className="font-sans text-[14px] text-terminal-muted space-y-2">
        {children}
      </div>
    </div>
  )
}
