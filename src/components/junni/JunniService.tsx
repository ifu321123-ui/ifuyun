import { useEffect, useRef, useState } from "react"
import { junniSolutions, junniServiceTitle, junniServiceSub } from "./junniData"
import "./JunniService.css"

/**
 * junni.co.jp SERVICE / PERFORMANCE 区块复刻。
 * - 标题逐字描边 + transition-delay 入场（IntersectionObserver 触发 .is-in）
 * - 手风琴：点击 + 展开暗色面板（长文），+ 形变 ×；可多项同时展开（对齐原站逐项 data-open）
 * - 7 条 shift_layer 作为进场竖向擦除（氛围层）
 * 样式自包含（不依赖 .junni-root 变量），可安全嵌入任意页面流。
 */
export default function JunniService() {
  const sectionRef = useRef<HTMLElement>(null)
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

  const toggle = (i: number) => setOpen((prev) => (prev.has(i) ? new Set() : new Set([i])))

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
    <section ref={sectionRef} className="junni-service" data-menu-bg="light" aria-label="SERVICE PERFORMANCE">
      {/* gooey 滤镜：模糊 + 提升 alpha 对比，让相邻黄绿圆球黏连成液体（只作用于液体层） */}
      <svg className="junni-service__goo-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="junniGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

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
              >
                <span className="junni-service__row-layer" data-hover="before">
                  {renderRowContent(item)}
                </span>
                {/* 黄绿液体层：hover 时多颗圆球错峰涨大，经 goo 滤镜黏连成液体铺满整行 */}
                <span className="junni-service__row-goo" aria-hidden="true">
                  {Array.from({ length: 9 }).map((_, b) => (
                    <i key={b} />
                  ))}
                </span>
                <span className="junni-service__row-layer" data-hover="after" aria-hidden="true">
                  {renderRowContent(item)}
                </span>
              </button>

              <div className="junni-service__panel">
                <div className="junni-service__panel-inner">
                  {item.body ? (
                    <div className="junni-service__body">
                      {item.body.groups.map((group) => (
                        <div key={group.subtitle} className="junni-service__group">
                          <div className="junni-service__group-head">
                            <h4 className="junni-service__group-title">{group.subtitle}</h4>
                            {group.period && (
                              <span className="junni-service__group-period">{group.period}</span>
                            )}
                          </div>
                          <ul className="junni-service__points">
                            {group.points.map((point) => (
                              <li key={point.value} className="junni-service__point">
                                {point.label && (
                                  <span className="junni-service__point-label">{point.label}</span>
                                )}
                                <span className="junni-service__point-text">{point.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="junni-service__text">{item.text}</p>
                  )}
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
