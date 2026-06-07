import { Quote } from "lucide-react"
import Section from "./Section"
import { thinking } from "@/data"

export default function Thinking() {
  return (
    <Section
      id="thinking"
      eyebrow="产品思考"
      title="一些关于产品与 AI 的思考"
      description="比方法论更重要的是判断力，记录我在产品实践中的一些观点。"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {thinking.map((t) => (
          <div
            key={t.title}
            className="group flex flex-col rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1"
          >
            <Quote className="size-7 text-accent/60 transition-colors group-hover:text-accent" />
            <h3 className="mt-5 text-balance text-base font-semibold leading-snug">
              {t.title}
            </h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
