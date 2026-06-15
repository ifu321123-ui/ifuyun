import { useEffect, useMemo, useRef, type CSSProperties } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import {
  JUNNI_GRID_COLS,
  JUNNI_GRID_ROWS,
  JUNNI_GRID_COUNT,
  JUNNI_STAGE_VH,
  junniHero,
} from "./junniData"

gsap.registerPlugin(ScrollTrigger)

const COLS = JUNNI_GRID_COLS
const ROWS = JUNNI_GRID_ROWS

// from-center 扩散参数：翻面在 flipStart→flipEnd 区间内完成，
// 每格按到中心的欧几里得距离追加 0~spread 的延迟权重。
const FLIP_START = 0.06
const FLIP_END = 0.82
// 距离权重最大附加延迟：调大→中心与四角时间差更大、同心波浪更明显。
const FLIP_SPREAD = 0.6

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function map(p: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

/**
 * 满屏 100vw×100vh 的正面 KV 画面（黑底白字），每格内部各放一份后做负位移裁切拼回整图。
 * 背面是纯荧光绿实底：因 rotateY(180) 会把内容逐格镜像，平铺纯色才能无缝拼回，故背面不放文案。
 */
function HeroKV() {
  return (
    <div className="junni-kv junni-kv--front">
      <span className="junni-kv__menu">{junniHero.menu}</span>
      <span className="junni-kv__scroll">{junniHero.marquee}</span>
      <div className="junni-kv__center">
        <h1 className="junni-kv__logo">{junniHero.logo}</h1>
        <p className="junni-kv__tagline">{junniHero.tagline}</p>
      </div>
    </div>
  )
}

interface JunniHeroProps {
  onInZoneChange?: (inJunniZone: boolean) => void
}

export default function JunniHero({ onInZoneChange }: JunniHeroProps) {
  const stageRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const flipRefs = useRef<(HTMLDivElement | null)[]>([])
  const lenis = useLenis()

  // 每格到网格中心的归一化距离（0~1），用作翻面延迟权重。
  const cells = useMemo(
    () =>
      Array.from({ length: JUNNI_GRID_COUNT }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const cx = (COLS - 1) / 2
        const cy = (ROWS - 1) / 2
        const maxDist = Math.hypot(cx, cy) || 1
        const dist = Math.hypot(col - cx, row - cy) / maxDist
        return { col, row, dist }
      }),
    [],
  )

  useEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    const matrix = matrixRef.current
    const grid = gridRef.current
    if (!stage || !scene || !matrix || !grid) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const flips = flipRefs.current.filter(Boolean) as HTMLDivElement[]

    let lastProgress = 0

    const clearHover = () => {
      flips.forEach((el) => el.classList.remove("is-hovered"))
    }

    const apply = (progress: number) => {
      const p = clamp(progress, 0, 1)
      lastProgress = p

      cards.forEach((card, i) => {
        const dist = cells[i]?.dist ?? 0
        const local = map(p, FLIP_START + dist * FLIP_SPREAD, FLIP_END, 0, 1)
        card.style.transform = `rotateY(${(local * 180).toFixed(2)}deg)`
      })

      // 一旦开始滚动翻面，撤掉所有 Hover 翻面，避免与 scroll 翻转角打架。
      if (p > FLIP_START) clearHover()

      // 接近翻完时把 sticky 底色由黑切绿：此刻多数格子已是绿背，
      // 网格细缝随之由黑转绿、与 home_about 无缝衔接，且消除黑底上的绿色缝隙。
      scene.style.background = p >= FLIP_END ? "#cbea41" : "#0a0a0a"

      // 翻完并滚出 sticky 视口后，销毁 72 个满屏图层的渲染开销。
      matrix.style.display = p >= 0.999 ? "none" : ""
    }

    if (reducedMotion) {
      // 降级：直接呈现绿底终态，并撤掉重型矩阵。
      matrix.style.display = "none"
      return
    }

    // 逐格 Hover 独立翻面：仅在首屏静止（progress<=FLIP_START）时激活；
    // 180° 增量挂在 .junni-card-flip 上，由 CSS transition 平滑完成，与 scroll 翻转层互不干扰。
    const hoverCleanups = flips.map((el) => {
      const onEnter = () => {
        if (lastProgress <= FLIP_START) el.classList.add("is-hovered")
      }
      const onLeave = () => el.classList.remove("is-hovered")
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
      return () => {
        el.removeEventListener("mouseenter", onEnter)
        el.removeEventListener("mouseleave", onLeave)
      }
    })

    const state = { progress: 0 }
    const tween = gsap.to(state, {
      progress: 1,
      ease: "none",
      onUpdate: () => apply(state.progress),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(self.progress),
      },
    })

    const root = stage.closest(".junni-root") as HTMLElement | null
    const updateNavZone = () => {
      if (!root) return
      const rect = root.getBoundingClientRect()
      // junni 体验（黑→绿）尚未滚走时隐藏全局导航。
      const inZone = rect.bottom > window.innerHeight * 0.6
      onInZoneChange?.(inZone)
    }

    const onScroll = () => {
      ScrollTrigger.update()
      updateNavZone()
    }
    lenis?.on("scroll", onScroll)

    apply(0)
    updateNavZone()
    ScrollTrigger.refresh()

    return () => {
      hoverCleanups.forEach((fn) => fn())
      lenis?.off("scroll", onScroll)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [lenis, onInZoneChange, cells])

  return (
    <section
      ref={stageRef}
      className="junni-hero-stage"
      style={{ "--junni-stage-vh": JUNNI_STAGE_VH } as CSSProperties}
      aria-label="JUNNI Hero"
    >
      <div ref={sceneRef} className="junni-hero-scene">
        <div ref={matrixRef} className="junni-grid-perspective">
          <div ref={gridRef} className="junni-grid">
            {cells.map((cell, i) => (
              <div
                key={i}
                className="junni-cell"
                style={
                  {
                    "--col": cell.col,
                    "--row": cell.row,
                  } as CSSProperties
                }
              >
                <div
                  className="junni-card"
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                >
                  <div
                    className="junni-card-flip"
                    ref={(el) => {
                      flipRefs.current[i] = el
                    }}
                  >
                    <div className="junni-face junni-face--front">
                      <div className="junni-face-fill">
                        <HeroKV />
                      </div>
                    </div>
                    <div className="junni-face junni-face--back">
                      <div className="junni-face-fill" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
