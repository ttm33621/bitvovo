import { Copy, Check, ExternalLink } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { Pair } from '../types'
import { shortAddress, timeAgo, LINKS } from '../api'

interface TokenInfoProps {
  pair: Pair
}

export function TokenInfo({ pair }: TokenInfoProps) {
  return (
    <div className="bg-dex-card border border-dex-border rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-dex-muted">Pair Info</h2>

      <div className="space-y-3 text-sm">
        <Row label="Base Token">
          <span className="font-medium">{pair.baseToken.name}</span>
          <span className="text-dex-muted ml-1">({pair.baseToken.symbol})</span>
        </Row>
        <Row label="Quote Token">
          <span className="font-medium">{pair.quoteToken.symbol}</span>
        </Row>
        <Row label="DEX">
          <span className="capitalize">{pair.dexId}</span>
          {pair.labels?.map((l) => (
            <span
              key={l}
              className="ml-1.5 px-1.5 py-0.5 rounded text-xs bg-dex-bg border border-dex-border"
            >
              {l}
            </span>
          ))}
        </Row>
                <Row label="Pair Created">
          {timeAgo(pair.pairCreatedAt)}
        </Row>
        <Row label="Chain">
          <span className="uppercase">{pair.chainId}</span>
        </Row>
      </div>

      <div className="pt-3 border-t border-dex-border space-y-2">
        <CopyRow label="INK Contract" value={pair.baseToken.address} href={LINKS.bscscanToken} />
        <CopyRow label="Pair Address" value={pair.pairAddress} href={LINKS.bscscanPair} />
        <CopyRow
          label="WBNB"
          value={pair.quoteToken.address}
          href={`https://bscscan.com/token/${pair.quoteToken.address}`}
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <LinkBtn href={LINKS.pancakeswap}>PancakeSwap</LinkBtn>
        <LinkBtn href={LINKS.bscscanToken}>BscScan</LinkBtn>
        <LinkBtn href={LINKS.geckoterminal}>GeckoTerminal</LinkBtn>
        <LinkBtn href={LINKS.dexscreener}>DexScreener</LinkBtn>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-dex-muted">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  )
}

function CopyRow({ label, value, href }: { label: string; value: string; href: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-dex-muted shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs truncate hover:text-dex-accent transition"
          title={value}
        >
          {shortAddress(value, 6)}
        </a>
        <button onClick={copy} className="p-1 hover:bg-dex-bg rounded transition" title="Copy">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-dex-green" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-dex-muted" />
          )}
        </button>
      </div>
    </div>
  )
}

function LinkBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-dex-bg border border-dex-border hover:border-dex-accent transition"
    >
      {children} <ExternalLink className="w-3 h-3" />
    </a>
  )
}
