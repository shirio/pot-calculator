export default function PlayerEditor({ players, heroIndex, onPlayerChange, onHeroChange }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
      <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Players</h2>
      <div className="space-y-1.5">
        {players.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            <button
              onClick={() => onHeroChange(i)}
              className={`w-14 text-xs font-mono font-bold px-1 py-1 rounded transition-colors ${
                i === heroIndex
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Set as hero"
            >
              {p.label}
            </button>

            <input
              type="number"
              min="0"
              value={p.committed}
              onChange={e => onPlayerChange(i, { committed: parseFloat(e.target.value) || 0 })}
              disabled={p.isFolded}
              className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-40"
              placeholder="Committed"
            />

            <button
              onClick={() => onPlayerChange(i, { isFolded: !p.isFolded })}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                p.isFolded
                  ? 'bg-red-700 text-red-200'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {p.isFolded ? 'Fold' : 'In'}
            </button>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs">Click a seat label to set as Hero (yellow). Enter chips committed this street.</p>
    </div>
  )
}
