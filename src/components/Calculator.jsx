import { useState } from 'react'
import { findPercent, findRaiseTo } from '../logic/potCalc.js'
import FormulaBreakdown from './FormulaBreakdown.jsx'

const PCT_BUTTONS = [25, 33, 50, 67, 75, 100]

export default function Calculator({ totalPot, activeTableBet, alreadyCommitted }) {
  const [tab, setTab] = useState('findRaiseTo')
  const [pctInput, setPctInput] = useState('')
  const [raiseInput, setRaiseInput] = useState('')

  const toCall = activeTableBet - alreadyCommitted
  const potIfCalled = totalPot + toCall

  // Tab A: given %, find raise-to
  const pctVal = parseFloat(pctInput) / 100
  const raiseTo = !isNaN(pctVal) && pctVal > 0
    ? findRaiseTo(pctVal, totalPot, activeTableBet, alreadyCommitted)
    : null

  // Tab B: given raise-to, find %
  const raiseVal = parseFloat(raiseInput)
  const pctResult = !isNaN(raiseVal) && raiseVal > activeTableBet
    ? findPercent(raiseVal, totalPot, activeTableBet, alreadyCommitted)
    : null
  const raiseError = !isNaN(raiseVal) && raiseVal > 0 && raiseVal <= activeTableBet
    ? 'Must be more than the current bet'
    : null

  const fmt = v => v % 1 === 0 ? v.toString() : v.toFixed(2)

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => setTab('findRaiseTo')}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'findRaiseTo' ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          X% → Raise to
        </button>
        <button
          onClick={() => setTab('findPercent')}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'findPercent' ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Raise to → What %?
        </button>
      </div>

      {/* Context summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-900 rounded-lg p-2">
          <div className="text-gray-400 text-xs">Pot</div>
          <div className="text-white font-mono font-bold">{fmt(totalPot)}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-2">
          <div className="text-gray-400 text-xs">To Call</div>
          <div className="text-white font-mono font-bold">{fmt(toCall)}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-2">
          <div className="text-gray-400 text-xs">Pot if Called</div>
          <div className="text-white font-mono font-bold">{fmt(potIfCalled)}</div>
        </div>
      </div>

      {tab === 'findRaiseTo' && (
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Target pot %</label>
            <div className="flex gap-1 flex-wrap mb-2">
              {PCT_BUTTONS.map(p => (
                <button
                  key={p}
                  onClick={() => setPctInput(String(p))}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    pctInput === String(p)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="999"
              value={pctInput}
              onChange={e => setPctInput(e.target.value)}
              placeholder="Custom %"
              className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {raiseTo !== null && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
              <div className="text-green-400 text-xs uppercase tracking-wider mb-1">Raise to</div>
              <div className="text-green-300 font-mono text-3xl font-bold">{fmt(raiseTo)}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'findPercent' && (
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Raise-to amount</label>
            <input
              type="number"
              min="0"
              value={raiseInput}
              onChange={e => setRaiseInput(e.target.value)}
              placeholder="Enter raise amount"
              className={`w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                raiseError ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-green-500'
              }`}
            />
            {raiseError && <p className="text-red-400 text-xs mt-1">{raiseError}</p>}
          </div>

          {pctResult !== null && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
              <div className="text-green-400 text-xs uppercase tracking-wider mb-1">Pot percentage</div>
              <div className="text-green-300 font-mono text-3xl font-bold">{(pctResult * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}

      <FormulaBreakdown
        totalPot={totalPot}
        activeTableBet={activeTableBet}
        alreadyCommitted={alreadyCommitted}
        mode={tab}
        value={tab === 'findRaiseTo' ? pctVal : raiseVal}
      />
    </div>
  )
}
