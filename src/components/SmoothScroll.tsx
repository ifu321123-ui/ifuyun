import { useCallback, useEffect, useRef, type PropsWithChildren } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ReactLenis, useLenis } from "lenis/react"
import {
  APP_SCROLL_RESET,
  clearHomeWorksReturn,
  finishHomeWorksReturn,
  peekHomeWorksReturnScroll,
  useRoute,
} from "@/hooks/useRoute"
import { shouldUseLenis } from "@/lib/scrollEnv"

gsap.registerPlugin(ScrollTrigger)

const lenisOptions = {
  lerp: 0.09,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
}

function scrollToTop(lenis?: ReturnType<typeof useLenis>) {
  lenis?.scrollTo(0, { immediate: true })
  lenis?.resize()
  window.scrollTo(0, 0)
}

function restoreHomeWorksScroll(lenis?: ReturnType<typeof useLenis>) {
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

function useScrollToTopOnRoute(lenis?: ReturnType<typeof useLenis>) {
  const route = useRoute()
  const routeKey = route.page
  const prevRouteRef = useRef(routeKey)
  const isFirstMountRef = useRef(true)
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  const reset = useCallback(() => {
    scrollToTop(lenisRef.current)
  }, [])

  useEffect(() => {
    const delay = isTouchLikeDevice() ? 350 : 0
    const id = window.setTimeout(() => {
      scrollToTop(lenisRef.current)
      ScrollTrigger.refresh()
    }, delay)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false
      prevRouteRef.current = routeKey
      return
    }

    const prev = prevRouteRef.current
    prevRouteRef.current = routeKey

    if (prev === "portfolio" && routeKey !== "home") {
      clearHomeWorksReturn()
    }

    if (routeKey === "home" && prev === "portfolio" && peekHomeWorksReturnScroll() != null) {
      return restoreHomeWorksScroll(lenisRef.current)
    }

    reset()
    const id = requestAnimationFrame(reset)
    return () => cancelAnimationFrame(id)
  }, [routeKey, reset])

  useEffect(() => {
    const onReset = () => {
      reset()
      requestAnimationFrame(reset)
    }
    window.addEventListener(APP_SCROLL_RESET, onReset)
    return () => window.removeEventListener(APP_SCROLL_RESET, onReset)
  }, [reset])
}

function LenisScrollReset() {
  const lenis = useLenis()
  useScrollToTopOnRoute(lenis)
  return null
}

function NativeScrollReset() {
  useScrollToTopOnRoute()
  return null
}

export default function SmoothScroll({ children }: PropsWithChildren) {
  const useLenisScroll = shouldUseLenis()

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
