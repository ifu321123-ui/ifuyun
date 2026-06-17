import { Mail, Phone, Download, ArrowUpRight } from "lucide-react"
import { profile } from "@/data"
import Notebook from "./Notebook"

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
    icon: Phone,
    label: "电话",
    value: profile.phone,
    href: `tel:${profile.phone}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: profile.github.replace(/^https?:\/\//, ""),
    href: profile.github,
  },
]

const GUNZE_BG = "#ffffff"
const GUNZE_INK = "#0b0713"
const GUNZE_GREEN = "#cbea41"

export default function Contact() {
  return (
    <>
      <Notebook />
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32"
        style={{ backgroundColor: GUNZE_BG, color: GUNZE_INK }}
      >
        <div
          className="relative overflow-hidden rounded-3xl border-4 bg-white p-8 md:p-16"
          style={{ borderColor: GUNZE_INK, boxShadow: "0.9rem 0.9rem 0 rgb(11 7 19 / 18%)" }}
        >
          <div className="relative">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.08em]"
              style={{ color: GUNZE_GREEN, borderColor: GUNZE_GREEN, backgroundColor: "#fff" }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: GUNZE_GREEN }} />
              联系我
            </div>
            <h2
              className="max-w-2xl text-balance text-3xl font-black leading-tight tracking-[-0.06em] md:text-5xl"
              style={{ color: GUNZE_GREEN }}
            >
              Let&apos;s Build Something Together.
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-[#0b0713]/72">
              {profile.brandClosing}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.targetJobs.map((job) => (
                <span
                  key={job}
                  className="rounded-full border-2 px-3 py-1 text-xs font-bold text-[#0b0713]/72"
                  style={{ borderColor: "rgb(11 7 19 / 18%)", backgroundColor: GUNZE_BG }}
                >
                  {job}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-[3px] bg-white p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: GUNZE_INK, boxShadow: "0.35rem 0.35rem 0 rgb(11 7 19 / 18%)" }}
                >
                  <div
                    className="grid size-11 place-items-center rounded-xl transition-colors group-hover:bg-[#f2ff00] group-hover:text-[#0b0713]"
                    style={{ backgroundColor: GUNZE_GREEN, color: GUNZE_INK }}
                  >
                    <l.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0b0713]/62">{l.label}</div>
                    <div className="truncate text-sm font-black">{l.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                <a
                  href={profile.resumeUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: GUNZE_GREEN, color: GUNZE_INK }}
                >
                  <Download className="size-4" />
                  下载个人简历
                </a>
                <a
                  href={profile.portfolioUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border-[3px] bg-white px-6 py-3 text-sm font-black transition-colors hover:bg-[#f2ff00]"
                  style={{ borderColor: GUNZE_INK, color: GUNZE_INK }}
                >
                  <Download className="size-4" />
                  下载作品集
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#0b0713]/15 pt-8 text-sm text-[#0b0713]/62 sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. 保留所有权利。</p>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-[#0b0713]"
          >
            使用 React + Vite + Tailwind 构建
            <ArrowUpRight className="size-3.5" />
          </a>
        </footer>
      </section>
    </>
  )
}
