/** 微信 / QQ 内置浏览器（X5 / TBS 内核）。 */
export function isEmbeddedBrowser() {
  if (typeof navigator === "undefined") return false
  return /MicroMessenger|QQ\//i.test(navigator.userAgent)
}

/** 手机 / 平板 / 微信内置浏览器：一律走静态布局，避免 ScrollTrigger 循环。 */
export function isTouchLikeDevice() {
  if (typeof window === "undefined") return false
  if (isEmbeddedBrowser()) return true
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true
  if (window.matchMedia("(max-width: 768px)").matches && "ontouchstart" in window) return true
  if (navigator.maxTouchPoints > 0 && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return true
  }
  return false
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function shouldUseLenis() {
  if (typeof window === "undefined") return false
  if (prefersReducedMotion()) return false
  if (isTouchLikeDevice()) return false
  return true
}

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

export function setupEmbeddedBrowserLifecycle(clearStaleScrollRestore: () => void) {
  if (typeof window === "undefined") return
  clearStaleScrollRestore()
}
