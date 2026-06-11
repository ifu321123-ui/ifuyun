import { useEffect, useState } from "react"
import { ArrowRight, Download } from "lucide-react"
import { profile } from "@/data"
import { navigate } from "@/hooks/useRoute"
import { cn } from "@/lib/utils"

export default function QuickActions() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 flex flex-col gap-2 transition-all duration-500 sm:flex-row sm:items-center",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      aria-hidden={!visible}
    >
      <button
        onClick={() => navigate("projects")}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-[1.03] sm:px-5"
        aria-label="查看项目作品"
      >
        <ArrowRight className="size-4 sm:order-2 sm:transition-transform sm:group-hover:translate-x-1" />
        <span className="hidden sm:inline">查看项目作品</span>
      </button>
      <a
        href={profile.resumeUrl}
        download
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-background/90 px-4 py-3 text-sm font-semibold text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-muted sm:px-5"
        aria-label="下载个人简历"
      >
        <Download className="size-4" />
        <span className="hidden sm:inline">下载简历</span>
      </a>
    </div>
  )
}
