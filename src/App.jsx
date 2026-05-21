import { useState } from 'react'
import { DEFAULT_STATE, makeDefaultPlayers } from './logic/defaults.js'
import GameSetup from './components/GameSetup.jsx'
import PlayerEditor from './components/PlayerEditor.jsx'
import PokerTable from './components/PokerTable.jsx'
import Calculator from './components/Calculator.jsx'

export default function App() {
  const [street, setStreet] = useState(DEFAULT_STATE.street)
  const [smallBlind, setSmallBlind] = useState(DEFAULT_STATE.smallBlind)
  const [bigBlind, setBigBlind] = useState(DEFAULT_STATE.bigBlind)
  const [numPlayers, setNumPlayers] = useState(DEFAULT_STATE.numPlayers)
  const [basePot, setBasePot] = useState(DEFAULT_STATE.basePot)
  const [heroIndex, setHeroIndex] = useState(DEFAULT_STATE.heroIndex)
  const [players, setPlayers] = useState(() =>
    makeDefaultPlayers(DEFAULT_STATE.numPlayers, DEFAULT_STATE.smallBlind, DEFAULT_STATE.bigBlind, DEFAULT_STATE.street)
  )

  function handleSetupChange(changes) {
    const next = {
      street, smallBlind, bigBlind, numPlayers, basePot,
      ...changes,
    }
    if ('street' in changes) setStreet(changes.street)
    if ('smallBlind' in changes) setSmallBlind(changes.smallBlind)
    if ('bigBlind' in changes) setBigBlind(changes.bigBlind)
    if ('basePot' in changes) setBasePot(changes.basePot)

    if ('numPlayers' in changes || 'street' in changes || 'smallBlind' in changes || 'bigBlind' in changes) {
      setPlayers(makeDefaultPlayers(next.numPlayers, next.smallBlind, next.bigBlind, next.street))
      setHeroIndex(0)
      if ('numPlayers' in changes) setNumPlayers(changes.numPlayers)
    }
  }

  function handlePlayerChange(index, changes) {
    setPlayers(prev => prev.map((p, i) => i === index ? { ...p, ...changes } : p))
  }

  const totalPot = basePot + players.reduce((sum, p) => sum + p.committed, 0)
  const hero = players[heroIndex]
  const activeTableBet = Math.max(
    0,
    ...players
      .filter((p, i) => i !== heroIndex && !p.isFolded)
      .map(p => p.committed)
  )
  const alreadyCommitted = hero ? hero.committed : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-green-400 tracking-tight">♠ Pot Calculator</h1>
          <p className="text-gray-500 text-sm mt-1">Calculate pot-sized bets instantly</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <GameSetup
              street={street}
              smallBlind={smallBlind}
              bigBlind={bigBlind}
              numPlayers={numPlayers}
              basePot={basePot}
              onChange={handleSetupChange}
            />
            <PlayerEditor
              players={players}
              heroIndex={heroIndex}
              street={street}
              onPlayerChange={handlePlayerChange}
              onHeroChange={setHeroIndex}
            />
          </div>

          <div className="space-y-4">
            <PokerTable
              players={players}
              heroIndex={heroIndex}
              totalPot={totalPot}
            />
            <Calculator
              totalPot={totalPot}
              activeTableBet={activeTableBet}
              alreadyCommitted={alreadyCommitted}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
