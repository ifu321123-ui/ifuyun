import { useEffect, useState } from "react"

/**
 * 开场 Loading 覆盖层 —— 复刻 neu-ad.jp 的 loading(simple)：
 * 全屏蓝底 + 白色大标题（自下而上升起）+ 底部进度线（1%→100%），
 * 播完后整层向上滑出退场。
 */
export default function NeuLoading() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setDone(true), 1900)
    const t2 = window.setTimeout(() => setGone(true), 2900)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  if (gone) return null

  return (
    <div className="neu-loading" data-done={done} aria-hidden>
      <div className="neu-loading__inner">
        <p className="neu-loading__title">
          <span>広告に、こだわりと偏愛を</span>
        </p>
        <div className="neu-loading__line">
          <div className="neu-loading__bar" />
        </div>
      </div>
    </div>
  )
}
