import { useMemo } from "react"
import { usePinProgress } from "./useNeuScroll"

const COLS = 7
const ROWS = 5

type Block = {
  left: number // vw
  top: number // vh
  w: number // vw
  h: number // vh
  delay: number // 0→1 出现阈值
  dur: number // 出现窗口长度
  radius: number // 圆角 px
  rise: number // 起始下沉距离 vh（从视口下方升起）
}

/**
 * Hero → 蓝色区段之间的「升起方块」转场（复刻 neu-ad.jp）。
 *
 * 外层 section 高于视口，内部 sticky 满屏舞台铺一组大小不一的蓝色圆角方块。
 * 这些方块初始全部沉在视口下方，随滚动进度按「下排先、上排后」的节奏，
 * 以各自不同的速度（视差）从底部升入视口，最终拼满整屏蓝色，
 * 自然衔接到下方的蓝色 About 区段。
 */
export default function NeuTransition() {
  const { ref, progress } = usePinProgress<HTMLDivElement>()

  const blocks = useMemo<Block[]>(() => {
    // 确定性伪随机（线性同余），保证刷新后布局/节奏一致。
    let seed = 20240607
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }

    const cellW = 100 / COLS
    const cellH = 100 / ROWS
    const overlap = 1.4 // 轻微外扩，铺满时无缝
    const occupied = new Array<boolean>(COLS * ROWS).fill(false)
    const out: Block[] = []

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (occupied[r * COLS + c]) continue

        // 随机合并相邻格子，制造大小不一的方块（有宽块、有高块）。
        let spanC = 1
        let spanR = 1
        if (rnd() < 0.28 && c + 1 < COLS && !occupied[r * COLS + c + 1]) spanC = 2
        if (spanC === 1 && rnd() < 0.24 && r + 1 < ROWS && !occupied[(r + 1) * COLS + c]) spanR = 2

        for (let dr = 0; dr < spanR; dr++) {
          for (let dc = 0; dc < spanC; dc++) {
            occupied[(r + dr) * COLS + (c + dc)] = true
          }
        }

        const left = c * cellW - overlap
        const top = r * cellH - overlap
        const w = cellW * spanC + overlap * 2
        const h = cellH * spanR + overlap * 2

        // 越靠下的行越早出现（base 越小）；同行加抖动避免一条线整齐落位。
        const base = r / ROWS // 顶行 base 最大→最晚
        const jitter = rnd() * 0.16
        const delay = (1 - base) * 0 + base * 0.55 + jitter
        const dur = 0.24 + rnd() * 0.14
        const radius = 12 + rnd() * 12
        // 起始位置沉到视口下方：顶部的块要走更远，底部的块走更近 → 视差错落。
        const rise = 100 - top + 12 + rnd() * 14

        out.push({ left, top, w, h, delay, dur, radius, rise })
      }
    }
    return out
  }, [])

  // 收尾时升起一层纯蓝底，封住圆角缝隙，确保最终整屏纯蓝。
  const fill = Math.min(1, Math.max(0, (progress - 0.88) / 0.12))

  return (
    <div className="neu-transition" ref={ref} aria-hidden>
      <div className="neu-transition__stage">
        <div className="neu-transition__fill" style={{ opacity: fill }} />
        {blocks.map((b, i) => {
          const reveal = Math.min(1, Math.max(0, (progress - b.delay) / b.dur))
          return (
            <span
              key={i}
              className="neu-transition__block"
              style={{
                // 以「舞台」为基准用百分比定位：独立整页时舞台即满屏（% == vw/vh），
                // 内嵌缩放时也能始终铺满舞台，避免出血宽度不足。
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                borderRadius: `${b.radius}px`,
                transform: `translateY(${(1 - reveal) * b.rise}vh)`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
