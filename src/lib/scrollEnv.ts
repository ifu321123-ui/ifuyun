export function isTouchLikeDevice() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** 是否开启 Lenis 平滑滚动（手机/平板用原生滚动，避免 iOS 反复回顶与动画重播）。 */
export function shouldUseLenis() {
  if (typeof window === "undefined") return false
  if (prefersReducedMotion()) return false
  if (isTouchLikeDevice()) return false
  return true
}

/** 是否启用 ScrollTrigger 滚动 scrub / WebGL 等重型动效（手机端关闭）。 */
export function shouldUseScrollScrub() {
  if (typeof window === "undefined") return false
  if (prefersReducedMotion()) return false
  if (isTouchLikeDevice()) return false
  return true
}

export function markTouchStaticDocument() {
  if (typeof document === "undefined") return
  if (isTouchLikeDevice()) {
    document.documentElement.classList.add("touch-static")
  }
}
