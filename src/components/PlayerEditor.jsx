function getActionOrder(numPlayers, street) {
  if (numPlayers === 2) {
    return street === 'preflop' ? [0, 1] : [1, 0]
  }
  if (street === 'preflop') {
    // UTG (3) ... CO (n-1), BTN (0), SB (1), BB (2)
    const order = []
    for (let i = 3; i < numPlayers; i++) order.push(i)
    order.push(0, 1, 2)
    return order
  } else {
    // SB (1), BB (2), UTG (3) ... CO (n-1), BTN (0)
    const order = [1, 2]
    for (let i = 3; i < numPlayers; i++) order.push(i)
    order.push(0)
    return order
  }
}

export default function PlayerEditor({ players, heroIndex, street, onPlayerChange, onHeroChange }) {
  const order = getActionOrder(players.length, street)

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
      <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Players</h2>
      <div className="space-y-1.5">
        {order.map(i => {
          const p = players[i]
          return (
            <div key={p.id} className="flex items-center gap-2">
              <button
                onClick={() => !p.isFolded && onHeroChange(i)}
                disabled={p.isFolded}
                className={`w-14 text-xs font-mono font-bold px-1 py-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  i === heroIndex
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={p.isFolded ? 'Folded' : 'Set as hero'}
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
          )
        })}
      </div>
      <p className="text-gray-500 text-xs">Click a seat label to set as Hero (yellow). Enter chips committed this street.</p>
    </div>
  )
}
