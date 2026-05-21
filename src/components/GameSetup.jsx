const STREETS = ['preflop', 'postflop']

export default function GameSetup({ street, smallBlind, bigBlind, numPlayers, basePot, onChange }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Game Setup</h2>

      <div className="flex items-end gap-4">
        <div className="shrink-0">
          <label className="text-gray-400 text-xs mb-1 block">Street</label>
          <div className="flex gap-1">
            {STREETS.map(s => (
              <button
                key={s}
                onClick={() => onChange({ street: s })}
                className={`px-2 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  street === s
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="text-gray-400 text-xs mb-1 block">Players</label>
          <div className="flex gap-1">
            {[2,3,4,5,6,7,8,9].map(n => (
              <button
                key={n}
                onClick={() => onChange({ numPlayers: n })}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  numPlayers === n
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Small Blind</label>
          <input
            type="number"
            min="0"
            value={smallBlind}
            onChange={e => onChange({ smallBlind: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Big Blind</label>
          <input
            type="number"
            min="0"
            value={bigBlind}
            onChange={e => onChange({ bigBlind: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Base Pot</label>
          <input
            type="number"
            min="0"
            value={basePot}
            onChange={e => onChange({ basePot: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  )
}
