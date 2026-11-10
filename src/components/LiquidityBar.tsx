import type { Pair } from '../types'
import { formatNumber } from '../api'

interface LiquidityBarProps {
  pair: Pair
}

export function LiquidityBar({ pair }: LiquidityBarProps) {
  const base = pair.liquidity?.base ?? 0
  const quote = pair.liquidity?.quote ?? 0
  const total = base + quote || 1
  const basePct = (base / total) * 100
  const quotePct = (quote / total) * 100

  return (
    <div className="bg-dex-card border border-dex-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-dex-muted mb-4">Pooled Tokens</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{pair.baseToken.symbol}</span>
            <span className="font-mono text-dex-muted">{formatNumber(base, 2)}</span>
          </div>
          <div className="h-2 rounded-full bg-dex-bg overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${basePct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{pair.quoteToken.symbol}</span>
            <span className="font-mono text-dex-muted">{formatNumber(quote, 4)}</span>
          </div>
          <div className="h-2 rounded-full bg-dex-bg overflow-hidden">
            <div className="h-full rounded-full bg-yellow-500" style={{ width: `${quotePct}%` }} />
          </div>
        </div>
      </div>
      <p className="text-xs text-dex-muted mt-3">
        Total liquidity ≈ {pair.liquidity?.usd ? `$${formatNumber(pair.liquidity.usd)}` : '—'}
      </p>
    </div>
  )
}
