import { useRef } from "react"
import NeuTransition from "./NeuTransition"
import NeuAbout from "./NeuAbout"
import NeuPixel from "./NeuPixel"
import NeuService from "./NeuService"
import "./neu.css"

/**
 * Neu 复刻页的「内嵌版」：作为本站某个页面里的真实区块直接渲染，
 * 与宿主页面共用滚动，因此去掉了独立整页才需要的开场 Loading 与固定导航，
 * 视觉与版式保持 1:1（缩放还原由 .neu-embed 处理）。
 */
export default function NeuEmbed() {
  const root = useRef<HTMLDivElement>(null)

  return (
    <div className="neu-root neu-embed" ref={root}>
      <NeuTransition />
      <NeuAbout />
      <NeuPixel />
      <NeuService />
    </div>
  )
}
