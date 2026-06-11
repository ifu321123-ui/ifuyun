import { useEffect, type PropsWithChildren } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { useRoute } from "@/hooks/useRoute"

/**
 * 是否开启平滑滚动。遵循系统无障碍偏好：
 * 当用户开启「减少动态效果」时，降级为浏览器原生滚动。
 */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Lenis 阻尼参数 —— JUNNI 那种「高级感」的关键。
 * - lerp：线性插值系数，越小越「重」越顺滑（0.08~0.12 是高质感区间）。
 *   它是产生「阻尼/惯性」手感的核心，优先级高于 duration。
 * - wheelMultiplier / touchMultiplier：滚轮与触控的步进强度。
 * - easing：用于程序化 scrollTo（如锚点跳转）的缓动，expo-out 收尾干净利落。
 */
const lenisOptions = {
  lerp: 0.09,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
}

/** 路由（hash）切换时，将滚动瞬间归零。 */
function LenisScrollReset() {
  const lenis = useLenis()
  const page = useRoute()
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [page, lenis])
  return null
}

/** 减少动态效果时的归零兜底（不依赖 Lenis）。 */
function NativeScrollReset() {
  const page = useRoute()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])
  return null
}

export default function SmoothScroll({ children }: PropsWithChildren) {
  if (prefersReducedMotion) {
    return (
      <>
        <NativeScrollReset />
        {children}
      </>
    )
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisScrollReset />
      {children}
    </ReactLenis>
  )
}
