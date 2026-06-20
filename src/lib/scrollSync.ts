import { ScrollTrigger } from "gsap/ScrollTrigger"

type LenisLike = {
  on: (event: "scroll", handler: () => void) => void
  off: (event: "scroll", handler: () => void) => void
}

/** Lenis 平滑滚动或原生 scroll 时，同步 ScrollTrigger（及可选回调）。 */
export function bindScrollTriggerUpdate(
  lenis: LenisLike | null | undefined,
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
