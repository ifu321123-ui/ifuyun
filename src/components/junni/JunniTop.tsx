import JunniHero from "./JunniHero"
import "./junni.css"

interface JunniTopProps {
  onInZoneChange?: (inJunniZone: boolean) => void
}

/**
 * junni.co.jp 入口编排器（MVP：仅 Hero 切片动效，后续补齐 WORKS / SERVICE 等）。
 */
export default function JunniTop({ onInZoneChange }: JunniTopProps) {
  return (
    <div className="junni-root" data-junni-root>
      <JunniHero onInZoneChange={onInZoneChange} />
      {/* 预留：JunniWorks / JunniService / JunniAwards / JunniRecruit / JunniContact */}
    </div>
  )
}
