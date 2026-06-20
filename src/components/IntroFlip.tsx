import { useEffect, useState } from "react"

const COLS = 8
const ROWS = 5
const TILE_COUNT = COLS * ROWS
const INTRO_STORAGE_KEY = "ifu-intro-flip-played"

export default function IntroFlip() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY)) {
      setDone(true)
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (prefersReducedMotion) {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1")
      setDone(true)
      return
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1")
      setDone(true)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [])

  if (done) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] grid bg-foreground"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        perspective: "1200px",
      }}
      aria-hidden="true"
    >
      {Array.from({ length: TILE_COUNT }).map((_, index) => {
        const row = Math.floor(index / COLS)
        const col = index % COLS
        const delay = (row + col) * 60

        return (
          <div
            key={index}
            className="intro-flip-tile"
            style={{ animationDelay: `${delay}ms` }}
          />
        )
      })}
    </div>
  )
}
