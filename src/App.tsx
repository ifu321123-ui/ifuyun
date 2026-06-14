import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Thinking from "./components/Thinking"
import Contact from "./components/Contact"
import QuickActions from "./components/QuickActions"
import IntroFlip from "./components/IntroFlip"
import SmoothScroll from "./components/SmoothScroll"
import NeuClone from "./components/neu/NeuClone"
import { cn } from "./lib/utils"
import { useRoute } from "./hooks/useRoute"

function renderPage(page: string) {
  switch (page) {
    case "experience":
      return <Experience />
    case "projects":
      return <Projects />
    case "thinking":
      return <Thinking />
    case "contact":
      return <Contact />
    default:
      return (
        <>
          <Hero />
        </>
      )
  }
}

export default function App() {
  const page = useRoute()
  const isNotebookHome = page === "home"
  const isNeu = page === "neu"
  // 工作经历页内嵌了 Neu（其设计基准 1rem=10px，会把整页根字号设为 62.5%）。
  // 这里把本站内容整体放大 1.6 倍还原 16px 视感，Neu 区块再自行抵消，实现 1:1 共存。
  const isExperience = page === "experience"

  // Neu 复刻页：完全独立的全屏页面，自带固定导航与平滑滚动，不套用本站的 Navbar / 内边距。
  if (isNeu) {
    return (
      <SmoothScroll>
        <NeuClone />
      </SmoothScroll>
    )
  }

  return (
    <SmoothScroll>
      <div className={cn("relative min-h-screen bg-background", isExperience && "neu-host-scale")}>
        {!isNotebookHome && <Navbar />}
        <main
          key={page}
          className={cn("min-h-screen animate-fade-up", !isNotebookHome && "pt-20")}
        >
          {renderPage(page)}
        </main>
        {!isNotebookHome && <QuickActions />}
        {!isNotebookHome && <IntroFlip />}
      </div>
    </SmoothScroll>
  )
}
