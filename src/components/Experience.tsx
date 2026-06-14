import Section from "./Section"
import NeuEmbed from "./neu/NeuEmbed"

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="职业轨迹"
      title="工作经历"
      description="在真实业务场景中沉淀产品方法论与设计判断力。"
    >
      {/* NEU INC 官网 1:1 复刻 —— 作为真实区块整段铺进页面，全宽出血、与页面一起滚动。
          .neu-bleed 抵消宿主的 .neu-host-scale 放大，使该区块净缩放为 1.0（真正 1:1）。 */}
      <div className="neu-bleed relative left-1/2 my-12 w-screen -translate-x-1/2 overflow-x-clip">
        <NeuEmbed />
      </div>
    </Section>
  )
}
