import { useState, type CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { projects, projectTabs, type ProjectCategory } from "@/data"
import { cn } from "@/lib/utils"
import SplitText from "./SplitText"

const BLUE = "#1700ff"
const INK = "#0b0713"
const BG = "#f7f7f1"
const YELLOW = "#f2ff00"

/** 卡片散落的轻微旋转角度（循环取用） */
const ROTATIONS = [
  "-3deg",
  "2.4deg",
  "-1.6deg",
  "3deg",
  "-2.6deg",
  "1.6deg",
  "-2.2deg",
  "2deg",
]

/** 不同卡片的预览底色（浅色系，贴近 Neu / GUNZE 的蓝白视觉） */
const PREVIEW_TINTS = [
  "linear-gradient(135deg, rgb(23 0 255 / 13%) 0%, #fff 58%)",
  "linear-gradient(135deg, rgb(242 255 0 / 42%) 0%, #fff 62%)",
  "linear-gradient(135deg, rgb(23 0 255 / 9%) 0%, #fff 50%, rgb(23 0 255 / 16%) 100%)",
  "linear-gradient(135deg, #fff 0%, rgb(242 255 0 / 30%) 42%, rgb(23 0 255 / 10%) 100%)",
]

export default function Projects() {
  const [tab, setTab] = useState<ProjectCategory>("B端")
  const filtered = projects.filter((p) => p.category === tab)

  return (
    <section
      id="projects"
      className="min-h-screen scroll-mt-24 pb-20 pt-28 md:pb-28 md:pt-36"
      style={{ backgroundColor: BG, color: INK }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* 标题区 */}
        <div
          className="mb-8 max-w-2xl"
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Arial Black", "Noto Serif SC", system-ui, sans-serif',
          }}
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.08em]"
            style={{ color: BLUE, borderColor: BLUE, backgroundColor: "#fff" }}
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
            Selected Works · 精选作品
          </div>
          <SplitText
            as="h2"
            text="项目作品"
            by="char"
            stagger={28}
            duration={760}
            className="block text-balance text-5xl font-black leading-none tracking-[-0.08em] text-[#1700ff] md:text-7xl"
          />
          <p className="mt-4 max-w-xl text-lg font-black leading-snug tracking-[-0.04em] text-[#0b0713]/70 md:text-2xl">
            everything you do, do it with care.
          </p>
        </div>

        {/* Tab 切换 */}
        <div
          className="mb-8 flex flex-wrap gap-3"
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Arial Black", "Noto Serif SC", system-ui, sans-serif',
          }}
        >
          {projectTabs.map((t) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-full border-[3px] px-5 py-2.5 text-sm font-black tracking-[-0.03em] transition-all duration-300 md:px-6",
                  isActive
                    ? "translate-x-1 bg-[#1700ff] text-white shadow-[0.35rem_0.35rem_0_#0b0713]"
                    : "bg-white text-[#0b0713] shadow-[0.25rem_0.25rem_0_rgba(11,7,19,.18)] hover:translate-x-1 hover:bg-[#f2ff00]",
                )}
                style={{ borderColor: INK }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* 拼贴照片墙 */}
        <div className="relative mt-32 md:mt-40">
          {/* 斜置蓝色底板 */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-[2rem]"
            style={{
              backgroundColor: BLUE,
              border: `4px solid ${INK}`,
              transform: "rotate(-2deg)",
              boxShadow: `0.9rem 0.9rem 0 ${INK}`,
            }}
          />

          {/* 顶部手绘装饰：小熊弹吉他（骑在板面顶边，需在 overflow-hidden 之外） */}
          <img
            src="/deco-bear.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-20 w-44 -translate-x-1/2 -translate-y-full select-none md:w-56"
          />

          {/* 浅色板面（带网格 + 行号 + 侧边栏） */}
          <div
            className="relative overflow-hidden rounded-[1.8rem] border-4 px-5 pt-12 pb-16 md:px-14 md:pt-16 md:pb-20"
            style={{
              background:
                "linear-gradient(90deg, rgb(23 0 255 / 9%) 1.15rem, transparent 1.15rem) 0 0 / 2.3rem 2.3rem, linear-gradient(rgb(23 0 255 / 9%) 1.15rem, transparent 1.15rem) 0 0 / 2.3rem 2.3rem, #fff",
              borderColor: INK,
              boxShadow: "0.45rem 0.45rem 0 rgb(23 0 255 / 45%)",
            }}
          >
            {/* 左侧行号 */}
            <div
              className="pointer-events-none absolute left-11 top-14 bottom-16 hidden flex-col justify-between text-[11px] font-black md:flex"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: "rgb(23 0 255 / 38%)",
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i}>{String(i + 1).padStart(2, "0")}</span>
              ))}
            </div>

            {/* 卡片网格 */}
            <div className="relative z-[1] grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <article
                  key={p.title}
                  className="pin-card group cursor-pointer"
                  style={{ "--rot": ROTATIONS[i % ROTATIONS.length] } as CSSProperties}
                >
                  {/* GUNZE 风格项目卡 */}
                  <div
                    className="rounded-[1.35rem] border-[3px] bg-white p-4 shadow-[0.35rem_0.35rem_0_rgba(11,7,19,.18)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0.65rem_0.65rem_0_rgba(23,0,255,.55)]"
                    style={{
                      borderColor: INK,
                    }}
                  >
                    {/* 预览「照片」 */}
                    <div
                      className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[1rem] border-[3px] p-4"
                      style={{
                        background: PREVIEW_TINTS[i % PREVIEW_TINTS.length],
                        borderColor: BLUE,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className="rounded-full border-2 px-2 py-0.5 text-[10px] font-black"
                          style={{ borderColor: INK, backgroundColor: YELLOW, color: INK }}
                        >
                          {p.category}
                        </span>
                        <span
                          className="text-4xl font-black leading-none tracking-[-0.12em]"
                          style={{
                            color: "rgb(23 0 255 / 18%)",
                            fontFamily:
                              '"Arial Rounded MT Bold", "Arial Black", system-ui, sans-serif',
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-pretty text-[13px] font-extrabold leading-snug text-[#0b0713]/82">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border-2 bg-white px-2 py-0.5 text-[10px] font-bold text-[#0b0713]/70"
                            style={{ borderColor: "rgb(11 7 19 / 18%)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* hover 箭头 */}
                      <div
                        className="absolute right-3 top-3 grid size-8 translate-y-1 place-items-center rounded-full border-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{ backgroundColor: BLUE, borderColor: INK, color: "#ffffff" }}
                      >
                        <ArrowUpRight className="size-4" />
                      </div>
                    </div>

                    <h3
                      className="mt-4 px-1 text-xl font-black leading-tight tracking-[-0.06em] text-[#0b0713]"
                      style={{
                        fontFamily:
                          '"Arial Rounded MT Bold", "Arial Black", "Noto Serif SC", system-ui, sans-serif',
                      }}
                    >
                      {p.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            {/* 底部手绘植物 */}
            <img
              src="/deco-plant.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-6 z-10 w-28 select-none md:w-36"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
