import { useWindowScroll } from "./useNeuScroll"

// 缠绕飘带 KV：用原站视频海报图代替视频（视频可用图片代替）。
const KV_IMG = "https://framerusercontent.com/images/BI5gzMhjpP2PS8NV0P1BJzWlzU.png"

const BG_ROWS = [
  "広告に、成果報酬型広告に、こだわりと執念を。 狂気と楽しさを。 GEEK-DRIVEN",
  "Nuance-Driven, 愛とロジックを。 アフィリエイト運用に、こだわりと執念を。 Hack to Win",
  "SNS広告に、アフィリエイト運用に、試行と執着を。 狂気と楽しさを。 好きと成果を。",
  "Web広告に、 成果報酬型広告に、 狂気と楽しさを。 好きと成果を。 愛とロジックを。",
  "GEEK-DRIVEN Think to Win Edit to Win 広告に、こだわりと偏愛を 狂気と楽しさを。",
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

      {/* 缠绕大图：随滚动轻微视差上移，呼应原站 KV 视频 */}
      <div className="neu-hero__art" style={{ transform: `translate(-50%, calc(-50% - ${y * 0.06}px))` }}>
        <img src={KV_IMG} alt="Neu key visual" loading="eager" />
      </div>

      <div className="neu-hero__copy">
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
