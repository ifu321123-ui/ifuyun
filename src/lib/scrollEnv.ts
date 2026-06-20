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
