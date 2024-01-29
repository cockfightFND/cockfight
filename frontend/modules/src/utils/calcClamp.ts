export default function calcClamp(min: number, max: number, unit = "vw") {
  if (unit === "vh") return `clamp(${min}px, ${(max * 100) / 1080}vh, ${max}px)`
  return max < 0
    ? `calc( -1 * clamp(${-1 * min}px, ${(-1 * max * 100) / 1920}vw, ${-1 * max}px))`
    : `clamp(${min}px, ${(max * 100) / 1920}vw, ${max}px)`
}
