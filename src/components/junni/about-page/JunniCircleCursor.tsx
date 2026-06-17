import { useEffect, useState } from "react"

type CursorVariant = "scroll_down_front" | "scroll_down_back"

interface JunniCircleCursorProps {
  variant?: CursorVariant
}

const SCROLL_TEXT = "SCROLL DOWN・SCROLL DOWN・MORE DETAIL・MORE DETAIL・"

export default function JunniCircleCursor({ variant = "scroll_down_front" }: JunniCircleCursorProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(y < max - 120)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isDark = variant === "scroll_down_front"

  return (
    <div
      className="jap__circle-cursor"
      data-type={variant}
      data-active={visible}
      aria-hidden="true"
    >
      <div className="jap__circle-cursor-inner">
        <svg viewBox="0 0 108 108">
          <defs>
            <path
              id="jap-circle-path"
              d="M 54,54 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            />
          </defs>
          <text className="jap__circle-cursor-text">
            <textPath href="#jap-circle-path" startOffset="0%">
              {SCROLL_TEXT}
            </textPath>
          </text>
          <circle
            cx="54"
            cy="54"
            r="3"
            className="jap__circle-cursor-dot"
            fill={isDark ? "#dcff46" : "#111"}
          />
        </svg>
      </div>
    </div>
  )
}
