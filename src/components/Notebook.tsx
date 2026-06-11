import { useEffect, useRef, useState } from "react"
import { navigate } from "@/hooks/useRoute"

/* 画布四周散落的手绘涂鸦（已抠成透明 PNG）；depth 控制视差强度，r 为基础旋转 */
const doodles = [
  { src: "/notebook/juicebox.png", wrap: "left-[3%] top-[24%] md:left-[6%]", w: "clamp(48px,7vw,96px)", r: "-7deg", depth: 34, delay: "0s" },
  { src: "/notebook/noodle.png", wrap: "right-[4%] top-[22%] md:right-[7%]", w: "clamp(70px,11vw,150px)", r: "4deg", depth: -28, delay: "1.4s" },
  { src: "/notebook/godzilla.png", wrap: "right-[2%] top-[42%] md:right-[5%]", w: "clamp(80px,13vw,180px)", r: "0deg", depth: -44, delay: "0.7s" },
]

/* 标题末尾轮换的手写词（对应原站 “feel natural” 的可变词） */
const ROTATING = ["简单的", "自然的", "流畅的", "克制的"]

function Smiley() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-[#f2e3cf]">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 9.5c.5.6 1.3.6 1.8 0" />
        <path d="M14.2 9.5c.5.6 1.3.6 1.8 0" />
        <path d="M8.5 14c1.8 1.8 5.2 1.8 7 0" />
      </g>
    </svg>
  )
}

