import type { PageId, Route } from "@/hooks/useRoute"

export type MenuNamespace = "top" | "about" | "work" | "works" | "project" | "contact"

export const JUNNI_MENU_NAV: {
  menu: MenuNamespace
  label: string
  page: PageId | "about-anchor"
}[] = [
  { menu: "top", label: "TOP", page: "home" },
  { menu: "about", label: "ABOUT", page: "about-anchor" },
  { menu: "work", label: "WORK", page: "experience" },
  { menu: "works", label: "WORKS", page: "portfolio" },
  { menu: "project", label: "PROJECTS", page: "projects" },
  { menu: "contact", label: "CONTACT", page: "contact" },
]

/** 原站社交链接占位（junni.co.jp） */
export const JUNNI_MENU_SNS = [
  { label: "X", href: "https://twitter.com/junni_jp" },
  { label: "facebook", href: "https://www.facebook.com/junni.jp" },
  { label: "Instagram", href: "https://www.instagram.com/junni_jp/?hl=ja" },
  { label: "note", href: "https://note.com/junni_jp" },
] as const

export function pageToMenuNamespace(page: PageId | "work"): MenuNamespace {
  switch (page) {
    case "home":
      return "top"
    case "experience":
      return "work"
    case "portfolio":
      return "works"
    case "projects":
    case "work":
      return "project"
    case "contact":
      return "contact"
    case "neu":
      return "top"
    default:
      return "top"
  }
}

export function routeToMenuNamespace(route: Route): MenuNamespace {
  return pageToMenuNamespace(route.page)
}
