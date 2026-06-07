import { ArrowRight, Download, Sparkles } from "lucide-react"
import { profile, stats } from "@/data"
import { navigate } from "@/hooks/useRoute"

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pt-36 pb-24 md:pt-44 md:pb-32"
    >
      {/* 背景纹理与光晕 */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-32 right-0 size-[480px] rounded-full bg-accent/20 blur-[140px] animate-pulse-glow" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 左侧文字 */}
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-accent" />
            可接受合作 · 开放新机会
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            <span className="text-accent text-glow">{profile.role}</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-xl font-medium leading-snug text-foreground/90 md:text-2xl">
            {profile.slogan}
          </p>

          <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {profile.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("projects")}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              查看全部项目
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Download className="size-4" />
              下载个人简历
            </button>
          </div>
        </div>

        {/* 右侧：预留 3D 交互空间 */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-square rounded-3xl glass-strong p-8">
            <div className="absolute inset-0 grid-bg rounded-3xl opacity-40" />
            <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="relative grid size-32 place-items-center rounded-full border border-accent/30 animate-float">
                <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl" />
                <span className="text-5xl font-bold text-accent text-glow">AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                3D 交互区域
                <br />
                <span className="text-xs opacity-60">（后续接入）</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 量化数据卡片 */}
      <div className="relative mx-auto mt-20 grid max-w-6xl gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight text-foreground">
                {s.value}
              </span>
              <span className="text-2xl font-semibold text-accent">
                {s.suffix}
              </span>
            </div>
            <div className="mt-3 text-sm font-medium text-foreground">
              {s.label}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