/** 导航 hover 时弹出的手绘涂鸦 */
function HoverDoodle({
  src,
  show,
  className,
  w,
  delay = 0,
}: {
  src: string
  show: boolean
  className: string
  w: string
  delay?: number
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: w,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1) rotate(var(--r,0deg))" : "translateY(6px) scale(0.7) rotate(var(--r,0deg))",
        transition: `opacity .28s ease, transform .35s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    />
  )
}

function StickyNotes() {
  return (
    <div className="nb-stagger relative mx-auto mt-3 h-[clamp(150px,30vw,210px)] w-full max-w-[420px]">
      {/* 横线纸 · 撕边 */}
      <div
        className="nb-note absolute left-[4%] top-[14%] w-[42%] -rotate-6 rounded-[3px] bg-[#fbf7ef] px-3 pb-3 pt-4"
        style={{
          clipPath:
            "polygon(0 6%, 6% 0, 14% 5%, 24% 0, 34% 5%, 46% 0, 58% 5%, 70% 0, 82% 5%, 92% 0, 100% 6%, 100% 100%, 0 100%)",
          backgroundImage:
            "repeating-linear-gradient(#fbf7ef 0 22px, rgba(39,84,169,0.32) 22px 23px)",
        }}
      >
        <span className="absolute inset-y-2 left-[14%] w-px bg-[#f86c69]" />
        <p className="font-gochi text-[clamp(15px,2.6vw,21px)] leading-[22px] text-[#2754a9]">
          tirelessly pursue clarity.
        </p>
      </div>

      {/* 方格纸 */}
      <div
        className="nb-note absolute right-[3%] top-0 w-[46%] rotate-3 rounded-[3px] bg-[#eef0ee] p-3"
        style={{
          backgroundImage:
            "linear-gradient(rgba(40,40,40,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(40,40,40,0.1) 1px,transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <p className="font-mono text-[clamp(14px,2.4vw,20px)] font-bold leading-[1.15] text-[#1d1d1d]">
          Software
          <br />
          should
          <br />
          empower.
        </p>
      </div>

      {/* 牛皮纸 */}
      <div className="nb-note absolute bottom-0 left-1/2 w-[44%] -translate-x-1/2 -rotate-2 rounded-[3px] bg-[#d8c7ad] px-4 py-4">
        <p className="font-averia text-[clamp(15px,2.6vw,22px)] font-medium italic leading-tight text-[#3a3128]">
          Design for moments
        </p>
      </div>
    </div>
  )
}

export default function Notebook() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState<"about" | "work" | null>(null)
  const [wordIdx, setWordIdx] = useState(0)

  // 进场：滚动到可视区触发一次
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 末词轮换
  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING.length), 2600)
    return () => clearInterval(id)
  }, [])

  // 鼠标视差：写入 CSS 变量，避免频繁 re-render
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--nb-mx", String((e.clientX - r.left) / r.width - 0.5))
    el.style.setProperty("--nb-my", String((e.clientY - r.top) / r.height - 0.5))
  }
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--nb-mx", "0")
    e.currentTarget.style.setProperty("--nb-my", "0")
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`notebook-canvas relative overflow-hidden px-4 py-16 md:py-24 ${inView ? "nb-in" : ""}`}
    >
      {/* 散落涂鸦（视差 + 漂浮） */}
      {doodles.map((d) => (
        <div
          key={d.src}
          className={`pointer-events-none absolute z-0 hidden md:block ${d.wrap}`}
          style={{
            transform: `translate(calc(var(--nb-mx,0) * ${d.depth}px), calc(var(--nb-my,0) * ${d.depth * 0.7}px))`,
            transition: "transform .4s ease-out",
          }}
        >
          <img
            src={d.src}
            alt=""
            aria-hidden
            className="nb-float select-none opacity-90"
            style={{ width: d.w, ["--nb-r" as string]: d.r, animationDelay: d.delay }}
          />
        </div>
      ))}

      {/* 顶部手写导航（hover 弹出涂鸦） */}
      <nav className="relative z-20 mb-12 flex items-center justify-center gap-7 text-[#f2e3cf]">
        {/* About 涂鸦 */}
        <HoverDoodle src="/notebook/navie1.png" show={hover === "about"} className="-top-9 left-[20%]" w="34px" />
        <HoverDoodle src="/notebook/navie2.png" show={hover === "about"} className="-top-7 left-[34%]" w="30px" delay={40} />
        <HoverDoodle src="/notebook/navie3.png" show={hover === "about"} className="-bottom-8 left-[26%]" w="30px" delay={80} />
        {/* Work 涂鸦 */}
        <HoverDoodle src="/notebook/navie4.png" show={hover === "work"} className="-top-24 left-[46%]" w="60px" />
        <HoverDoodle src="/notebook/navie5.png" show={hover === "work"} className="-bottom-9 left-[58%]" w="26px" delay={60} />

        <Smiley />
        <button
          onMouseEnter={() => setHover("about")}
          onMouseLeave={() => setHover(null)}
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          className="font-gochi text-[22px] transition-opacity hover:opacity-70"
        >
          关于
        </button>
        <button
          onMouseEnter={() => setHover("work")}
          onMouseLeave={() => setHover(null)}
          onClick={() => navigate("projects")}
          className="font-gochi text-[22px] transition-opacity hover:opacity-70"
        >
          工作
        </button>
        <button
          onClick={() => navigate("contact")}
          className="font-gochi text-[22px] transition-opacity hover:opacity-70"
        >
          连接
        </button>
      </nav>

      {/* 📖 手账本 */}
      <div className="relative z-10 mx-auto w-full max-w-[560px]">
        <div className="nb-book" style={{ perspective: "1500px" }}>
          <div
            className="nb-tilt"
            style={{
              transform:
                "rotateX(calc(var(--nb-my,0) * -8deg)) rotateY(calc(var(--nb-mx,0) * 11deg))",
              transition: "transform .35s ease-out",
            }}
          >
            <div className="rounded-[30px] bg-gradient-to-b from-[#f86c69] to-[#d8483c] p-3 shadow-[0_45px_100px_-45px_rgba(0,0,0,0.85)]">
              {/* 顶页 */}
              <div className="nb-paper relative overflow-hidden rounded-t-[22px] rounded-b-md px-6 pb-8 pt-6">
                <div className="relative z-10 max-w-[58%]">
                  <p className="nb-signature font-gochi text-[clamp(28px,6vw,40px)] leading-none text-[#e35342]">
                    JACKIE
                  </p>
                  <div className="nb-stagger">
                    <p className="font-averia mt-1 text-[clamp(13px,2.6vw,18px)] text-[#e35342]">
                      Prod你ct Des我克ner
                    </p>
                    <h2 className="mt-3 font-averia text-[clamp(26px,7vw,44px)] font-bold leading-[1.05] text-[#e35342]">
                      软件应该
                      <br />
                      <span className="font-averia">感觉</span>
                      <span key={wordIdx} className="font-gochi inline-block animate-fade-up">
                        {" "}
                        {ROTATING[wordIdx]}
                      </span>
                    </h2>
                    <p className="font-averia mt-3 text-[clamp(11px,2.2vw,15px)] tracking-tight text-[#e35342]">
                      开普敦 • GMT +2:00
                    </p>
                  </div>
                </div>

                {/* 主插画 */}
                <img
                  src="/notebook/hero.png"
                  alt="手绘：植物环绕的窗口与人物"
                  className="pointer-events-none absolute -right-2 bottom-0 z-0 w-[56%] max-w-[300px] select-none"
                />
              </div>

              {/* 飘带 / 松紧带 */}
              <div className="relative h-7">
                <div className="absolute left-1/2 top-1/2 h-2 w-[112%] -translate-x-1/2 -translate-y-1/2 -rotate-1 rounded-full bg-gradient-to-r from-[#ef6f5d] via-[#f86c69] to-[#e2604e] shadow-[0_3px_8px_-3px_rgba(0,0,0,0.5)]" />
                <img
                  src="/notebook/bud.png"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -left-3 top-1/2 z-10 w-12 -translate-y-1/2 -rotate-12 select-none"
                />
              </div>

              {/* 底页 */}
              <div className="nb-paper-soft relative overflow-hidden rounded-b-[22px] rounded-t-md px-6 pb-10 pt-6">
                <div className="nb-stagger">
                  <p className="font-averia text-[clamp(14px,3vw,20px)] font-light tracking-tight text-[#e35342]">
                    我坚信的三件事
                  </p>
                  <p className="font-averia -mt-0.5 text-[clamp(11px,2.2vw,14px)] font-light italic text-[#e35342]/80">
                    3 things I strongly believe in
                  </p>
                </div>

                <StickyNotes />

                {/* 底页植物装饰 */}
                <img
                  src="/notebook/plant.png"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-1 w-[20%] max-w-[90px] select-none opacity-90"
                />
                <img
                  src="/notebook/stump.png"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 w-[34%] max-w-[170px] select-none opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
