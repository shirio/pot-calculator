const fmt = v => v % 1 === 0 ? String(v) : v.toFixed(1)

const BLIND_LABELS = new Set(['SB', 'BB', 'BTN/SB'])

export default function PokerTable({ players, heroIndex, totalPot }) {
  const numSeats = players.length

  const seats = players.map((p, i) => {
    const angle = (2 * Math.PI * i / numSeats) - Math.PI / 2
    const x = 350 + 280 * Math.cos(angle)
    const y = 200 + 155 * Math.sin(angle)
    const chipX = 350 + 195 * Math.cos(angle)
    const chipY = 200 + 108 * Math.sin(angle)
    return { ...p, x, y, angle, chipX, chipY }
  })

  return (
    <div className="bg-gray-800 rounded-xl p-3">
      <svg viewBox="0 0 700 400" className="w-full" style={{ maxHeight: 260 }}>
        {/* Rail */}
        <ellipse cx="350" cy="200" rx="330" ry="190" fill="#0a0a0a" />
        {/* Felt */}
        <ellipse cx="350" cy="200" rx="315" ry="175" fill="#1e3a8a" />
        <ellipse cx="350" cy="200" rx="315" ry="175" fill="none" stroke="#3b5fc0" strokeWidth="2" />

        {/* Pot display */}
        <text x="350" y="186" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold" fontFamily="monospace">
          POT
        </text>
        <text x="350" y="218" textAnchor="middle" fill="white" fontSize="29" fontWeight="bold" fontFamily="monospace">
          {fmt(totalPot)}
        </text>

        {seats.map((p, i) => {
          const isHero = i === heroIndex
          const isFolded = p.isFolded
          const hasChips = !isFolded && p.committed > 0
          const isBlind = BLIND_LABELS.has(p.label)

          const bgColor = isHero ? '#eab308' : isFolded ? '#374151' : '#1f2937'
          const textColor = isHero ? '#1a1a1a' : isFolded ? '#6b7280' : '#f9fafb'
          const ringColor = isHero ? '#fde047' : '#4b5563'

          // Periwinkle for blinds, magenta-pink for others
          const chipFill = isBlind ? '#818cf8' : '#ec4899'
          const chipStroke = isBlind ? '#c7d2fe' : '#fbcfe8'

          const showDealer = i === 0
          const dAngle = p.angle - 0.25
          const dx = 350 + 250 * Math.cos(dAngle)
          const dy = 200 + 140 * Math.sin(dAngle)

          const onLeft = Math.cos(p.angle) < -0.1
          const chipCx = p.chipX + (onLeft ? 10 : -10)
          const textX = p.chipX + (onLeft ? -4 : 4)
          const textAnchor = onLeft ? 'end' : 'start'

          return (
            <g key={p.id}>
              {showDealer && (
                <g>
                  <circle cx={dx} cy={dy} r="10" fill="white" stroke="#ccc" strokeWidth="1" />
                  <text x={dx} y={dy + 4} textAnchor="middle" fill="#1a1a1a" fontSize="9" fontWeight="bold">D</text>
                </g>
              )}

              <circle cx={p.x} cy={p.y} r="30" fill={bgColor} stroke={ringColor} strokeWidth={isHero ? 2.5 : 1.5} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="19" fontWeight="bold" fontFamily="monospace">
                {p.label}
              </text>

              {isFolded && (
                <text x={p.x} y={p.y + 22} textAnchor="middle" fill="#6b7280" fontSize="8">fold</text>
              )}

              {hasChips && (
                <g>
                  <circle cx={chipCx} cy={p.chipY} r="10" fill={chipFill} stroke={chipStroke} strokeWidth="1.5" />
                  <circle cx={chipCx} cy={p.chipY} r="7" fill="none" stroke={chipStroke} strokeWidth="1" strokeDasharray="3 2" />
                  <text
                    x={textX}
                    y={p.chipY + 1}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="20"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
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
