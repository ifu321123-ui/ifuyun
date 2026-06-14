import { useInView } from "@/hooks/useInView"

export default function NeuPixel() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  return (
    <section className="neu-pixel" data-neu-dark>
      <div
        ref={ref}
        className="neu-pixel__mark"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.8s var(--neu-ease), transform 0.8s var(--neu-ease)",
        }}
      >
        Neu.Inc
      </div>
    </section>
  )
}
