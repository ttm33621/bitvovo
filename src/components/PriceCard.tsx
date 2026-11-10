import { formatUsd, formatPercent } from '../api'
import type { Pair } from '../types'

interface PriceCardProps {
  pair: Pair
}

export function PriceCard({ pair }: PriceCardProps) {
  const change24h = pair.priceChange?.h24
  const isUp = (change24h ?? 0) >= 0

  return (
    <div className="bg-dex-card border border-dex-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-dex-muted mb-1">Price USD</p>
          <p className="text-3xl font-bold tracking-tight font-mono">
            {formatUsd(pair.priceUsd, 6)}
          </p>
          <p className="text-sm text-dex-muted mt-1 font-mono">
            {parseFloat(pair.priceNative).toExponential(4)} {pair.quoteToken.symbol}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
            isUp ? 'bg-green-500/15 text-dex-green' : 'bg-red-500/15 text-dex-red'
          }`}
        >
          {formatPercent(change24h)} 24h
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-dex-border">
        <Stat label="Liquidity" value={formatUsd(pair.liquidity?.usd, 0)} />
        <Stat label="FDV" value={formatUsd(pair.fdv, 0)} />
        <Stat label="Mkt Cap" value={formatUsd(pair.marketCap, 0)} />
        <Stat label="24h Volume" value={formatUsd(pair.volume?.h24, 0)} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-dex-muted mb-0.5">{label}</p>
      <p className="font-semibold font-mono text-sm">{value}</p>
    </div>
  )
}
