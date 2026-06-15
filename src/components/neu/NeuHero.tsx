const BG_ROWS = [
  "盐田港、 数字孪生、 全域态势感知、 3D重构、 数据治理、 AI大模型、 精细化转型、 四方伟业。",
  "数字孪生、 全域态势感知、 数据治理、 AI大模型、 盐田港、 四方伟业、 3D重构、 精细化转型。",
  "全域态势感知、 3D重构、 AI大模型、 数据治理、 精细化转型、 数字孪生、 盐田港、 四方伟业。",
  "AI大模型、 数据治理、 精细化转型、 四方伟业、 数字孪生、 3D重构、 盐田港、 全域态势感知。",
  "四方伟业、 精细化转型、 盐田港、 全域态势感知、 数字孪生、 数据治理、 AI大模型、 3D重构。",
]

export default function NeuHero() {
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

      <div className="neu-hero__copy">
        <h1>
          对数字化，
          <br />
          保持重构与死磕。
        </h1>
        <span className="neu-eyebrow">NEU INC, ALWAYS PLAYING TO WIN.</span>
      </div>
    </section>
  )
}
