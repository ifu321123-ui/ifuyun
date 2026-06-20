export function isTouchLikeDevice() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** 手机/平板用原生滚动，避免 Lenis 与 iOS 地址栏冲突导致反复回顶。 */
export function shouldUseLenis() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return false
  return true
}

/** 全平台保留 ScrollTrigger 滚动驱动动效。 */
export function shouldUseScrollScrub() {
  if (typeof window === "undefined") return false
  return true
}

/** 纯装饰性全屏入场：手机与「减少动效」用户跳过。 */
export function shouldSkipDecorativeMotion() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return true
  return prefersReducedMotion()
}

/** iOS 上 WebGL 易 OOM 白屏；触屏用 DOM 圆筒 + ScrollTrigger，桌面保留 WebGL。 */
export function shouldUseWebGL() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return false
  return true
}

export function markTouchStaticDocument() {
  if (typeof document === "undefined") return
  if (isTouchLikeDevice()) {
    document.documentElement.classList.add("touch-static")
  }
}

/**
 * iOS Safari 滚动时地址栏伸缩会频繁触发 resize（仅高度变化）。
 * 此时 ScrollTrigger.refresh() 会重算 sticky/scrub 区间，滚动进度跳变，表现为动画反复从头播放。
 * 触屏仅在横竖屏切换或明显宽度变化时 refresh；桌面保持常规 resize 防抖。
 */
export function installScrollTriggerResizeSync(refresh: () => void) {
  if (typeof window === "undefined") return

  let timer = 0
  const debounceMs = isTouchLikeDevice() ? 400 : 250
  let lastWidth = window.innerWidth

  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(refresh, debounceMs)
  }

  if (isTouchLikeDevice()) {
    window.addEventListener("orientationchange", schedule, { passive: true })
    window.addEventListener(
      "resize",
      () => {
        const width = window.innerWidth
        if (Math.abs(width - lastWidth) < 48) return
        lastWidth = width
        schedule()
      },
      { passive: true },
    )
    return
  }

  window.addEventListener("resize", schedule, { passive: true })
}
