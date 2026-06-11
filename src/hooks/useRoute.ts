import { useEffect, useState } from "react"

export type PageId = "home" | "experience" | "projects" | "thinking" | "contact"

const PAGES: PageId[] = ["home", "experience", "projects", "thinking", "contact"]

function parseHash(): PageId {
  const id = window.location.hash.replace(/^#\/?/, "")
  return PAGES.includes(id as PageId) ? (id as PageId) : "home"
}

export function navigate(page: PageId) {
  if (parseHash() === page) return
  window.location.hash = `/${page}`
}

export function useRoute(): PageId {
  const [page, setPage] = useState<PageId>(parseHash)

  useEffect(() => {
    const onHashChange = () => {
      setPage(parseHash())
      // 滚动归零由 SmoothScroll 统一处理（Lenis / 原生兜底），避免双重滚动冲突。
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return page
}
