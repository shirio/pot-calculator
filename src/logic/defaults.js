import { getSeatLabels } from './seatLabels.js'

export function makeDefaultPlayers(numPlayers, smallBlind, bigBlind, street) {
  const labels = getSeatLabels(numPlayers)
  return labels.map((label, i) => ({
    id: i,
    label,
    committed: street === 'preflop'
      ? (i === 1 ? smallBlind : i === 2 ? bigBlind : 0)
      : 0,
    isHero: i === 0,
    isFolded: false,
  }))
}

export const DEFAULT_STATE = {
  street: 'preflop',
  smallBlind: 1,
  bigBlind: 2,
  numPlayers: 6,
  basePot: 0,
  heroIndex: 0,
}
