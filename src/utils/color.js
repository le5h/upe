export const ACCENT_STOPS = [
  [0, [239, 68, 68]],
  [0.25, [249, 115, 22]],
  [0.5, [52, 211, 153]],
  [0.75, [59, 130, 246]],
  [1, [124, 92, 252]],
]

export function accentColor(t) {
  const stops = ACCENT_STOPS
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const lo = stops[i - 1], hi = stops[i]
      const f = (t - lo[0]) / (hi[0] - lo[0])
      const r = Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f)
      const g = Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f)
      const b = Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f)
      return `${r},${g},${b}`
    }
  }
  return `${stops[stops.length - 1][1][0]},${stops[stops.length - 1][1][1]},${stops[stops.length - 1][1][2]}`
}
