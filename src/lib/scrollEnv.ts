export function isTouchLikeDevice() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches
}

/** 鼠标/触控板桌面（与触屏降级区分；不受 OS「减少动画」影响）。 */
export function isFinePointerDevice() {
  if (typeof window === "undefined") return true
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** 是否开启 Lenis 平滑滚动（手机/平板用原生滚动，避免 iOS 反复回顶与动画重播）。 */
export function shouldUseLenis() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return false
  return true
}

/** 是否启用 ScrollTrigger 滚动 scrub / WebGL 等重型动效（仅触屏设备关闭）。 */
export function shouldUseScrollScrub() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return false
  return true
}

/** 纯装饰性入场（IntroFlip 等）：尊重无障碍，但不影响主滚动动效。 */
export function shouldSkipDecorativeMotion() {
  if (typeof window === "undefined") return false
  if (isTouchLikeDevice()) return true
  return prefersReducedMotion()
}

export function markTouchStaticDocument() {
  if (typeof document === "undefined") return
  if (isTouchLikeDevice()) {
    document.documentElement.classList.add("touch-static")
  }
}
