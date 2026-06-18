import JunniRecruitPage from "./junni/recruit-page/JunniRecruitPage"
import NeuEmbed from "./neu/NeuEmbed"

export default function Experience() {
  return (
    <>
      {/* Recruit：独立区块，不参与 Neu 缩放链路 */}
      <JunniRecruitPage />
      {/* Neu：与插入 Recruit 前完全相同的缩放结构 */}
      <div className="neu-host-scale">
        <div className="neu-bleed relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip">
          <NeuEmbed />
        </div>
      </div>
    </>
  )
}
