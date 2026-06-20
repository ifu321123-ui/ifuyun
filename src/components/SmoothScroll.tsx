import { useCallback, useEffect, useRef, type PropsWithChildren } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ReactLenis, useLenis, type Lenis } from "lenis/react"
import {
  APP_SCROLL_RESET,
  clearHomeWorksReturn,
  finishHomeWorksReturn,
  peekHomeWorksReturnScroll,
  useRoute,
} from "@/hooks/useRoute"
import { shouldUseLenis } from "@/lib/scrollEnv"

gsap.registerPlugin(ScrollTrigger)

const useLenisScroll = shouldUseLenis()

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

function scrollToTop(lenis?: Lenis | null) {
  lenis?.scrollTo(0, { immediate: true })
  lenis?.resize()
  window.scrollTo(0, 0)
}

/** 从作品集返回首页 WORKS：先 resize 更新 limit，再恢复 Lenis 滚动，避免与原生 scroll 脱节。 */
function restoreHomeWorksScroll(lenis?: Lenis | null) {
  const y = peekHomeWorksReturnScroll()
  if (y == null) return () => {}

  const apply = () => {
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(y, { immediate: true, force: true })
    } else {
      window.scrollTo(0, y)
    }
    ScrollTrigger.update()
  }

  apply()
  const raf = requestAnimationFrame(apply)
  const timer = window.setTimeout(() => {
    apply()
    ScrollTrigger.refresh()
    finishHomeWorksReturn()
  }, 150)

  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(timer)
  }
}

function useScrollToTopOnRoute(lenis?: Lenis | null) {
  const route = useRoute()
  const routeKey = route.page
  const prevRouteRef = useRef(routeKey)
  const isFirstMountRef = useRef(true)

  const reset = useCallback(() => {
    scrollToTop(lenis)
  }, [lenis])

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false
      prevRouteRef.current = routeKey
      const id = requestAnimationFrame(() => {
        scrollToTop(lenis)
        ScrollTrigger.refresh()
      })
      return () => cancelAnimationFrame(id)
    }

    const prev = prevRouteRef.current
    prevRouteRef.current = routeKey

    if (prev === "portfolio" && routeKey !== "home") {
      clearHomeWorksReturn()
    }

    if (routeKey === "home" && prev === "portfolio" && peekHomeWorksReturnScroll() != null) {
      return restoreHomeWorksScroll(lenis)
    }

    reset()
    const id = requestAnimationFrame(reset)
    return () => cancelAnimationFrame(id)
  }, [routeKey, reset, lenis])

  useEffect(() => {
    const onReset = () => {
      reset()
      requestAnimationFrame(reset)
    }
    window.addEventListener(APP_SCROLL_RESET, onReset)
    return () => window.removeEventListener(APP_SCROLL_RESET, onReset)
  }, [reset])
}

/** 路由（hash）切换或同页导航时，将滚动瞬间归零。 */
function LenisScrollReset() {
  const lenis = useLenis()
  useScrollToTopOnRoute(lenis)
  return null
}

/** 减少动态效果时的归零兜底（不依赖 Lenis）。 */
function NativeScrollReset() {
  useScrollToTopOnRoute()
  return null
}

export default function SmoothScroll({ children }: PropsWithChildren) {
  if (!useLenisScroll) {
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
