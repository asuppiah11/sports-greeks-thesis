// Precomputed log-factorials for k = 0..20
const LOG_FACT = Array.from({ length: 21 }, (_, k) => {
  let s = 0
  for (let i = 2; i <= k; i++) s += Math.log(i)
  return s
})

function logFact(k: number): number {
  if (k <= 20) return LOG_FACT[k]
  let s = LOG_FACT[20]
  for (let i = 21; i <= k; i++) s += Math.log(i)
  return s
}

export function poissonPMF(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0
  return Math.exp(-lambda + k * Math.log(lambda) - logFact(k))
}

export interface MatchProbs {
  homeWin: number
  draw: number
  awayWin: number
}

function probsFromLambdas(muHome: number, muAway: number, curHome: number, curAway: number): MatchProbs {
  let homeWin = 0, draw = 0, awayWin = 0
  // Sum over additional goals (0..8 for each team)
  for (let dh = 0; dh <= 8; dh++) {
    for (let da = 0; da <= 8; da++) {
      const p = poissonPMF(dh, muHome) * poissonPMF(da, muAway)
      const finalHome = curHome + dh
      const finalAway = curAway + da
      if (finalHome > finalAway) homeWin += p
      else if (finalHome === finalAway) draw += p
      else awayWin += p
    }
  }
  const total = homeWin + draw + awayWin
  if (total === 0) return { homeWin: 1 / 3, draw: 1 / 3, awayWin: 1 / 3 }
  return { homeWin: homeWin / total, draw: draw / total, awayWin: awayWin / total }
}

export function computeMatchProbs(
  lambdaHome: number,
  lambdaAway: number,
  minute: number,
  currentHome: number,
  currentAway: number,
): MatchProbs {
  const tRemaining = Math.max(0, (90 - minute) / 90)
  const muHome = lambdaHome * tRemaining
  const muAway = lambdaAway * tRemaining
  return probsFromLambdas(muHome, muAway, currentHome, currentAway)
}

// Theoretical delta: change in homeWin prob after a hypothetical home goal
export function computeDeltaHome(
  lambdaHome: number,
  lambdaAway: number,
  minute: number,
  currentHome: number,
  currentAway: number,
): number {
  const before = computeMatchProbs(lambdaHome, lambdaAway, minute, currentHome, currentAway)
  const after  = computeMatchProbs(lambdaHome, lambdaAway, minute, currentHome + 1, currentAway)
  return after.homeWin - before.homeWin
}
