const fmt = v => v % 1 === 0 ? String(v) : v.toFixed(1)

export default function PokerTable({ players, heroIndex, totalPot }) {
  const numSeats = players.length

  const seats = players.map((p, i) => {
    const angle = (2 * Math.PI * i / numSeats) - Math.PI / 2
    const x = 350 + 280 * Math.cos(angle)
    const y = 200 + 155 * Math.sin(angle)
    // Chip position: ~65% of way from center to seat
    const chipX = 350 + 190 * Math.cos(angle)
    const chipY = 200 + 105 * Math.sin(angle)
    return { ...p, x, y, angle, chipX, chipY }
  })

  return (
    <div className="bg-gray-800 rounded-xl p-3">
      <svg viewBox="0 0 700 400" className="w-full" style={{ maxHeight: 260 }}>
        {/* Rail */}
        <ellipse cx="350" cy="200" rx="330" ry="190" fill="#5c3a1e" />
        {/* Felt */}
        <ellipse cx="350" cy="200" rx="315" ry="175" fill="#1a6b3a" />
        <ellipse cx="350" cy="200" rx="315" ry="175" fill="none" stroke="#2d8a50" strokeWidth="2" />

        {/* Pot display */}
        <text x="350" y="190" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace">
          POT
        </text>
        <text x="350" y="210" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">
          {fmt(totalPot)}
        </text>

        {seats.map((p, i) => {
          const isHero = i === heroIndex
          const isFolded = p.isFolded
          const hasChips = !isFolded && p.committed > 0

          const bgColor = isHero ? '#eab308' : isFolded ? '#374151' : '#1f2937'
          const textColor = isHero ? '#1a1a1a' : isFolded ? '#6b7280' : '#f9fafb'
          const ringColor = isHero ? '#fde047' : '#4b5563'

          const showDealer = i === 0
          const dAngle = p.angle - 0.25
          const dx = 350 + 250 * Math.cos(dAngle)
          const dy = 200 + 140 * Math.sin(dAngle)

          return (
            <g key={p.id}>
              {showDealer && (
                <g>
                  <circle cx={dx} cy={dy} r="10" fill="white" stroke="#ccc" strokeWidth="1" />
                  <text x={dx} y={dy + 4} textAnchor="middle" fill="#1a1a1a" fontSize="9" fontWeight="bold">D</text>
                </g>
              )}

              {/* Seat circle */}
              <circle cx={p.x} cy={p.y} r="30" fill={bgColor} stroke={ringColor} strokeWidth={isHero ? 2.5 : 1.5} />

              {/* Position label — bigger, centered */}
              <text x={p.x} y={p.y + 5} textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="monospace">
                {p.label}
              </text>

              {isFolded && (
                <text x={p.x} y={p.y + 20} textAnchor="middle" fill="#6b7280" fontSize="8">fold</text>
              )}

              {/* Bet chip */}
              {hasChips && (
                <g>
                  <circle cx={p.chipX} cy={p.chipY} r="14" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
                  <circle cx={p.chipX} cy={p.chipY} r="10" fill="none" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 2" />
                  <text x={p.chipX} y={p.chipY + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {fmt(p.committed)}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
