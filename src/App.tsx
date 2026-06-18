import { useEffect, useRef, useState } from "react"
import JunniMenu from "./components/junni/JunniMenu"
import JunniSiteFooter from "./components/junni/JunniSiteFooter"
import Hero from "./components/Hero"
import JunniTop from "./components/junni/JunniTop"
import Experience from "./components/Experience"
import Contact from "./components/Contact"
import IntroFlip from "./components/IntroFlip"
import SmoothScroll from "./components/SmoothScroll"
import JunniWorksPage from "./components/junni/works-page/JunniWorksPage"
import { cn } from "./lib/utils"
import { useRoute, type PageId } from "./hooks/useRoute"

function renderPage(
  page: string,
  onJunniZoneChange?: (inJunniZone: boolean) => void,
  portfolioProps?: {
    footerRef: React.RefObject<HTMLElement | null>
    onReadyChange: (ready: boolean) => void
  },
) {
  switch (page) {
    case "experience":
      return <Experience />
    case "portfolio":
      return (
        <JunniWorksPage
          footerRef={portfolioProps?.footerRef}
          onReadyChange={portfolioProps?.onReadyChange}
        />
      )
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
  const isContact = page === "contact"
  const isExperience = page === "experience"
  const isPortfolio = page === "portfolio"
  const footerRef = useRef<HTMLElement>(null)
  const [portfolioFooterVisible, setPortfolioFooterVisible] = useState(false)

  useEffect(() => {
    if (!isPortfolio) setPortfolioFooterVisible(true)
    else setPortfolioFooterVisible(false)
  }, [isPortfolio])

  return (
    <SmoothScroll>
      <JunniMenu inJunniZone={isNotebookHome && inJunniZone} />
      <div
        className={cn(
          "relative min-h-screen",
          isContact ? "bg-[#1c1d21]" : isExperience ? "bg-[#ffffff]" : isPortfolio ? "bg-[#1c1d21]" : "bg-background",
        )}
      >
        <main key={page} className="min-h-screen animate-fade-up">
          {renderPage(page, onJunniZoneChange, {
            footerRef,
            onReadyChange: setPortfolioFooterVisible,
          })}
        </main>
        <JunniSiteFooter
          ref={footerRef}
          activePage={page as PageId}
          visible={portfolioFooterVisible}
        />
        {!isNotebookHome && !isPortfolio && <IntroFlip />}
      </div>
    </SmoothScroll>
  )
}
