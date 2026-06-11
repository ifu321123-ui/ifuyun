import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Thinking from "./components/Thinking"
import Contact from "./components/Contact"
import QuickActions from "./components/QuickActions"
import IntroFlip from "./components/IntroFlip"
import SmoothScroll from "./components/SmoothScroll"
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
          <About />
          <Skills />
        </>
      )
  }
}

export default function App() {
  const page = useRoute()

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background">
        <Navbar />
        <main key={page} className="min-h-screen animate-fade-up pt-20">
          {renderPage(page)}
        </main>
        <QuickActions />
        <IntroFlip />
      </div>
    </SmoothScroll>
  )
}
