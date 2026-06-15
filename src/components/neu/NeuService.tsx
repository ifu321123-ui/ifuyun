import { useScrollProgress } from "./useNeuScroll"

const ITEMS = [
  {
    en: "需求同频与管控",
    jp: "作为需求接口人，直接博弈盐田港客户。24小时内将含糊的“业务语言”降维翻译为高精度“研发语言”。颗粒度对齐，拒绝无节制变更，以书面留痕与变更日志（Change Log）牢守项目底线。",
  },
  {
    en: "原型构建与输出",
    jp: "深度操盘智慧告警、危险品总览等核心业务模块的中高保真原型迭代与切图。从用户视角出发，以直观的界面逻辑，推演大型港口数字化转型的最佳路径。",
  },
  {
    en: "指标对齐与沉淀",
    jp: "全量核对岸吊、龙门吊、出入车辆等海量集装箱指标。拉通功能清单与合作方清单，完成了高价值《用户手册》与《指标文档》的最终沉淀。",
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
    <section className="neu-service" id="neu-service" data-neu-dark data-neu-section="service">
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
          成都四方伟业 · 盐田港数字孪生项目
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
              <h4>需求同频与管控</h4>
              <p>需求同频与变更管控</p>
            </div>
            <div className="neu-flow__node neu-flow__node--2">
              <h4>原型构建与输出</h4>
              <p>中高保真原型构建与输出</p>
            </div>
            <div className="neu-flow__node neu-flow__node--3">
              <h4>指标对齐与沉淀</h4>
              <p>指标对齐与全周期交付</p>
            </div>
            <span className="neu-flow__mark">4FUTURES</span>
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
