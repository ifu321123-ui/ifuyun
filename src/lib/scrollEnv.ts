/** 是否开启 Lenis 平滑滚动（手机/平板用原生滚动，避免 iOS 反复回顶与动画重播）。 */
export function shouldUseLenis() {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return false
  return true
}
