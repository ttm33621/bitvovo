import { ExternalLink, RefreshCw } from 'lucide-react'
import { LINKS } from '../api'

interface HeaderProps {
  onRefresh: () => void
  loading: boolean
  lastUpdated?: Date | null
}

export function Header({ onRefresh, loading, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b border-dex-border bg-dex-card/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-500/20">
            INK
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">INK / WBNB</h1>
            <p className="text-xs text-dex-muted">PancakeSwap V3 · BSC · 1% fee</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-dex-muted hidden sm:inline">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg bg-dex-bg border border-dex-border hover:border-dex-accent transition disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={LINKS.dexscreener}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dex-bg border border-dex-border hover:border-dex-accent text-sm transition"
          >
            DexScreener <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={LINKS.pancakeswap}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dex-accent hover:bg-blue-600 text-white text-sm font-medium transition"
          >
            Trade
          </a>
        </div>
      </div>
    </header>
  )
}
