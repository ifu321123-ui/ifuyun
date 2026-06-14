const NEWS = [
  { date: "2025/07/25", tag: "Release", title: "コーポレートサイトをリニューアルしました" },
  { date: "2025/07/25", tag: "Release", title: "6ヶ月連続、月間1万CV達成" },
  { date: "2025/07/25", tag: "Award", title: "提携ASP様より、2024年年間売上第2位を受賞" },
]

export default function NeuNews() {
  return (
    <section className="neu-news" id="neu-news" data-neu-section="news">
      <div className="neu-wrap">
        <span className="neu-eyebrow">( News )</span>
        <div className="neu-news__list">
          {NEWS.map((n, i) => (
            <a key={i} className="neu-news__card" href="#neu-news">
              <div className="neu-news__meta">
                <span className="neu-news__date">{n.date}</span>
                <span className="neu-news__tag">{n.tag}</span>
              </div>
              <span className="neu-news__title">{n.title}</span>
              <span className="neu-news__arrow" aria-hidden>
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
