import { Briefcase, Check, Search, Wrench, BarChart3, Sparkles } from "lucide-react"
import Section from "./Section"
import { experiences } from "@/data"

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="职业轨迹"
      title="工作经历"
      description="在真实业务场景中沉淀产品方法论与设计判断力。"
    >
      <div className="relative">
        {/* 时间线竖线 */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-border to-transparent md:left-[19px]" />

        {experiences.map((exp) => (
          <div key={exp.company} className="relative pl-12 md:pl-16">
            {/* 节点 */}
            <div className="absolute left-0 top-1 grid size-8 place-items-center rounded-full glass-strong md:size-10">
              <Briefcase className="size-4 text-accent" />
            </div>

            <div className="rounded-2xl glass p-7 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{exp.company}</h3>
                  <p className="mt-1 text-sm text-accent">{exp.role}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {exp.period}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{exp.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-border bg-surface/60 p-4">
                  <h4 className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <Search className="size-4 text-accent" />
                    问题
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.loop.problem}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface/60 p-4">
                  <h4 className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <Check className="size-4 text-accent" />
                    分析
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.loop.analysis}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface/60 p-4">
                  <h4 className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <Wrench className="size-4 text-accent" />
                    方案
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.loop.solution}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface/60 p-4">
                  <h4 className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <BarChart3 className="size-4 text-accent" />
                    结果
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{exp.loop.result}</p>
                </article>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">
                    核心工作内容
                  </h4>
                  <ul className="space-y-2.5">
                    {[exp.loop.problem, exp.loop.analysis, exp.loop.solution].map((p) => (
                      <li
                        key={p}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">
                    能力沉淀
                  </h4>
                  <ul className="space-y-2.5">
                    {exp.gains.map((g) => (
                      <li
                        key={g}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
