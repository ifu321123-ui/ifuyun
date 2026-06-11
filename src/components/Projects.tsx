import { useState, type CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { projects, projectTabs, type ProjectCategory } from "@/data"
import { cn } from "@/lib/utils"
import SplitText from "./SplitText"

const RED = "#e35342"
const CREAM = "#f2e3cf"

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

/** 不同卡片的预览底色（模拟不同截图的色调差异） */
const PREVIEW_TINTS = [
  "radial-gradient(120% 120% at 20% 0%, #28303d 0%, #0c0f15 70%)",
  "radial-gradient(120% 120% at 80% 0%, #3a2422 0%, #120b0a 70%)",
  "radial-gradient(120% 120% at 50% 0%, #1f2b27 0%, #0a0f0d 70%)",
  "radial-gradient(120% 120% at 30% 10%, #2b2535 0%, #100c16 70%)",
]

export default function Projects() {
  const [tab, setTab] = useState<ProjectCategory>("B端")
  const filtered = projects.filter((p) => p.category === tab)

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:py-28">
      {/* 标题区 */}
      <div className="mb-8 max-w-2xl">
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ color: RED, border: `1px solid ${RED}55` }}
        >
          <span className="size-1.5 rounded-full" style={{ backgroundColor: RED }} />
          Selected Works · 精选作品
        </div>
        <SplitText
          as="h2"
          text="项目作品"
          by="char"
          stagger={28}
          duration={760}
          className="block text-balance text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p
          className="mt-3 text-2xl leading-none"
          style={{ fontFamily: "var(--font-hand)", color: `${CREAM}cc` }}
        >
          everything you do, do it with care.
        </p>
      </div>

      {/* Tab 切换 */}
      <div className="mb-8 inline-flex flex-wrap gap-1 rounded-full glass p-1.5">
        {projectTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5",
              tab === t.key
                ? "text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === t.key && (
              <span className="absolute inset-0 rounded-full bg-accent" />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {/* 拼贴照片墙 */}
      <div className="relative mt-32 md:mt-40">
        {/* 斜置红色底板 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-[13px]"
          style={{
            backgroundColor: RED,
            border: `1px solid ${CREAM}`,
            transform: "rotate(-2deg)",
            boxShadow: "0 3px 2px 1px #00000069",
          }}
        />

        {/* 顶部手绘装饰：小熊弹吉他（骑在板面顶边，需在 overflow-hidden 之外） */}
        <img
          src="/deco-bear.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-20 w-44 -translate-x-1/2 -translate-y-full select-none md:w-56"
        />

        {/* 深色板面（带网格 + 行号 + 侧边栏） */}
        <div
          className="relative overflow-hidden rounded-[12px] px-5 pt-12 pb-16 md:px-14 md:pt-16 md:pb-20"
          style={{
            backgroundColor: "#1b1b1b",
            border: `1px solid ${CREAM}40`,
            backgroundImage:
              "linear-gradient(to right, rgba(242,227,207,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,227,207,.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          {/* 左侧行号 */}
          <div
            className="pointer-events-none absolute left-11 top-14 bottom-16 hidden flex-col justify-between text-[11px] md:flex"
            style={{ fontFamily: "var(--font-hand)", color: `${CREAM}55` }}
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
                {/* 宝丽来白框 */}
                <div
                  className="rounded-[4px] p-2.5 pb-3 shadow-[0_14px_34px_-10px_rgba(0,0,0,.7)]"
                  style={{ backgroundColor: "#f6efe2" }}
                >
                  {/* 预览「照片」 */}
                  <div
                    className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[2px] p-4"
                    style={{ background: PREVIEW_TINTS[i % PREVIEW_TINTS.length] }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: `${RED}26`, color: RED }}
                      >
                        {p.category}
                      </span>
                      <span
                        className="text-2xl font-black leading-none"
                        style={{ color: `${CREAM}22`, fontFamily: "var(--font-hand)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-pretty text-[13px] leading-snug text-white/85">
                      {p.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* hover 箭头 */}
                    <div
                      className="absolute right-3 top-3 grid size-7 translate-y-1 place-items-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      style={{ backgroundColor: RED, color: CREAM }}
                    >
                      <ArrowUpRight className="size-4" />
                    </div>
                  </div>

                  {/* 宝丽来标题 */}
                  <h3 className="mt-2.5 px-1 text-[15px] font-bold leading-snug text-[#1b1b1b]">
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
    </section>
  )
}
