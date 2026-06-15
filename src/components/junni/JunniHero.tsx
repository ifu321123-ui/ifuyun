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
const FLIP_END = 0.94
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
 * 满屏 100vw×100vh 的 KV 画面，每格内部各放一份后做负位移裁切拼回整图。
 * front/back 复用同一套拼图坐标：滚动层 rotateX(-180) 与背面预转 rotateX(180) 抵消，
 * 因此背面内容保持正向渲染，不做 scaleY 或行索引倒序补偿。
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

function BackKV() {
  return (
    <div className="junni-kv junni-kv--back">
      <span className="junni-kv__menu junni-kv__menu--back">{junniHero.menu}</span>
      <div className="junni-kv__back-center">
        <p className="junni-kv__back-title">
          <span>ASOBIGOKORO</span>
          <span className="junni-kv__back-cross">×</span>
          <span>TECHNOLOGY</span>
        </p>
        {/* KV 背面副标题（原站 kv_back 主视觉）。注意：这是 KV 自己的文案，
            与 manifesto（わたしたちジュニは…）不同——manifesto 只在下方普通流
            JunniAbout 自然滚动升起、叠在 fixed 网格上滑行。 */}
        <p className="junni-kv__back-lead">
          {junniHero.kvLead.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div className="junni-kv__welcome" aria-hidden="true">
          <span className="junni-kv__welcome-text">Welcome</span>
        </div>
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
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
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
    const wells = cellRefs.current

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
        // 绕 X 轴上下翻面（对齐原站 rotateX(-180deg)）；负角 = 向上翻，180° 终点显现绿底。
        card.style.transform = `rotateX(${(-(local * 180)).toFixed(2)}deg)`
      })

      // 一旦开始滚动翻面，撤掉所有 Hover 翻面，避免与 scroll 翻转角打架。
      if (p > FLIP_START) clearHover()

      // 接近翻完时把 sticky 底色由黑切绿：此刻多数格子已是绿背，
      // 网格细缝随之由黑转绿、与 home_about 无缝衔接，且消除黑底上的绿色缝隙。
      scene.style.background = p >= FLIP_END ? "#cbea41" : "#0a0a0a"

      // 原站翻完后 kv_back 不会立刻消失，而是跟随 pin 释放自然滚出视窗。
      // 因此保留矩阵，避免背面文字在 manifesto 上来前突兀消失。
      matrix.style.display = ""
    }

    if (reducedMotion) {
      // 降级：直接呈现绿底终态，并撤掉重型矩阵。
      matrix.style.display = "none"
      return
    }

    // 逐格 Hover 独立翻面：仅在首屏静止（progress<=FLIP_START）时激活。
    // 解耦：mouseenter/leave 绑在永不旋转的静止底座 .junni-cell（命中靶稳定，杜绝抽搐），
    // 180° 增量则加到对应内层 .junni-card-flip（旋转链已 pointer-events:none 对鼠标隐形）。
    const hoverCleanups = wells.map((well, i) => {
      const flip = flipRefs.current[i]
      if (!well || !flip) return () => {}
      const onEnter = () => {
        if (lastProgress <= FLIP_START) flip.classList.add("is-hovered")
      }
      const onLeave = () => flip.classList.remove("is-hovered")
      well.addEventListener("mouseenter", onEnter)
      well.addEventListener("mouseleave", onLeave)
      return () => {
        well.removeEventListener("mouseenter", onEnter)
        well.removeEventListener("mouseleave", onLeave)
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
                ref={(el) => {
                  cellRefs.current[i] = el
                }}
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
                      <div className="junni-face-fill">
                        <BackKV />
                      </div>
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
