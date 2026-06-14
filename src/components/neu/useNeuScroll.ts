import { useEffect, useRef, useState } from "react"

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** rAF 节流的窗口滚动值，用于视差计算。 */
export function useWindowScroll() {
  const [y, setY] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setY(window.scrollY)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return y
}

/**
 * 元素进入视口的滚动进度 0→1。
 * start / end 以「视口高度的比例」表示元素顶部所在位置：
 *   progress=0 → 元素顶部位于 start*vh（默认 0.95，刚从底部进入）
 *   progress=1 → 元素顶部位于 end*vh（默认 0.35，已上移到接近上方）
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.95, end = 0.35) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const compute = () => {
      frame.current = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const startY = start * vh
      const endY = end * vh
      const p = (startY - rect.top) / (startY - endY)
      setProgress(clamp01(p))
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [start, end])

  return { ref, progress }
}

/**
 * 「钉住区段」的滚动进度 0→1：在 sticky 阶段内推进。
 * 适合：外层 section 高于视口、内部有 sticky 满屏舞台的场景。
 *   progress=0 → section 顶部对齐视口顶部（开始钉住）
 *   progress=1 → section 底部离开（钉住结束）
 */
export function usePinProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const compute = () => {
      frame.current = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const span = rect.height - vh
      const p = span > 0 ? -rect.top / span : 0
      setProgress(clamp01(p))
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return { ref, progress }
}
