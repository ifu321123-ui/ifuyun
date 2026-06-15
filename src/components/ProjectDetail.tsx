import { useState } from "react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { navigate } from "@/hooks/useRoute"
import { projects, type Project } from "@/data"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/useInView"

const BLUE = "#1700ff"
const INK = "#0b0713"
const YELLOW = "#f2ff00"

function RevealImage({ src, title, index }: { src: string; title: string; index: number }) {
  const { ref, inView } = useInView<HTMLFigureElement>(0.08)
  const [failed, setFailed] = useState(false)

  return (
    <figure
      ref={ref}
      className={cn(
        "group relative transition-all duration-700",
        inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
      )}
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] border-[3px] bg-white p-2 shadow-[0.45rem_0.45rem_0_rgba(11,7,19,.16)] md:rounded-[2.5rem] md:border-4 md:p-4"
        style={{ borderColor: INK }}
      >
        <div
          className="absolute left-5 top-5 z-10 rounded-full border-2 px-3 py-1 text-xs font-black"
          style={{ borderColor: INK, backgroundColor: YELLOW, color: INK }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {failed ? (
          <div className="grid min-h-[38rem] place-items-center rounded-[1.2rem] bg-[#f7f6ec] p-8 text-center md:rounded-[1.75rem]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#1700ff]">
                Image pending
              </p>
              <p className="mt-3 text-3xl font-black tracking-[-0.08em]">
                待补充第 {index + 1} 张作品图
              </p>
              <p className="mt-3 text-sm font-bold text-[#0b0713]/55">{src}</p>
            </div>
          </div>
        ) : (
          <img
            src={src}
            alt={`${title} 作品展示 ${index + 1}`}
            className="block h-auto w-full rounded-[1.2rem] bg-[#f7f6ec] object-contain md:rounded-[1.75rem]"
            loading={index < 2 ? "eager" : "lazy"}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </figure>
  )
}

function DetailNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-[#0b0713]">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#1700ff]">
          Work not found
        </p>
        <h1 className="text-5xl font-black tracking-[-0.08em]">没有找到这个作品</h1>
        <button
          type="button"
          onClick={() => navigate("projects")}
          className="mt-8 rounded-full border-[3px] bg-[#f2ff00] px-6 py-3 text-sm font-black shadow-[0.35rem_0.35rem_0_#0b0713]"
          style={{ borderColor: INK }}
        >
          返回项目作品
        </button>
      </div>
    </main>
  )
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find((item): item is Project => item.slug === slug)

  if (!project) return <DetailNotFound />

  const metaItems = project.meta
    ? [
        ["客户 / 赛事", project.meta.client],
        ["项目类型", project.meta.type],
        ["时间", project.meta.date],
        ["负责内容", project.meta.role],
        ["工具", project.meta.tools],
      ]
    : []

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0b0713]">
      <section className="relative px-5 pb-20 pt-8 md:px-10 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 18% 12%, rgb(242 255 0 / 46%) 0 14rem, transparent 14.5rem), radial-gradient(circle at 88% 22%, rgb(23 0 255 / 13%) 0 18rem, transparent 18.5rem), linear-gradient(90deg, rgb(23 0 255 / 7%) 1px, transparent 1px) 0 0 / 2.4rem 2.4rem, linear-gradient(rgb(23 0 255 / 7%) 1px, transparent 1px) 0 0 / 2.4rem 2.4rem",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("projects")}
              className="inline-flex items-center gap-2 rounded-full border-[3px] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[0.25rem_0.25rem_0_rgba(11,7,19,.16)] transition-transform hover:-translate-y-0.5"
              style={{ borderColor: INK }}
            >
              <ArrowLeft className="size-4" />
              Back to Works
            </button>
            <div className="hidden rounded-full border-2 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1700ff] md:block">
              Case Study · 2025
            </div>
          </header>

          <div className="grid gap-10 pb-16 pt-20 md:grid-cols-[1.12fr_0.88fr] md:gap-16 md:pb-24 md:pt-28">
            <div>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.08em]"
                style={{ color: BLUE, borderColor: BLUE, backgroundColor: "#fff" }}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                Featured Work
              </div>
              <h1
                className="text-[22vw] font-black leading-[0.76] tracking-[-0.14em] text-[#1700ff] md:text-[10rem]"
                style={{
                  fontFamily:
                    '"Arial Rounded MT Bold", "Arial Black", "Noto Serif SC", system-ui, sans-serif',
                }}
              >
                {project.title}
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-2xl font-black leading-tight tracking-[-0.06em] md:text-5xl">
                {project.subtitle ?? project.desc}
              </p>
            </div>

            <aside
              className="self-end rounded-[1.8rem] border-[3px] bg-white p-5 shadow-[0.45rem_0.45rem_0_#1700ff] md:p-7"
              style={{ borderColor: INK }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#1700ff]">
                  Project Info
                </span>
                <ArrowUpRight className="size-5" />
              </div>
              <dl className="space-y-4">
                {metaItems.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t pt-4">
                    <dt className="text-xs font-black text-[#0b0713]/45">{label}</dt>
                    <dd className="text-sm font-extrabold leading-snug text-[#0b0713]/82">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="grid gap-6 border-y-[3px] py-10 md:grid-cols-[0.8fr_1.2fr] md:py-14" style={{ borderColor: INK }}>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#1700ff]">
              Design Description
            </p>
            <div className="space-y-5 text-lg font-bold leading-relaxed tracking-[-0.03em] text-[#0b0713]/78 md:text-2xl">
              <p>
                《食援》以“药食同源”和“乡村振兴”为核心概念，将中医药膳科普、助农电商与社区互动结合，帮助用户在日常饮食中理解健康知识，也让乡村食材被更清晰地看见。
              </p>
              <p>
                详情页采用长滚动案例叙事，让完整展板按阅读顺序连续呈现，保留作品本身的信息密度，同时用 GUNZE 的大胆标题、Neu 的强对比卡片与圆角边框增强网页记忆点。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#f7f6ec] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl space-y-10 md:space-y-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1700ff]">
                Full Presentation
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.08em] md:text-7xl">完整作品展示</h2>
            </div>
            <p className="max-w-sm text-sm font-bold leading-relaxed text-[#0b0713]/58">
              向下滚动查看图 2 到图 7，每张展板保持完整比例展示。
            </p>
          </div>

          {(project.gallery ?? []).map((src, index) => (
            <RevealImage key={src} src={src} title={project.title} index={index} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-[#1700ff] py-10 text-white">
        <div className="gunze-marquee text-white">
          <div className="gunze-marquee__track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div key={group} className="flex gap-8">
                {["SHI YUAN", "FOOD AS HEALING", "DESIGN WITH CARE", "BACK TO WORKS"].map((item) => (
                  <span key={`${group}-${item}`} className="gunze-marquee__item">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl px-5 md:px-10">
          <button
            type="button"
            onClick={() => navigate("projects")}
            className="rounded-full border-[3px] bg-[#f2ff00] px-6 py-3 text-sm font-black text-[#0b0713] shadow-[0.35rem_0.35rem_0_#0b0713] transition-transform hover:-translate-y-0.5"
            style={{ borderColor: INK }}
          >
            返回项目作品
          </button>
        </div>
      </section>
    </main>
  )
}
