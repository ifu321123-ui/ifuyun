import HeroIntro from "./HeroIntro"
import BusinessIntro from "./BusinessIntro"
import GunzeTransition from "./GunzeTransition"

export default function Hero() {
  return (
    <section id="home">
      <HeroIntro />
      <BusinessIntro />
      <GunzeTransition />
    </section>
  )
}
