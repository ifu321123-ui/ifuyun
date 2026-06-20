import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { navigate } from "@/hooks/useRoute"
import { shouldUseScrollScrub } from "@/lib/scrollEnv"
import JunniService from "./junni/JunniService"
import JunniWorks from "./junni/JunniWorks"

const ASSET = "/gunze/"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function map(p: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

const SVG_RATIO = 1440 / 1316
const HOOK_VH = 1.25
const DOT_WIDTH_RATIO = 0.175
const DOT_ASPECT = 1.424
const TIP_Y_RATIO = 0.998
const TIP_X_RATIO = 0.492
const GAP_RATIO = 0.05

// 问号上升段压缩：从 0.46 收到 0.34，把省下的进度让给退场，避免退场区间过短导致「一弹就走」
const REVEAL_END = 0.34
// 圆点放大段：从自然尺寸一路长到盖满视口
// 区间 0.34→0.64（约占整段 30%，宽度基本不变，放大速度不受影响），用较长滚动距离慢慢长大
const FLOOD_START = 0.34
const FLOOD_END = 0.58
// 盖满后再留一点余量，保证大圆边缘完全滚出视口、不露出弧线缺口
const FLOOD_MARGIN = 1.12
// 文字与圆点放大同步起步：圆点还小时（FLOOD_START 附近）标题与正文就开始淡入上浮，
// 与原站「小圆点阶段文案已浮现」的节奏一致，而非等圆几乎铺满才出现
const MSG_START = 0.34
// 文案在圆点铺满前后完成显现；pin 末段只留短停留，避免「动画已结束还在空滚」的卡顿感。
const MSG_END = 0.72

const MESSAGE_TITLE = "Message"

gsap.registerPlugin(ScrollTrigger)

function Eyes({ className = "" }: { className?: string }) {
  return (
    <div className={`gunze-eyes ${className}`} aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="gunze-eye">
          <img className="gunze-eye__base" src={`${ASSET}eye-base-border.svg`} alt="" />
          <img className="gunze-eye__white" src={`${ASSET}eye-shirome.svg`} alt="" />
          <img className="gunze-eye__blink" src={`${ASSET}eye-mabataki.svg`} alt="" />
          <div className="gunze-eye__pupil">
            <img className="gunze-eye__circle" src={`${ASSET}eye-base-circle.svg`} alt="" />
            <img className="gunze-eye__star" src={`${ASSET}eye-star.svg`} alt="" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SvgSprite() {
  return (
    <svg className="gunze-sprite" aria-hidden>
      <symbol id="gunze-arrow" viewBox="0 0 27 26">
        <path d="M3 13h19M14 5l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
    </svg>
  )
}

function CeoSection() {
  return (
    <section className="gunze-ceo" id="ceo">
      <div className="gunze-ceo__inner">
        <hgroup className="gunze-title-group gunze-title-group--ceo">
          <h2 className="gunze-section-title">From Me</h2>
          <p className="gunze-title-jp">写在最后</p>
        </hgroup>

        <div className="gunze-ceo__main">
          <figure className="gunze-ceo__photo">
            <div className="gunze-ceo__photo-main">
              <img className="is-default" src={`${ASSET}ceo-img-hover-2.png`} alt="" />
              <div className="is-hover">
                <img src={`${ASSET}ceo-img-2.png`} alt="付云椒" />
              </div>
            </div>
            <figcaption>
              产品经理 · UX 设计
              <br />
              付云椒
            </figcaption>
          </figure>

          <div className="gunze-ceo__copy">
            <p className="gunze-ceo__catch">见问题而定，向价值而行</p>
            <p>
              若要为这一路留一句寓意——
              <br />
              产品思维，是在纷繁里拎出主线，在假设里找到证据。
              <br />
              把该做的题定义清楚，把不必做的路主动关掉。
              <br />
              每一次取舍，都指向同一件事：让价值更早、更准地抵达。
            </p>
            <button type="button" className="gunze-btn" onClick={() => navigate("contact")}>
              联系我
              <svg viewBox="0 0 27 26">
                <use href="#gunze-arrow" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function GunzeTransition() {
  const stageRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const root = document.documentElement
    const letters = Array.from(stage.querySelectorAll<HTMLElement>(".gunze-letter"))
    const paragraphs = Array.from(stage.querySelectorAll<HTMLElement>(".gunze-msg-p"))

    const easeBack = gsap.parseEase("back.out(1.7)")
    const easeFade = gsap.parseEase("power2.out")
    // 放大末段减速：用 power1.out。线性缩放时铺满速度随面积(scale²)越来越快、收尾发急；
    // ease-out 让缩放在接近铺满时减速，抵消面积加速，收尾更从容
    const easeFlood = gsap.parseEase("power1.out")

    const stagger = (
      els: HTMLElement[],
      reveal: number,
      win: number,
      base: number,
      gap: number,
      shift: number,
      ease?: (value: number) => number,
    ) => {
      els.forEach((el, i) => {
        const local = clamp((reveal - base - i * gap) / win, 0, 1)
        const moved = ease ? ease(local) : local
        el.style.opacity = local.toFixed(3)
        el.style.transform = `translate3d(0, ${((1 - moved) * shift).toFixed(2)}px, 0)`
      })
    }

    const apply = (progress: number) => {
      const p = clamp(progress, 0, 1)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const centerX = vw * 0.5
      const centerY = vh * 0.5

      const hookH = vh * HOOK_VH
      const hookW = hookH * SVG_RATIO
      const dotW = hookW * DOT_WIDTH_RATIO
      const dotH = dotW / DOT_ASPECT
      const offsetToTail = hookH * TIP_Y_RATIO + hookH * GAP_RATIO + dotH / 2
      const tailX = centerX + hookW * (TIP_X_RATIO - 0.5)

      const qY0 = 0
      const qYatCenter = centerY - offsetToTail
      const qYend = -(hookH + vh * 0.35)
      const qY = p <= REVEAL_END
        ? lerp(qY0, qYatCenter, map(p, 0, REVEAL_END, 0, 1))
        : lerp(qYatCenter, qYend, map(p, REVEAL_END, 1, 0, 1))

      // 单个圆点持续放大铺底：动态算出「短轴直径 ≥ 视口对角线」所需的倍数，
      // 这样它自身就能盖满整屏，无需再叠一层矩形淡入来补色
      const diag = Math.hypot(vw, vh)
      const coverScale = (diag / dotH) * FLOOD_MARGIN
      const flood = easeFlood(map(p, FLOOD_START, FLOOD_END, 0, 1))
      const dotScale = 1 + flood * (coverScale - 1)
      // 抗锯齿根治：圆点改用 radial-gradient 实时绘制（见 .gunze-message-dot），
      // 浏览器按当前像素分辨率重绘渐变，边缘恒为矢量级清晰，彻底告别 transform:scale 的位图重采样糊边。
      // rx/ry 为椭圆半轴，随 dotScale 增长，几何量与原先 dotH*dotScale 完全一致。
      const dotRx = (dotW * dotScale) / 2
      // 圆已经完全盖住视口后，才把同色实底瞬切到位垫在圆背后（消除亚像素缝隙），
      // 在此之前保持透明，让放大过程纯粹由「圆的边缘弧线」推进
      const covered = dotScale * dotH >= diag

      // 圆点铺满后固定在视口中心，后续不再单独上移退场。
      // 离场由 sticky 释放后整个 .gunze-scene 随自然滚动移走，文字和绿色背景保持同一个坐标系。
      const dotRadius = (dotH * dotScale) / 2
      const dotCenterY = p <= REVEAL_END ? qY + offsetToTail : centerY

      const msg = map(p, MSG_START, MSG_END, 0, 1)
      stagger(letters, msg, 0.3, 0, 0.05, 70, easeBack)
      // 段落整体提前、间隔收紧，确保第 4 段在退场前就能完全显现
      stagger(paragraphs, msg, 0.3, 0.08, 0.05, 36, easeFade)

      root.style.setProperty("--gunze-q-height", `${hookH.toFixed(1)}px`)
      root.style.setProperty("--gunze-q-y", `${qY.toFixed(2)}px`)
      root.style.setProperty("--gunze-body-opacity", (1 - map(p, REVEAL_END, FLOOD_END, 0, 1)).toFixed(4))
      // 放大阶段把圆心收到视口正中，确保盖满时四角无残留
      const dotLeft = p <= REVEAL_END ? tailX : centerX
      root.style.setProperty("--gunze-dot-left", `${dotLeft.toFixed(2)}px`)
      root.style.setProperty("--gunze-dot-top", `${dotCenterY.toFixed(2)}px`)
      root.style.setProperty("--gunze-dot-rx", `${dotRx.toFixed(2)}px`)
      root.style.setProperty("--gunze-dot-ry", `${dotRadius.toFixed(2)}px`)
      // 铺满后保留同色实底，作为静止绿色背景；渐变圆点层关闭以减轻滚动重绘。
      root.style.setProperty("--gunze-flood-alpha", covered ? "1" : "0")
      root.style.setProperty("--gunze-dot-alpha", covered ? "0" : "1")
      root.style.setProperty("--gunze-scene-dark-alpha", "0")
      root.style.setProperty(
        "--gunze-message-alpha",
        map(p, MSG_START, MSG_START + 0.03, 0, 1).toFixed(4),
      )
      // 文案容器由 flex 垂直居中，不再用 translateY 偏移。
      root.style.setProperty("--gunze-message-y", "0vh")
      root.style.setProperty("--gunze-mv-alpha", (1 - map(p, 0.08, REVEAL_END, 0, 1)).toFixed(4))
      root.style.setProperty("--gunze-mv-y", `${map(p, 0, REVEAL_END, 0, -120).toFixed(2)}px`)
    }

    const staticLayout = !shouldUseScrollScrub()

    if (staticLayout) {
      apply(0.72)
      stage.dataset.touchStatic = "true"
      return () => {
        delete stage.dataset.touchStatic
        for (const name of [
          "--gunze-q-height",
          "--gunze-q-y",
          "--gunze-body-opacity",
          "--gunze-dot-left",
          "--gunze-dot-top",
          "--gunze-dot-rx",
          "--gunze-dot-ry",
          "--gunze-flood-alpha",
          "--gunze-dot-alpha",
          "--gunze-scene-dark-alpha",
          "--gunze-message-alpha",
          "--gunze-message-y",
          "--gunze-mv-alpha",
          "--gunze-mv-y",
        ]) {
          root.style.removeProperty(name)
        }
      }
    }

    const state = { progress: 0 }
    const tween = gsap.to(state, {
      progress: 1,
      ease: "none",
      onUpdate: () => apply(state.progress),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(self.progress),
      },
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    lenis?.on("scroll", updateScrollTrigger)

    apply(0)
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", updateScrollTrigger)
      tween.scrollTrigger?.kill()
      tween.kill()
      for (const name of [
        "--gunze-q-height",
        "--gunze-q-y",
        "--gunze-body-opacity",
        "--gunze-dot-left",
        "--gunze-dot-top",
        "--gunze-dot-rx",
        "--gunze-dot-ry",
        "--gunze-flood-alpha",
        "--gunze-dot-alpha",
        "--gunze-scene-dark-alpha",
        "--gunze-message-alpha",
        "--gunze-message-y",
        "--gunze-mv-alpha",
        "--gunze-mv-y",
      ]) {
        root.style.removeProperty(name)
      }
    }
  }, [lenis])

  return (
    <>
      <SvgSprite />
      <section ref={stageRef} className="gunze-stage" data-menu-bg="light" aria-label="GUNZE 130th transition">
        <div className="gunze-scene">
          <div className="gunze-question-layer">
            <img
              src={`${ASSET}mv-question-body.svg`}
              className="gunze-question-body"
              alt=""
              width={1440}
              height={1316}
              loading="eager"
              decoding="async"
            />
            <Eyes className="gunze-eyes--mv" />
          </div>

          <div className="gunze-message-bg" aria-hidden>
            <div className="gunze-message-fill" />
            <div className="gunze-message-dot" />
          </div>

          <div className="gunze-message-preview">
            <div className="gunze-message-inner gunze-message-preview__inner">
              <h2 className="gunze-section-title gunze-message-title" aria-label={MESSAGE_TITLE}>
                {MESSAGE_TITLE.split("").map((char, index) => (
                  <span key={index} className="gunze-letter" style={{ "--ls-index": index } as React.CSSProperties} aria-hidden>
                    {char}
                  </span>
                ))}
              </h2>
              <div className="gunze-message-text">
                <p className="gunze-msg-p">
                  我的故事始于设计。
                  <br />
                  那时满脑子都是被色值和构图塞满的粗糙念头，
                  <br />
                  100% 是视觉冲动——
                  <br />
                  我只想把东西做得足够好看。
                </p>
                <p className="gunze-msg-p">
                  后来我才明白，
                  <br />
                  界面不只是好看的表皮——
                  <br />
                  它是与用户之间一场无声的共情对话。
                  <br />
                  我开始追问：他们为什么点击，
                  <br />
                  为什么停留，
                  <br />
                  又为什么悄然离开。
                </p>
                <p className="gunze-msg-p">
                  于是我走向产品。
                  <br />
                  我迫使自己摘下「只看界面」的滤镜，
                  <br />
                  用研究去定义真正的问题——
                  <br />
                  从雕琢每一个像素，
                  <br />
                  到驯服那些抽象却真实的痛点。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JunniService />
      <JunniWorks />
      <CeoSection />
    </>
  )
}
