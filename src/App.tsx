import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Thinking from "./components/Thinking"
import Contact from "./components/Contact"
import QuickActions from "./components/QuickActions"
import IntroFlip from "./components/IntroFlip"
import SmoothScroll from "./components/SmoothScroll"
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

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background">
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
