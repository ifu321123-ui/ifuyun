import { useEffect, useState } from "react"

export type PageId = "home" | "experience" | "portfolio" | "contact" | "neu"
export type Route =
  | { page: PageId; slug?: undefined }
  | { page: "work"; slug: string }

const PAGES: PageId[] = ["home", "experience", "portfolio", "contact", "neu"]

function parseHash(): Route {
  const id = window.location.hash.replace(/^#\/?/, "")
  if (id === "projects") return { page: "portfolio" }
  if (id.startsWith("work/")) {
    const slug = id.replace(/^work\//, "")
    return slug ? { page: "work", slug } : { page: "portfolio" }
  }
  return PAGES.includes(id as PageId) ? { page: id as PageId } : { page: "home" }
}

export function navigate(page: PageId | `work/${string}`) {
  const current = window.location.hash.replace(/^#\/?/, "")
  if (current === page) return
  window.location.hash = `/${page}`
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash())

  useEffect(() => {
    const sync = () => setRoute(parseHash())
    sync()
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [])

  return route
}
