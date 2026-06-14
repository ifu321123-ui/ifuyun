import { useScrollProgress } from "./useNeuScroll"

const ITEMS = [
  {
    en: "Research & Planning",
    jp: "まずNeuが取り組むのはリサーチとプランニング。ユーザーの「隠れた心理」や「無意識の欲求」をはじめ、SNS広告における競合の打ち手や、商品・サービスの競合優位性までを徹底リサーチ。SNSという一般投稿と広告が入り交じる情報の大海原で埋もれずに勝つための戦略を構築します。",
  },
  {
    en: "Creative Production",
    jp: "Neuの強みの核は、“成果につながる”映像コンテンツ制作にあります。行動を引き起こすセールスライティングに基づくシナリオ設計と、演出・カットテンポ・エフェクト・テロップまで視覚心理に基づいたこだわりの詰まった編集で、成果を最大化します。",
  },
  {
    en: "Ad Operations",
    jp: "広告運用の本質はクリエイティブにある——これがNeuの哲学です。運用テクニックにとどまらず、クリエイティブ起点でのアカウント設計と配信戦略により、短期的な成果だけでなく中長期でも安定したコンバージョンと質の高い成果を実現します。",
  },
]

export default function NeuService() {
  // 白卡随滚动「由小变大」：复刻原站 translateY(-300px) scale(0.8) → 归位。
  // scale 0.8→1、上移 130→0、淡入；衔接在蓝色面板之后才出现。
  const { ref, progress } = useScrollProgress<HTMLDivElement>(1, 0.4)
  const scale = 0.8 + 0.2 * progress
  const ty = (1 - progress) * 130
  const opacity = Math.min(1, 0.2 + progress * 1.3)
  // 标题分级浮现（眉标先、主标后），呼应原站 translateY(20)/(80) 阶梯。
  const headP = useScrollProgress<HTMLDivElement>(0.85, 0.42)

  return (
    <section className="neu-service" data-neu-dark data-neu-section="service">
      <div
        ref={ref}
        className="neu-wrap neu-service__card"
        style={{
          opacity,
          transform: `translateY(${ty}px) scale(${scale})`,
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        }}
      >
        <span
          className="neu-eyebrow"
          ref={headP.ref}
          style={{
            display: "inline-block",
            opacity: headP.progress,
            transform: `translateY(${(1 - headP.progress) * 20}px)`,
          }}
        >
          ( Service )
        </span>
        <h2
          className="neu-service__title"
          style={{
            opacity: headP.progress,
            transform: `translateY(${(1 - headP.progress) * 80}px)`,
          }}
        >
          SNSを主とした成果報酬型広告
        </h2>

        <div className="neu-service__grid">
          <div className="neu-service__list">
            {ITEMS.map((it) => (
              <div key={it.en} className="neu-srv-item">
                <div className="neu-srv-item__head">{it.en}</div>
                <p className="neu-srv-item__body">{it.jp}</p>
              </div>
            ))}
          </div>

          <div className="neu-flow">
            <svg className="neu-flow__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M6 34 C 6 8, 60 8, 78 12" markerEnd="" />
              <path d="M88 30 C 96 56, 70 70, 64 80" />
              <path d="M40 92 C 12 96, 6 70, 6 50" />
            </svg>
            <div className="neu-flow__node neu-flow__node--1">
              <h4>Research &amp; Planning</h4>
              <p>営業戦略から逆算したシナリオ設計</p>
            </div>
            <div className="neu-flow__node neu-flow__node--2">
              <h4>Creative Production</h4>
              <p>学ぶ価値の高いSNS映像コンテンツ制作</p>
            </div>
            <div className="neu-flow__node neu-flow__node--3">
              <h4>Ad Operations</h4>
              <p>泥臭く成果を出す広告運用</p>
            </div>
            <span className="neu-flow__mark">Neu</span>
          </div>
        </div>

        <div className="neu-service__cta">
          <a className="neu-pill neu-pill--solid" href="#neu-top">
            サービスと強み →
          </a>
        </div>
      </div>
    </section>
  )
}
