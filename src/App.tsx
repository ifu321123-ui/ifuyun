import { useEffect, useState } from "react"
import JunniMenu from "./components/junni/JunniMenu"
import Hero from "./components/Hero"
import JunniTop from "./components/junni/JunniTop"
import Experience from "./components/Experience"
import Contact from "./components/Contact"
import IntroFlip from "./components/IntroFlip"
import SmoothScroll from "./components/SmoothScroll"
import NeuClone from "./components/neu/NeuClone"
import ProjectDetail from "./components/ProjectDetail"
import JunniWorksPage from "./components/junni/works-page/JunniWorksPage"
import { cn } from "./lib/utils"
import { useRoute } from "./hooks/useRoute"

function renderPage(
  page: string,
  onJunniZoneChange?: (inJunniZone: boolean) => void,
) {
  switch (page) {
    case "experience":
      return <Experience />
    case "portfolio":
      return <JunniWorksPage />
    case "contact":
      return <Contact />
    default:
      return (
        <>
          <JunniTop onInZoneChange={onJunniZoneChange} />
          <Hero />
        </>
      )
  }
}

export default function App() {
  const route = useRoute()
  const page = route.page
  const isNotebookHome = page === "home"
  const [inJunniZone, setInJunniZone] = useState(true)
  const onJunniZoneChange = isNotebookHome ? setInJunniZone : undefined

  useEffect(() => {
    if (isNotebookHome) setInJunniZone(true)
  }, [isNotebookHome])
  const isNeu = page === "neu"
  // 工作经历页内嵌了 Neu（其设计基准 1rem=10px，会把整页根字号设为 62.5%）。
  // 这里把本站内容整体放大 1.6 倍还原 16px 视感，Neu 区块再自行抵消，实现 1:1 共存。
  const isContact = page === "contact"
  const isExperience = page === "experience"
  const isPortfolio = page === "portfolio"

  // Neu 复刻页：完全独立的全屏页面，自带固定导航与平滑滚动，不套用本站的 Navbar / 内边距。
  if (isNeu) {
    return (
      <SmoothScroll>
        <NeuClone />
      </SmoothScroll>
    )
  }

  if (page === "work") {
    return (
      <SmoothScroll>
        <JunniMenu />
        <ProjectDetail slug={route.slug} />
      </SmoothScroll>
    )
  }

  return (
    <SmoothScroll>
      <JunniMenu inJunniZone={isNotebookHome && inJunniZone} />
      <div
        className={cn(
          "relative min-h-screen",
          isContact || isExperience ? "bg-[#ffffff]" : isPortfolio ? "bg-[#1c1d21]" : "bg-background",
        )}
      >
        <main key={page} className="min-h-screen animate-fade-up">
          {renderPage(page, onJunniZoneChange)}
        </main>
        {!isNotebookHome && !isPortfolio && (
          <div className={cn(isExperience && "neu-host-scale")}>
            <IntroFlip />
          </div>
        )}
      </div>
    </SmoothScroll>
  )
}
