interface Props {
  onAboutOpen: () => void
}

export default function CommandBar({ onAboutOpen }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-6 flex items-center px-4 sm:px-6 bg-terminal-bg border-t border-terminal-border">
      {/* Shortcuts — hidden on mobile except ABOUT */}
      <div className="flex items-center gap-4 flex-1">
        <span className="hidden sm:inline font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-muted">[H]</span> HELP
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-muted">[/]</span> SEARCH
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-muted">[R]</span> REFRESH
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-muted">[E]</span> EXPORT
        </span>
        <button
          onClick={onAboutOpen}
          className="font-mono text-[10px] text-terminal-dim hover:text-terminal-text transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          <span className="text-terminal-muted">[?]</span> GLOSSARY
        </button>
      </div>

      {/* Build stamp — hidden on mobile to avoid crowding */}
      <div className="flex-shrink-0 ml-auto">
        <span className="hidden sm:inline font-mono text-[10px] text-terminal-dim">BUILD 2026.04.28</span>
      </div>
    </div>
  )
}
