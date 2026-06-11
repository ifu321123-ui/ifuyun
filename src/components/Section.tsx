import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import SplitText from "./SplitText"

interface SectionProps {
  id: string
  eyebrow?: string
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32",
        className,
      )}
    >
      {(eyebrow || title) && (
        <div
          className={cn(
            "mb-14 max-w-2xl",
            inView ? "animate-fade-up" : "opacity-0",
          )}
        >
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-accent">
              <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
              {eyebrow}
            </div>
          )}
          {title && (
            <SplitText
              as="h2"
              text={title}
              by="char"
              stagger={28}
              duration={760}
              className="block text-balance text-3xl font-semibold tracking-tight md:text-4xl"
            />
          )}
          {description && (
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
