import type { Pair } from '../types'
import { formatNumber } from '../api'

interface TxnStatsProps {
  pair: Pair
}

export function TxnStats({ pair }: TxnStatsProps) {
  const periods = [
    { key: 'm5' as const, label: '5m' },
    { key: 'h1' as const, label: '1h' },
    { key: 'h6' as const, label: '6h' },
    { key: 'h24' as const, label: '24h' },
  ]

  return (
    <div className="bg-dex-card border border-dex-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-dex-muted mb-4">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-dex-muted text-xs border-b border-dex-border">
              <th className="text-left pb-2 font-medium">Period</th>
              <th className="text-right pb-2 font-medium">Buys</th>
              <th className="text-right pb-2 font-medium">Sells</th>
              <th className="text-right pb-2 font-medium">Total</th>
              <th className="text-right pb-2 font-medium">Volume</th>
              <th className="text-right pb-2 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {periods.map(({ key, label }) => {
              const tx = pair.txns?.[key]
              const buys = tx?.buys ?? 0
              const sells = tx?.sells ?? 0
              const vol = pair.volume?.[key]
              const change = pair.priceChange?.[key]
              const isUp = (change ?? 0) >= 0
              return (
                <tr key={key} className="border-b border-dex-border/50 last:border-0">
                  <td className="py-2.5 font-medium">{label}</td>
                  <td className="py-2.5 text-right text-dex-green font-mono">{buys}</td>
                  <td className="py-2.5 text-right text-dex-red font-mono">{sells}</td>
                  <td className="py-2.5 text-right font-mono">{buys + sells}</td>
                  <td className="py-2.5 text-right font-mono">
                    {vol !== undefined ? `$${formatNumber(vol)}` : '—'}
                  </td>
                  <td
                    className={`py-2.5 text-right font-mono ${
                      isUp ? 'text-dex-green' : 'text-dex-red'
                    }`}
                  >
                    {change !== undefined ? `${isUp ? '+' : ''}${change.toFixed(2)}%` : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
