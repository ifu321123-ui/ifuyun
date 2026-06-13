import HeroIntro from "./HeroIntro"
import Notebook from "./Notebook"
import NotebookNav from "./NotebookNav"
import GunzeTransition from "./GunzeTransition"

export default function Hero() {
  return (
    <section id="home">
      <NotebookNav />
      <HeroIntro />
      <GunzeTransition />
      <Notebook />
    </section>
  )
}
