import { useState } from "react"
import { ArrowRight, FileText } from "lucide-react"
import { profile, stats } from "@/data"
import { navigate } from "@/hooks/useRoute"
import SplitText from "./SplitText"

/** 人物抠图：替换为去背 PNG（建议黑白/灰度调），放到 public 下并改这里的路径 */
const PORTRAIT_SRC = "/portrait.png"

function Portrait() {
  const [ok, setOk] = useState(true)

  if (!ok) {
    // 占位：未提供人物图时，保持版式层叠关系
    return (
      <div className="flex h-[clamp(10rem,28vw,20rem)] w-[clamp(13rem,30vw,22rem)] items-end justify-center">
        <div className="grid h-[86%] w-full place-items-center rounded-[2rem] border border-dashed border-border-strong bg-gradient-to-b from-muted to-background text-center">
          <span className="px-4 text-xs leading-relaxed text-muted-foreground">
            人物抠图占位
            <br />
            替换 <code className="font-mono">/public/portrait.png</code>
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={PORTRAIT_SRC}
      alt={profile.name}
      onError={() => setOk(false)}
      className="h-[clamp(10rem,28vw,20rem)] w-auto object-contain object-bottom grayscale contrast-[1.08] mix-blend-screen"
    />
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pt-10 pb-10 md:pt-14 md:pb-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-muted-foreground animate-fade-up md:text-base">
          Hi, 我是 {profile.name}
        </p>

        {/* 人物抠图（黑白）在标题文字上方 */}
        <div className="relative mx-auto mt-4 flex max-w-5xl flex-col items-center">
          <div className="relative z-20 flex justify-center animate-fade-up">
            <Portrait />
          </div>

          <SplitText
            as="h1"
            text={profile.heroTitle}
            by="char"
            stagger={55}
            duration={900}
            className="relative z-10 -mt-2 block select-none whitespace-nowrap text-center text-[clamp(2.5rem,12.5vw,9rem)] font-black leading-[0.92] tracking-tighter text-foreground md:-mt-4"
          />

          <SplitText
            as="h1"
            text={profile.heroSubtitle}
            by="char"
            stagger={55}
            delay={220}
            duration={900}
            className="relative z-10 -mt-[0.16em] block select-none whitespace-nowrap text-center text-[clamp(2.5rem,12.5vw,9rem)] font-black leading-[0.92] tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]"
          />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-pretty text-base leading-relaxed text-muted-foreground animate-fade-up md:text-lg">
          {profile.slogan}
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-center text-pretty text-sm leading-relaxed text-muted-foreground/90 animate-fade-up">
          {profile.description}
        </p>

        <div className="relative z-30 mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
          <button
            onClick={() => navigate("projects")}
            className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            查看项目作品
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href={profile.resumeUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-border-strong px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <FileText className="size-4" />
            下载简历
          </a>
        </div>

        <div className="relative z-30 mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-surface/60 p-4">
              <div className="text-2xl font-semibold text-foreground">
                {item.value}
                <span className="text-lg text-accent">{item.suffix}</span>
              </div>
              <div className="mt-1 text-sm font-medium">{item.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="relative z-30 mx-auto mt-10 grid max-w-4xl gap-8 border-t border-border pt-7 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Currently
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
              {profile.currentStatus}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Previously / 实习与团队
            </p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-semibold text-foreground/70 sm:justify-end">
              <span>{profile.previous[0]}</span>
              <span className="text-border-strong">·</span>
              <span>{profile.previous[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 像素风装饰吉祥物 */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden animate-float select-none lg:block">
        <div
          className="grid size-12 place-items-center rounded-lg border border-border-strong bg-muted text-2xl"
          style={{ imageRendering: "pixelated" }}
        >
          🤖
        </div>
      </div>
    </section>
  )
}
