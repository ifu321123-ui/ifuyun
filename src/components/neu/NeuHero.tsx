import { useWindowScroll } from "./useNeuScroll"

const BG_ROWS = [
  "広告に、成果報酬型広告に、こだわりと執念を。 狂気と楽しさを。 GEEK-DRIVEN",
  "Nuance-Driven, 愛とロジックを。 アフィリエイト運用に、こだわりと執念を。 Hack to Win",
  "SNS広告に、アフィリエイト運用に、試行と執着を。 狂気と楽しさを。 好きと成果を。",
  "Web広告に、 成果報酬型広告に、 狂気と楽しさを。 好きと成果を。 愛とロジックを。",
  "GEEK-DRIVEN Think to Win Edit to Win 広告に、こだわりと偏愛を 狂気と楽しさを。",
]

// 散落蓝块：x/y 百分比、尺寸、视差系数
const BLOCKS = [
  { x: 8, y: 64, w: 96, h: 150, soft: false, k: 0.12 },
  { x: 3, y: 78, w: 110, h: 175, soft: false, k: 0.2 },
  { x: 4, y: 56, w: 84, h: 110, soft: true, k: 0.34 },
  { x: 34, y: 60, w: 110, h: 250, soft: false, k: 0.16 },
  { x: 30, y: 88, w: 96, h: 130, soft: true, k: 0.26 },
  { x: 55, y: 58, w: 120, h: 240, soft: false, k: 0.22 },
  { x: 72, y: 64, w: 175, h: 200, soft: false, k: 0.14 },
  { x: 92, y: 78, w: 70, h: 150, soft: true, k: 0.3 },
]

export default function NeuHero() {
  const y = useWindowScroll()

  return (
    <section className="neu-hero" id="neu-top" data-neu-section="top">
      <div className="neu-hero__bgtext" aria-hidden>
        {BG_ROWS.map((t, i) => (
          <div key={i} className="neu-hero__bgrow">
            <span>{`${t}　${t}　${t}　`}</span>
            <span>{`${t}　${t}　${t}　`}</span>
          </div>
        ))}
      </div>

      <div className="neu-hero__blocks" aria-hidden>
        {BLOCKS.map((b, i) => (
          <span
            key={i}
            className={b.soft ? "neu-block neu-block--soft" : "neu-block"}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.w,
              height: b.h,
              transform: `translateY(${-y * b.k}px)`,
            }}
          />
        ))}
      </div>

      <div className="neu-hero__title">
        <h1>
          広告に、
          <br />
          こだわりと偏愛を
        </h1>
        <span className="neu-eyebrow">NEU INC, ALWAYS PLAYING TO WIN.</span>
      </div>
    </section>
  )
}
