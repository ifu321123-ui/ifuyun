import { useEffect, useState } from "react"

export type PageId = "home" | "experience" | "portfolio" | "contact"

export type Route =
  | { page: PageId; slug?: undefined }
  | { page: "work"; slug: string }

const PAGES: PageId[] = ["home", "experience", "portfolio", "contact"]

/** 修正 legacy hash，不用 location.replace（X5 可能整页重载导致循环）。 */
function normalizeLegacyHash(page: PageId) {
  const next = `#/${page}`
  if (window.location.hash === next) return
  const url = `${window.location.pathname}${window.location.search}${next}`
  history.replaceState(null, "", url)
}

function parseHash(): Route {
  const id = window.location.hash.replace(/^#\/?/, "")
  if (id === "projects") return { page: "portfolio" }
  if (id === "neu") return { page: "home" }
  if (id.startsWith("work/")) {
    const slug = id.replace(/^work\//, "")
    return slug ? { page: "work", slug } : { page: "portfolio" }
  }
  return PAGES.includes(id as PageId) ? { page: id as PageId } : { page: "home" }
}

export const APP_SCROLL_RESET = "app:scroll-reset"

const HOME_WORKS_RETURN_SCROLL = "app:home-works-return-scroll"
const HOME_WORKS_RETURN_PENDING = "app:home-works-return-pending"

/** 内存缓存：避免 React Strict Mode 二次挂载时 sessionStorage 已被提前消费。 */
let cachedHomeWorksReturnY: number | null = null

function readHomeWorksReturnFromStorage(): number | null {
  if (sessionStorage.getItem(HOME_WORKS_RETURN_PENDING) !== "1") return null
  const raw = sessionStorage.getItem(HOME_WORKS_RETURN_SCROLL)
  if (raw == null) return null
  const y = Number(raw)
  return Number.isFinite(y) ? y : null
}

/** 从首页 WORKS 圆筒进入作品集前，记录当前滚动位置。 */
export function markHomeWorksReturn(scrollY: number) {
  cachedHomeWorksReturnY = scrollY
  sessionStorage.setItem(HOME_WORKS_RETURN_SCROLL, String(scrollY))
  sessionStorage.setItem(HOME_WORKS_RETURN_PENDING, "1")
}

/** 是否存在待恢复的首页 WORKS 滚动位置（仅从作品集返回首页时使用）。 */
export function hasPendingHomeWorksReturn() {
  return peekHomeWorksReturnScroll() != null
}

/** 读取待恢复位置，不清除（恢复完成前可重复调用）。 */
export function peekHomeWorksReturnScroll(): number | null {
  if (cachedHomeWorksReturnY != null) return cachedHomeWorksReturnY
  const y = readHomeWorksReturnFromStorage()
  if (y != null) cachedHomeWorksReturnY = y
  return y
}

/** 滚动恢复成功后清除 pending 状态。 */
export function finishHomeWorksReturn() {
  cachedHomeWorksReturnY = null
  sessionStorage.removeItem(HOME_WORKS_RETURN_SCROLL)
  sessionStorage.removeItem(HOME_WORKS_RETURN_PENDING)
}

export function clearHomeWorksReturn() {
  finishHomeWorksReturn()
}

export function requestScrollReset() {
  window.dispatchEvent(new CustomEvent(APP_SCROLL_RESET))
}

export function navigate(page: PageId | `work/${string}`) {
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
    const id = window.location.hash.replace(/^#\/?/, "")
    if (id === "neu") normalizeLegacyHash("home")

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
