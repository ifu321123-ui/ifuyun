import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Thinking from "./components/Thinking"
import Contact from "./components/Contact"
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
          <Skills />
        </>
      )
  }
}

export default function App() {
  const page = useRoute()

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main key={page} className="min-h-screen animate-fade-up pt-20">
        {renderPage(page)}
      </main>
    </div>
  )
}
