import { Mail, MessageCircle, Download, ArrowUpRight } from "lucide-react"
import { profile } from "@/data"

function Github({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  )
}

const links = [
  {
    icon: Mail,
    label: "邮箱",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: MessageCircle,
    label: "微信",
    value: profile.wechat,
    href: "#",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@yourname",
    href: profile.github,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-16">
        <div className="pointer-events-none absolute -bottom-24 -right-12 size-72 rounded-full bg-accent/20 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-accent">
            <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
            联系我
          </div>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Let&apos;s Build Something Together.
          </h2>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            无论是产品合作、设计交流，还是 AI 落地探讨，欢迎随时与我联系。
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <l.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{l.label}</div>
                  <div className="truncate text-sm font-medium">{l.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              <Download className="size-4" />
              一键下载个人简历
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}. 保留所有权利。</p>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          使用 React + Vite + Tailwind 构建
          <ArrowUpRight className="size-3.5" />
        </a>
      </footer>
    </section>
  )
}
