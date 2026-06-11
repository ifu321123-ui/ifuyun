import type { ElementType, Ref } from "react"
import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

interface SplitTextProps {
  /** 要出场的文本内容 */
  text: string
  /** 拆分粒度：逐字（char）或逐词（word，按空白切分） */
  by?: "char" | "word"
  /** 渲染的标签，默认 span；标题可传 "h1" / "h2" 保留语义 */
  as?: ElementType
  /** 作用在外层容器上的样式（字号、字重、颜色等） */
  className?: string
  /** 每个单元之间的步进延迟（ms），越大越「逐个浮现」 */
  stagger?: number
  /** 整体起始延迟（ms） */
  delay?: number
  /** 单个单元的动画时长（ms） */
  duration?: number
}

/**
 * 文字渐显与位移出场动画（Split Text）。
 * 滚动进入视口时，文字按单元「从下往上浮现 + 渐变显示」，
 * 通过 transition-delay 形成逐字/逐词的错峰节奏（JUNNI 高频动效）。
 *
 * 无障碍：容器带 aria-label 朗读完整文本，各单元 aria-hidden。
 */
export default function SplitText({
  text,
  by = "char",
  as: Tag = "span",
  className,
  stagger = 40,
  delay = 0,
  duration = 800,
}: SplitTextProps) {
  const { ref, inView } = useInView<HTMLElement>(0.2)

  // word 模式保留空白作为单独 token，避免单词粘连
  const tokens = by === "word" ? text.split(/(\s+)/) : Array.from(text)
  let animatedIndex = -1

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className} aria-label={text}>
      {tokens.map((token, i) => {
        const isSpace = /^\s+$/.test(token) || token === " "
        if (isSpace) {
          return (
            <span key={i} aria-hidden="true">
              {by === "word" ? token : "\u00A0"}
            </span>
          )
        }

        animatedIndex += 1
        const unitDelay = delay + animatedIndex * stagger

        return (
          <span key={i} aria-hidden="true" className="inline-block">
            <span
              className={cn(
                "inline-block will-change-transform",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[0.65em] opacity-0",
              )}
              style={{
                transitionProperty: "transform, opacity",
                transitionTimingFunction: "var(--ease-out-expo)",
                transitionDuration: `${duration}ms`,
                transitionDelay: inView ? `${unitDelay}ms` : "0ms",
              }}
            >
              {token}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
