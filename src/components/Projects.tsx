import { useState } from "react"
import { ArrowUpRight, PenTool, Code2, Sparkles, Rocket, ChevronRight } from "lucide-react"
import Section from "./Section"
import { projects, projectTabs, aiWorkflow, type ProjectCategory } from "@/data"
import { cn } from "@/lib/utils"

const flowIcons = [PenTool, Code2, Sparkles, Rocket]

export default function Projects() {
  const [tab, setTab] = useState<ProjectCategory>("B端")
  const filtered = projects.filter((p) => p.category === tab)

  return (
    <Section
      id="projects"
      eyebrow="精选作品"
      title="项目作品"
      description="覆盖企业级 B 端、创新文化设计与 AI 工作流三大赛道。"
    >
      {/* Tab 切换 */}
      <div className="mb-10 inline-flex flex-wrap gap-1 rounded-full glass p-1.5">
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

      {/* AI 工作流：流程图展示 */}
      {tab === "AI工作流" ? (
        <div className="rounded-3xl glass-strong p-8 md:p-12">
          <p className="mb-10 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            一套以 AI 为核心驱动的产品交付工作流，把设计、编码、推理与部署串联成高效闭环。
          </p>
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {aiWorkflow.map((node, i) => {
              const Icon = flowIcons[i]
              return (
                <div key={node.step} className="flex flex-1 items-center gap-4 lg:flex-col">
                  <div className="group w-full rounded-2xl border border-border bg-surface/40 p-6 text-center transition-all duration-300 hover:border-accent/40 hover:-translate-y-1">
                    <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="size-6" />
                    </div>
                    <div className="text-base font-semibold">{node.step}</div>
                    <div className="mt-1 text-sm text-foreground/80">{node.desc}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{node.detail}</div>
                  </div>
                  {i < aiWorkflow.length - 1 && (
                    <ChevronRight className="size-6 shrink-0 rotate-90 text-accent lg:rotate-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <article
              key={p.title}
              className="group flex flex-col rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                <div className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent/40 group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
              <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
