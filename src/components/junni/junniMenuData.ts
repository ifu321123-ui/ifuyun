import type { PageId, Route } from "@/hooks/useRoute"

export type MenuNamespace = "top" | "work" | "works" | "contact"

/** 全站主导航 / 页脚导航共用 */
export const JUNNI_MENU_NAV: {
  menu: MenuNamespace
  label: string
  page: PageId
}[] = [
  { menu: "top", label: "关于", page: "home" },
  { menu: "work", label: "实习经历", page: "experience" },
  { menu: "works", label: "项目&作品", page: "portfolio" },
  { menu: "contact", label: "联系我", page: "contact" },
]

export const SITE_NAV = JUNNI_MENU_NAV

/** 菜单底部快捷操作（替换原 SNS 链接区） */
export const JUNNI_MENU_ACTIONS = {
  portfolio: { label: "查看项目作品", page: "portfolio" as PageId },
  resume: { label: "下载简历" },
} as const

export function pageToMenuNamespace(page: PageId | "work"): MenuNamespace {
  switch (page) {
    case "home":
      return "top"
    case "experience":
      return "work"
    case "portfolio":
    case "work":
      return "works"
    case "contact":
      return "contact"
    default:
      return "top"
  }
}

export function routeToMenuNamespace(route: Route): MenuNamespace {
  return pageToMenuNamespace(route.page)
}
