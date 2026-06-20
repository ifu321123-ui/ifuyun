import { useEffect, useState } from "react"
import { shouldUseLenis } from "@/lib/scrollEnv"

const COLS = 8
const ROWS = 5
const TILE_COUNT = COLS * ROWS
const INTRO_STORAGE_KEY = "ifu-intro-flip-played"

let introPlayed = false

function markIntroPlayed() {
  introPlayed = true
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1")
  } catch {
    /* 微信/隐私模式可能禁用 storage */
  }
}

function hasIntroPlayed() {
  if (introPlayed) return true
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1"
  } catch {
    return introPlayed
  }
}

export default function IntroFlip() {
  const [done, setDone] = useState(true)

  useEffect(() => {
    if (hasIntroPlayed()) {
      setDone(true)
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    // 手机端跳过全屏翻页入场，避免与原生滚动/地址栏变化叠加造成「反复进入」感
    if (prefersReducedMotion || !shouldUseLenis()) {
      markIntroPlayed()
      setDone(true)
      return
    }

    setDone(false)

    const timer = window.setTimeout(() => {
      markIntroPlayed()
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
