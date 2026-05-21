import { useState } from 'react'

function Row({ label, value, highlight }) {
  const fmt = v => (typeof v === 'number' ? (v % 1 === 0 ? v.toString() : v.toFixed(2)) : v)
  return (
    <div className={`flex justify-between font-mono text-sm ${highlight ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
      <span className="text-gray-400">{label}</span>
      <span>{fmt(value)}</span>
    </div>
  )
}

export default function FormulaBreakdown({ totalPot, activeTableBet, alreadyCommitted, mode, value }) {
  const [open, setOpen] = useState(true)
  const toCall = activeTableBet - alreadyCommitted
  const potIfCalled = totalPot + toCall

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-400 text-xs hover:text-gray-200 transition-colors"
      >
        <span className="uppercase tracking-wider font-semibold">Formula Breakdown</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1">
          <Row label="Total pot" value={totalPot} />
          <Row label="Standing bet" value={activeTableBet} />
          <Row label="Hero committed" value={alreadyCommitted} />
          <Row label="Hero must call" value={toCall} />
          <Row label="Pot if called" value={potIfCalled} />
          <div className="border-t border-gray-700 my-1" />

          {mode === 'findRaiseTo' && typeof value === 'number' && (
            <>
              <Row label={`× ${(value * 100).toFixed(0)}%`} value={potIfCalled * value} />
              <Row label="+ standing bet" value={activeTableBet} />
              <div className="border-t border-gray-700 my-1" />
              <Row label="Raise to" value={(value * potIfCalled) + activeTableBet} highlight />
            </>
          )}

          {mode === 'findPercent' && typeof value === 'number' && (
            <>
              <Row label="Raise-to amount" value={value} />
              <Row label="− standing bet" value={value - activeTableBet} />
              <Row label="÷ pot if called" value={potIfCalled > 0 ? (value - activeTableBet) / potIfCalled : 0} />
              <div className="border-t border-gray-700 my-1" />
              <Row label="= % of pot" value={potIfCalled > 0 ? `${(((value - activeTableBet) / potIfCalled) * 100).toFixed(1)}%` : '—'} highlight />
            </>
          )}
        </div>
      )}
    </div>
  )
}
