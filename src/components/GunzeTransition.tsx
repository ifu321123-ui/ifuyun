import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { navigate } from "@/hooks/useRoute"
import ProfileSwitcher from "./ProfileSwitcher"
import JunniService from "./junni/JunniService"

const ASSET = "/gunze/"
const MOVIE_TOTAL = 5

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
const FLOOD_END = 0.64
// 盖满后再留一点余量，保证大圆边缘完全滚出视口、不露出弧线缺口
const FLOOD_MARGIN = 1.12
// 文字与圆点放大同步起步：圆点还小时（FLOOD_START 附近）标题与正文就开始淡入上浮，
// 与原站「小圆点阶段文案已浮现」的节奏一致，而非等圆几乎铺满才出现
const MSG_START = 0.34
const MSG_END = 0.68
// 退场段：大圆整体上移，露出「圆底」弧线，下方衔接深色简介区块
// 退场大幅拉长（0.68→1.0，占整段约 32%，是原来 18% 的近两倍），让圆底弧线随滚动慢慢升出、不再「一弹就走」
const EXIT_START = 0.68

const MESSAGE_TITLE = "Message"

gsap.registerPlugin(ScrollTrigger)

const movieSlides = [
  { id: "work01", image: "/works/work01.png", title: "一地人间" },
  { id: "work02", image: "/works/work02.png", title: "食援" },
  { id: "work03", image: "/works/work03.png", title: "蜀香" },
  { id: "work04", image: "/works/work04.png", title: "崖上的希望" },
  { id: "work05", image: "/works/work05.png", title: "武者" },
]

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
      <symbol id="gunze-play" viewBox="0 0 43 50">
        <path d="M41 25 2 47V3l39 22Z" fill="currentColor" />
      </symbol>
      <symbol id="gunze-close" viewBox="0 0 75 75">
        <path d="m18 18 39 39M57 18 18 57" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </symbol>
    </svg>
  )
}

