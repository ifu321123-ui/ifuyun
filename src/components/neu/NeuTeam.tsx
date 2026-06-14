import { useScrollProgress } from "./useNeuScroll"

const IMG = "https://framerusercontent.com/images/"

// 9 名成员（用原站视频海报图代替视频）+ 错落定位 + 从左/右飞入。
type Member = {
  name: string
  img: string
  left: string
  top: string
  w: number // 相对宽度系数（vw 基准微调）
  from: 1 | -1 // 1 从右、-1 从左
}

const MEMBERS: Member[] = [
  { name: "Takuma Kanzaki", img: "aTaXYIoWyTIPUm1OruKgKxrgnU4.png", left: "0%", top: "0%", w: 1, from: 1 },
  { name: "Yuma Kanzaki", img: "bAccYLmDvB4PP2Gr2ag38eXhl0.png", left: "58%", top: "6%", w: 1, from: -1 },
  { name: "Yusuke Iwnaka", img: "B18jHNKneQBPaLkDefUZWoGyHY.png", left: "10%", top: "20%", w: 1, from: 1 },
  { name: "Chizuru Ano", img: "WZStNniGB2KvRDKU0p6cqfoRekE.png", left: "62%", top: "26%", w: 1, from: -1 },
  { name: "Ryota Sakaguchi", img: "6gMmr9uRArA2gq9bL0QdLS8Us.png", left: "2%", top: "42%", w: 1, from: 1 },
  { name: "Kentaro Matuoka", img: "uE6pFGZKd8q7FNvqfx24psQQ6UQ.png", left: "56%", top: "48%", w: 1, from: -1 },
  { name: "Rei Shinonaga", img: "pWD5Blmhd5BuBMzL6wPw8NGVB8.png", left: "12%", top: "64%", w: 1, from: 1 },
  { name: "Ayano Kumagai", img: "S9VU8lUEpAUbvPw4L9vd9Ojgg.png", left: "60%", top: "70%", w: 1, from: -1 },
  { name: "Domon", img: "s9OqR7AMoxQUGFcJb2GcJxdmVII.png", left: "30%", top: "86%", w: 1, from: 1 },
]

function Frame({ m }: { m: Member }) {
  // 进入视口的进度 0→1：translateX(±120) scale(1.8) → 归位，淡入。
  const { ref, progress } = useScrollProgress<HTMLDivElement>(0.92, 0.5)
  const eased = 1 - Math.pow(1 - progress, 3)
  const x = (1 - eased) * 120 * m.from
  const scale = 1.8 - 0.8 * eased

  return (
    <div
      ref={ref}
      className="neu-frame"
      style={{
        left: m.left,
        top: m.top,
        opacity: eased,
        transform: `translateX(${x}px) scale(${scale})`,
      }}
    >
      <div className="neu-frame__crt">
        <img src={`${IMG}${m.img}`} alt={m.name} loading="lazy" />
      </div>
    </div>
  )
}

const CHIPS = [
  { left: "44%", top: "10%", w: 48, h: 70 },
  { left: "50%", top: "40%", w: 60, h: 60 },
  { left: "24%", top: "56%", w: 54, h: 80 },
  { left: "70%", top: "60%", w: 70, h: 70 },
]

export default function NeuTeam() {
  return (
    <section className="neu-team" id="neu-team" data-neu-section="team">
      <span className="neu-eyebrow neu-team__eyebrow">( TEAM )</span>
      <div className="neu-team__stage">
        {CHIPS.map((c, i) => (
          <span
            key={i}
            className="neu-team__chip"
            style={{ left: c.left, top: c.top, width: c.w, height: c.h }}
            aria-hidden
          />
        ))}
        {MEMBERS.map((m) => (
          <Frame key={m.name} m={m} />
        ))}
      </div>
    </section>
  )
}
