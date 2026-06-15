import JunniHero from "./JunniHero"
import JunniAbout from "./JunniAbout"
import "./junni.css"

interface JunniTopProps {
  onInZoneChange?: (inJunniZone: boolean) => void
}

/**
 * junni.co.jp 入口编排器（MVP 2.0：6×6 网格翻面 Hero + home_about，
 * 后续补齐 WORKS / SERVICE / AWARDS / RECRUIT / CONTACT）。
 */
export default function JunniTop({ onInZoneChange }: JunniTopProps) {
  return (
    <div className="junni-root" data-junni-root>
      <JunniHero onInZoneChange={onInZoneChange} />
      <JunniAbout />
      {/* 预留：JunniWorks / JunniService / JunniAwards / JunniRecruit / JunniContact */}
    </div>
  )
}