function MovieSection() {
  const [current, setCurrent] = useState(0)
  const [modal, setModal] = useState<string | null>(null)

  const visible = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (current + offset + movieSlides.length) % movieSlides.length
      return { ...movieSlides[index], index, offset }
    })
  }, [current])

  const activeWork = modal ? movieSlides.find((item) => item.id === modal) : null

  return (
    <section className="gunze-movie" id="movie">
      <hgroup className="gunze-title-group">
        <h2 className="gunze-section-title">作品概览</h2>
        <p className="gunze-title-jp">部分设计作品</p>
      </hgroup>

      <div className="gunze-movie-slider" aria-label="130周年纪念视频列表">
        <div className="gunze-movie-track">
          {visible.map((slide) => {
            const isActive = slide.offset === 0
            return (
              <button
                key={`${slide.id}-${slide.offset}`}
                type="button"
                className={`gunze-movie-card is-offset-${slide.offset} ${isActive ? "is-active" : ""}`}
                onClick={() => setModal(slide.id)}
              >
                <img src={slide.image} alt={slide.title} />
                <span className="gunze-movie-caption">{slide.title}</span>
              </button>
            )
          })}
        </div>

        <div className="gunze-movie-controller">
          <button
            type="button"
            className="gunze-arrow-btn is-prev"
            aria-label="上一个视频"
            onClick={() => setCurrent((value) => (value - 1 + MOVIE_TOTAL) % MOVIE_TOTAL)}
          >
            <svg viewBox="0 0 27 26">
              <use href="#gunze-arrow" />
            </svg>
          </button>
          <div className="gunze-progress">
            <span>{String(current + 1).padStart(2, "0")}</span>
            <div className="gunze-progress__bar">
              <div style={{ transform: `scaleX(${(current + 1) / MOVIE_TOTAL})` }} />
            </div>
            <span>{MOVIE_TOTAL}</span>
          </div>
          <button
            type="button"
            className="gunze-arrow-btn is-next"
            aria-label="下一个视频"
            onClick={() => setCurrent((value) => (value + 1) % MOVIE_TOTAL)}
          >
            <svg viewBox="0 0 27 26">
              <use href="#gunze-arrow" />
            </svg>
          </button>
        </div>
      </div>

      <div className="gunze-movie-more">
        <button type="button" className="gunze-more-link" onClick={() => navigate("projects")}>
          查看更多
          <svg viewBox="0 0 27 26">
            <use href="#gunze-arrow" />
          </svg>
        </button>
      </div>

      {modal && activeWork && (
        <div className="gunze-modal" role="dialog" aria-modal="true">
          <button type="button" className="gunze-modal__bg" aria-label="关闭弹窗" onClick={() => setModal(null)} />
          <div className="gunze-modal__body gunze-modal__body--image">
            <img src={activeWork.image} alt={activeWork.title} />
            <button type="button" className="gunze-modal__close" aria-label="关闭弹窗" onClick={() => setModal(null)}>
              <svg viewBox="0 0 75 75">
                <use href="#gunze-close" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function CeoSection() {
  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5)
    const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5)
    event.currentTarget.style.setProperty("--eye-x", `${x * 28}px`)
    event.currentTarget.style.setProperty("--eye-y", `${y * 16}px`)
  }

  const onLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--eye-x", "0px")
    event.currentTarget.style.setProperty("--eye-y", "0px")
  }

  return (
    <section className="gunze-ceo" id="ceo" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="gunze-ceo__inner">
        <hgroup className="gunze-title-group gunze-title-group--ceo">
          <h2 className="gunze-section-title">From CEO</h2>
          <p className="gunze-title-jp">总裁致辞</p>
        </hgroup>

        <div className="gunze-ceo__main">
          <figure className="gunze-ceo__photo">
            <div className="gunze-ceo__photo-main">
              <img className="is-default" src={`${ASSET}ceo-img-2.png`} alt="" />
              <div className="is-hover">
                <img src={`${ASSET}ceo-img-hover-2.png`} alt="" />
                <Eyes className="gunze-eyes--ceo" />
              </div>
            </div>
            <figcaption>
              郡志株式会社社长兼代表董事
              <br />
              佐口俊康
            </figcaption>
          </figure>

          <div className="gunze-ceo__copy">
            <p className="gunze-ceo__catch">难以理解 = 有趣</p>
            <p>
              即使拥有130年的经验，未来依然难以预测。
              <br />
              但“不可预测的未来”本身就充满魅力。
              <br />
              “GUNZE，不可预测”也同样令人着迷。
              <br />
              敬请期待接下来的发展。
            </p>
            <button type="button" className="gunze-btn">
              首席执行官面试
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
    // 退场专用缓动：改用线性匀速。原先 power2.out 是「先快后慢」(ease-out)，
    // 大圆在退场前 1/3 就几乎冲出视口，剩下的 pin 行程全是静止白屏（即「离场后一大段空白」）。
    // 线性匀速让大圆贯穿整个退场区间持续上升、直到接近 progress=1.0 才完全滚出，填满原来的空白尾段，
    // 且匀速上升本身不存在「突然弹走」的急冲感。
    const easeExit = gsap.parseEase("none")

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

      // 退场段：把大圆整体向上推，让它的「圆底」从视口外升入画面再滑出顶部，
      // 露出下方深色场景底色，形成下凸弧形交界（而非矩形直切）
    const exit = easeExit(map(p, EXIT_START, 1, 0, 1))
    const dotRadius = (dotH * dotScale) / 2
    // 行程 = 圆心到顶 + 半径（恰好让圆底滚出视口顶部）+ 极小余量（0.04vh）确保完全清场不留弧线缝。
    // 余量收得很小：余量越大，匀速下大圆越早离场、空白越多；0.04vh 让大圆约在 progress≈0.99 才离场。
    const exitRise = exit * (centerY + dotRadius + vh * 0.04)
      const dotCenterY = p <= REVEAL_END ? qY + offsetToTail : centerY - exitRise

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
      // 退场一开始就撤掉整屏矩形实底，避免它的直边底盖住圆底弧线，改由大圆独自顶住上半屏
      root.style.setProperty("--gunze-flood-alpha", covered && exit <= 0 ? "1" : "0")
      root.style.setProperty("--gunze-scene-dark-alpha", map(p, EXIT_START - 0.04, EXIT_START + 0.08, 0, 1).toFixed(4))
      // 文案在退场弧线成形前就快速淡出，避免白字残留在已露出的深色交界上
      const msgFade = 1 - map(p, EXIT_START - 0.02, EXIT_START + 0.02, 0, 1)
      root.style.setProperty(
        "--gunze-message-alpha",
        (map(p, MSG_START, MSG_START + 0.03, 0, 1) * msgFade).toFixed(4),
      )
      // 行程加大：让最后一段在停留窗口内升到视口中部，而非卡在底边后就淡出
      root.style.setProperty("--gunze-message-y", `${map(p, MSG_START, 1, 58, -110).toFixed(2)}vh`)
      root.style.setProperty("--gunze-mv-alpha", (1 - map(p, 0.08, REVEAL_END, 0, 1)).toFixed(4))
      root.style.setProperty("--gunze-mv-y", `${map(p, 0, REVEAL_END, 0, -120).toFixed(2)}px`)
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
        scrub: 1,
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
      <section ref={stageRef} className="gunze-stage" aria-label="GUNZE 130th transition">
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
                  最开始，
                  <br />
                  我只是喜欢好看的界面。
                </p>
                <p className="gunze-msg-p">
                  后来，
                  <br />
                  我开始关注用户为什么点击，
                  <br />
                  为什么停留，
                  <br />
                  为什么离开。
                </p>
                <p className="gunze-msg-p">
                  于是我走向产品。
                  <br />
                  从关注像素，
                  <br />
                  到关注问题本身。
                </p>
                <p className="gunze-msg-p">
                  而现在，
                  <br />
                  我正在学习如何用AI，
                  <br />
                  创造真正有价值的产品。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JunniService />
      <ProfileSwitcher />
      <MovieSection />
      <CeoSection />
    </>
  )
}
