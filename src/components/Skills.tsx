import { Brain, Palette, Lightbulb, Wrench } from "lucide-react"
import Section from "./Section"
import { skillGroups } from "@/data"

const icons = [Lightbulb, Palette, Brain, Wrench]

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="能力矩阵"
      title="复合型能力，端到端交付"
      description="从产品判断、设计落地到 AI 工程，构建覆盖产品全生命周期的能力体系。"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => {
          const Icon = icons[i]
          return (
            <div
              key={group.title}
              className="group rounded-2xl glass p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
