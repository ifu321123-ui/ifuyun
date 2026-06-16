import { useEffect, useRef, useState } from "react"
import { junniSolutions, junniServiceTitle, junniServiceSub } from "./junniData"
import "./JunniService.css"

/**
 * junni.co.jp SERVICE / PERFORMANCE 区块复刻。
 * - 标题逐字描边 + transition-delay 入场（IntersectionObserver 触发 .is-in）
 * - 手风琴：点击 + 展开暗色面板（长文 + 图），+ 形变 ×；可多项同时展开（对齐原站逐项 data-open）
 * - 7 条 shift_layer 作为进场竖向擦除（氛围层）
 * 样式自包含（不依赖 .junni-root 变量），可安全嵌入任意页面流。
 */
export default function JunniService() {
  const sectionRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Set<number>>(new Set())

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      el.classList.add("is-in")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) el.classList.add("is-in")
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // —— gooey 圆角方块光标：仅在「可悬停 + 精确指针」设备启用，缓动跟随 —— //
  useEffect(() => {
    const section = sectionRef.current
    const cursor = cursorRef.current
    if (!section || !cursor) return
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return

    section.dataset.cursor = "custom"
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let started = false

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!started) {
        started = true
        cx = tx
        cy = ty
        cursor.dataset.visible = "true"
      }
    }
    const onLeave = () => {
      cursor.dataset.visible = "false"
    }
    const tick = () => {
      cx += (tx - cx) * 0.2
      cy += (ty - cy) * 0.2
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    section.addEventListener("mousemove", onMove)
    section.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener("mousemove", onMove)
      section.removeEventListener("mouseleave", onLeave)
      delete section.dataset.cursor
    }
  }, [])

  const setCursorHover = (on: boolean) => {
    if (cursorRef.current) cursorRef.current.dataset.hover = on ? "true" : "false"
  }

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const renderRowContent = (item: (typeof junniSolutions)[number]) => (
    <span className="junni-service__row-inner">
      <span className="junni-service__num">{item.num}</span>
      <span className="junni-service__block">
        <span className="junni-service__name" translate="no">
          {item.name}
        </span>
        <span className="junni-service__detail">{item.detail}</span>
      </span>
      <span className="junni-service__toggle" aria-hidden="true" />
    </span>
  )

  return (
    <section ref={sectionRef} className="junni-service" aria-label="SERVICE PERFORMANCE">
      {/* gooey 滤镜定义：模糊 + 提升 alpha 对比，使相邻色块融合出液体边缘 */}
      <svg className="junni-service__goo-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="junniGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 自定义圆角方块光标（缓动跟随，悬停行时变实心黄） */}
      <div ref={cursorRef} className="junni-service__cursor" data-visible="false" data-hover="false" aria-hidden="true" />

      <div className="junni-service__head">
        <h2 className="junni-service__title" aria-label={junniServiceTitle}>
          {Array.from(junniServiceTitle).map((ch, i) => (
            <span
              key={i}
              className="junni-service__title-char"
              translate="no"
              style={{ transitionDelay: `${i * 0.03}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h2>
        <p className="junni-service__sub">{junniServiceSub}</p>
      </div>

      <ul className="junni-service__list">
        {junniSolutions.map((item, i) => {
          const isOpen = open.has(i)
          return (
            <li
              key={item.num}
              className="junni-service__item"
              data-open={isOpen}
              style={{ transitionDelay: `${0.06 * i}s` }}
            >
              <button
                type="button"
                className="junni-service__row"
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <span className="junni-service__row-layer" data-hover="before">
                  {renderRowContent(item)}
                </span>
                <span className="junni-service__row-layer" data-hover="after" aria-hidden="true">
                  {renderRowContent(item)}
                </span>
              </button>

              <div className="junni-service__panel">
                <div className="junni-service__panel-inner">
                  <p className="junni-service__text">{item.text}</p>
                  <div className="junni-service__image">
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* 原站 .shift 进场擦除层（氛围层） */}
      <div className="junni-service__shift" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="junni-service__shift-layer" />
        ))}
      </div>
    </section>
  )
}
