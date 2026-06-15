import { useEffect, useState } from "react"

export type PageId = "home" | "experience" | "projects" | "contact" | "neu"
export type Route =
  | { page: PageId; slug?: undefined }
  | { page: "work"; slug: string }

const PAGES: PageId[] = ["home", "experience", "projects", "contact", "neu"]

function parseHash(): Route {
  const id = window.location.hash.replace(/^#\/?/, "")
  if (id.startsWith("work/")) {
    const slug = id.replace(/^work\//, "")
    return slug ? { page: "work", slug } : { page: "projects" }
  }
  return PAGES.includes(id as PageId) ? { page: id as PageId } : { page: "home" }
}

export function navigate(page: PageId | `work/${string}`) {
  const current = window.location.hash.replace(/^#\/?/, "")
  if (current === page) return
  window.location.hash = `/${page}`
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash())
      // 滚动归零由 SmoothScroll 统一处理（Lenis / 原生兜底），避免双重滚动冲突。
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return route
}
