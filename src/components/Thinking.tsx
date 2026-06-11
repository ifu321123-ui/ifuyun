import Section from "./Section"
import { aiWorkflow, aiWorkflowChapters } from "@/data"
import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

type Chapter = (typeof aiWorkflowChapters)[number]

function ChapterRow({ chapter, isLast }: { chapter: Chapter; isLast: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-6 md:grid-cols-[140px_1fr] md:gap-12",
        inView ? "animate-fade-up" : "opacity-0",
      )}
    >
      {/* 左侧：序号 + 阶段年份 */}
      <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1 md:pt-3 md:text-right">
        <span className="font-mono text-3xl font-semibold text-accent text-glow md:text-4xl">
          {chapter.index}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {chapter.stage}
        </span>
      </div>

      {/* 右侧：叙事内容，左侧带时间线竖线与节点 */}
      <div
        className={cn(
          "relative pl-8 md:pl-10",
          !isLast && "pb-16 md:pb-24",
        )}
      >
        {/* 时间线竖线 */}
        <span className="absolute left-0 top-2 h-full w-px bg-border-strong" />
        {/* 节点 */}
        <span className="absolute -left-[5px] top-2 size-[11px] rounded-full border-2 border-accent bg-background" />

        <h3 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          {chapter.name}
        </h3>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/80 md:text-xl">
          {chapter.role}
        </p>

        {/* 沉淀的方法 */}
        <div className="mt-8 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-accent">
            沉淀的方法
          </div>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            {chapter.learnt}
          </p>
        </div>

        {/* 代表产出 */}
        <div className="mt-7">
          <div className="text-xs font-medium uppercase tracking-wider text-accent">
            代表产出
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapter.works.map((w) => (
              <span
                key={w}
                className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-sm text-foreground/80"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* 量化成果 */}
        <p className="mt-8 max-w-2xl text-balance text-lg font-medium leading-snug text-foreground md:text-xl">
          {chapter.highlight}
        </p>
      </div>
    </div>
  )
}

export default function Thinking() {
  return (
    <Section
      id="thinking"
      eyebrow="产品思考"
      title="AI 工作流与方法论沉淀"
      description="这不是工具清单，而是完整的工作方法。每个阶段都包含：关键动作、代表产出与可验证收益。"
    >
      <div>
        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiWorkflow.map((item) => (
            <article key={item.step} className="rounded-2xl border border-border bg-surface/50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {item.step}
              </div>
              <h3 className="mt-2 text-base font-semibold text-foreground">{item.desc}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>

        {aiWorkflowChapters.map((chapter, i) => (
          <ChapterRow
            key={chapter.index}
            chapter={chapter}
            isLast={i === aiWorkflowChapters.length - 1}
          />
        ))}
      </div>
    </Section>
  )
}
