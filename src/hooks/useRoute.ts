import { useEffect, useState } from "react"

export type PageId = "home" | "experience" | "portfolio" | "contact"

const PAGES: PageId[] = ["home", "experience", "portfolio", "contact"]

export type Route = { page: PageId }

function redirectHash(page: PageId) {
  const next = `#/${page}`
  if (window.location.hash !== next) {
    window.location.replace(next)
  }
}

function parseHash(): Route {
  const id = window.location.hash.replace(/^#\/?/, "")
  if (id === "projects") return { page: "portfolio" }
  if (id === "neu") {
    redirectHash("home")
    return { page: "home" }
  }
  if (id.startsWith("work/")) {
    redirectHash("portfolio")
    return { page: "portfolio" }
  }
  return PAGES.includes(id as PageId) ? { page: id as PageId } : { page: "home" }
}

export const APP_SCROLL_RESET = "app:scroll-reset"

export function requestScrollReset() {
  window.dispatchEvent(new CustomEvent(APP_SCROLL_RESET))
}

export function navigate(page: PageId) {
  const current = window.location.hash.replace(/^#\/?/, "")
  if (current === page) {
    requestScrollReset()
    return
  }
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
