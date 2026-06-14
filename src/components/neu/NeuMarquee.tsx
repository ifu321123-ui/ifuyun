const ROWS = [
  {
    cls: "",
    text: "アフィリエイト運用に、試行と執着を。　狂気と楽しさを。　好きと成果を。　GEEK-DRIVEN　",
  },
  {
    cls: "neu-marquee__row--mid",
    text: "Web広告に、　成果報酬型広告に、　SNS広告に、　愛とロジックを。　Hack to Win　",
  },
  {
    cls: "neu-marquee__row--rev",
    text: "広告に、こだわりと偏愛を　Nuance-Driven,　Think to Win　Edit to Win　",
  },
]

export default function NeuMarquee() {
  return (
    <div className="neu-marquee" aria-hidden>
      {ROWS.map((r, i) => (
        <div key={i} className={`neu-marquee__row ${r.cls}`}>
          <div className="neu-marquee__track">
            <span>{r.text}</span>
            <span>{r.text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
