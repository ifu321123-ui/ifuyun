import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Lenis } from "lenis"

/** Lenis 平滑滚动或原生 scroll 时，同步 ScrollTrigger（及可选回调）。 */
export function bindScrollTriggerUpdate(
  lenis: Lenis | null | undefined,
  onScroll?: () => void,
) {
  const handler = () => {
    ScrollTrigger.update()
    onScroll?.()
  }

  if (lenis) {
    lenis.on("scroll", handler)
    return () => lenis.off("scroll", handler)
  }

  window.addEventListener("scroll", handler, { passive: true })
  return () => window.removeEventListener("scroll", handler)
}
