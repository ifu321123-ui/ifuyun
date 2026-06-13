import HeroIntro from "./HeroIntro"
import BusinessIntro from "./BusinessIntro"
import Notebook from "./Notebook"
import NotebookNav from "./NotebookNav"
import GunzeTransition from "./GunzeTransition"

export default function Hero() {
  return (
    <section id="home">
      <NotebookNav />
      <HeroIntro />
      <BusinessIntro />
      <GunzeTransition />
      <Notebook />
    </section>
  )
}
