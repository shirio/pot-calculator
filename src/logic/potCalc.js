/**
 * raiseToAmount - activeTableBet) / (totalPot + toCall)
 */
export function findPercent(raiseToAmount, totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  const denominator = totalPot + toCall
  if (denominator === 0) return 0
  return (raiseToAmount - activeTableBet) / denominator
}

/**
 * (targetPct × (totalPot + toCall)) + activeTableBet
 */
export function findRaiseTo(targetPct, totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  return (targetPct * (totalPot + toCall)) + activeTableBet
}

export function calcBreakdown(totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  const potIfCalled = totalPot + toCall
  return { toCall, potIfCalled }
}
