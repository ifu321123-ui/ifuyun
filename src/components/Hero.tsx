import HeroIntro from "./HeroIntro"
import BusinessIntro from "./BusinessIntro"
import NotebookNav from "./NotebookNav"
import GunzeTransition from "./GunzeTransition"

export default function Hero() {
  return (
    <section id="home">
      <NotebookNav />
      <HeroIntro />
      <BusinessIntro />
      <GunzeTransition />
    </section>
  )
}
