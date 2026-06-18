import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useLenis } from "lenis/react"
import { ArrowRight, Download } from "lucide-react"
import { profile } from "@/data"
import { navigate, useRoute, type PageId } from "@/hooks/useRoute"
import {
  JUNNI_MENU_ACTIONS,
  JUNNI_MENU_NAV,
  routeToMenuNamespace,
} from "./junniMenuData"
import "./junni-menu.css"

const BTN_PX = 70
const PANEL_WIDTH = 340
const PANEL_OFFSET = { top: -18, right: -24 }
const PANEL_OFFSET_SP = { top: -10, right: -10 }

function isMenuSp() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
}

interface JunniMenuProps {
  /** @deprecated 首页菜单对比度改由滚动采样背景亮度决定 */
  inJunniZone?: boolean
}

function parseOpaqueRgb(color: string): [number, number, number] | null {
  const match = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  )
  if (!match) return null
  const alpha = match[4] !== undefined ? Number(match[4]) : 1
  if (alpha <= 0.08) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function relativeLuminance(rgb: [number, number, number]): number {
  const linear = rgb.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function isMenuOverLightBackground(): boolean {
  if (typeof window === "undefined") return false
  const menu = document.querySelector<HTMLElement>(".junni-menu")
  if (!menu) return false

  const sp = isMenuSp()
  const x = Math.min(window.innerWidth - 12, window.innerWidth - (sp ? 34 : 68))
  const y = sp ? 30 : 54
  const prevPointerEvents = menu.style.pointerEvents
  menu.style.pointerEvents = "none"

  let onLight = false
  let el = document.elementFromPoint(x, y)
  for (let depth = 0; depth < 16 && el; depth++) {
    const marked = el.getAttribute("data-menu-bg")
    if (marked === "light" || marked === "dark") {
      onLight = marked === "light"
      break
    }
    const rgb = parseOpaqueRgb(getComputedStyle(el).backgroundColor)
    if (rgb) {
      onLight = relativeLuminance(rgb) > 0.42
      break
    }
    el = el.parentElement
  }

  menu.style.pointerEvents = prevPointerEvents
  return onLight
}

function getMenuType(page: PageId, onLightBg: boolean): "white" | "black" {
  if (page === "home" || page === "experience") return onLightBg ? "black" : "white"
  return "white"
}

export default function JunniMenu(_props: JunniMenuProps = {}) {
  const route = useRoute()
  const page = route.page
  const lenis = useLenis()
  const [open, setOpen] = useState(false)
  const [menuActive, setMenuActive] = useState(false)
  const [onLightBg, setOnLightBg] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const actionsRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Timeline | null>(null)
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const namespace = routeToMenuNamespace(route)
  const menuType = getMenuType(page, onLightBg)

  useEffect(() => {
    const needsBgSampling = page === "home" || page === "experience"
    if (!needsBgSampling) {
      setOnLightBg(false)
      return
    }

    let frame = 0
    let current = false

    const sample = () => {
      const next = isMenuOverLightBackground()
      if (next !== current) {
        current = next
        setOnLightBg(next)
      }
    }

    const tick = () => {
      sample()
      frame = requestAnimationFrame(tick)
    }

    sample()
    frame = requestAnimationFrame(tick)

    const onResize = () => sample()
    window.addEventListener("resize", onResize)
    window.addEventListener("junni-menu-bg", sample)
    lenis?.on("scroll", sample)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("junni-menu-bg", sample)
      lenis?.off("scroll", sample)
    }
  }, [page, lenis])

  const closeMenu = useCallback(() => {
    const panel = panelRef.current
    const items = [
      ...navItemRefs.current.filter(Boolean),
      actionsRef.current,
    ].filter(Boolean) as HTMLElement[]
    if (!panel) {
      setOpen(false)
      setMenuActive(false)
      return
    }

    tweenRef.current?.kill()

    if (reducedMotion) {
      panel.style.width = isMenuSp() ? "calc(100vw - 20px)" : `${PANEL_WIDTH}px`
      panel.style.height = isMenuSp() ? "calc(100vh - 20px)" : "auto"
      panel.style.opacity = "0"
      panel.style.visibility = "hidden"
      panel.style.top = "0"
      panel.style.right = "0"
      setOpen(false)
      setMenuActive(false)
      return
    }

    const sp = isMenuSp()
    tweenRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { visibility: "hidden", top: 0, right: 0 })
        setOpen(false)
        setMenuActive(false)
      },
    })

    tweenRef.current
      .to(items, {
        opacity: 0,
        y: 15,
        duration: 0.2,
        stagger: 0.03,
        ease: "sine.out",
      })
      .to(
        panel,
        {
          top: 0,
          right: 0,
          duration: 0.25,
          ease: "sine.out",
        },
        "<",
      )
      .to(
        panel,
        {
          width: BTN_PX,
          height: BTN_PX,
          opacity: 0,
          borderRadius: "50%",
          borderColor: menuType === "white" ? "#ffffff" : "#111111",
          duration: 0.3,
          ease: "sine.out",
        },
        "-=0.1",
      )
  }, [reducedMotion, menuType])

  const openMenu = useCallback(() => {
    const panel = panelRef.current
    if (!panel) return

    setOpen(true)
    setMenuActive(true)
    tweenRef.current?.kill()

    const items = [
      ...navItemRefs.current.filter(Boolean),
      actionsRef.current,
    ].filter(Boolean) as HTMLElement[]

    const sp = isMenuSp()
    const offset = sp ? PANEL_OFFSET_SP : PANEL_OFFSET

    if (reducedMotion) {
      panel.style.visibility = "visible"
      panel.style.width = sp ? "calc(100vw - 20px)" : `${PANEL_WIDTH}px`
      panel.style.height = sp ? "calc(100vh - 20px)" : "auto"
      panel.style.opacity = "1"
      panel.style.borderRadius = "20px"
      panel.style.top = `${offset.top}px`
      panel.style.right = `${offset.right}px`
      panel.style.borderColor = "transparent"
      gsap.set(items, { y: 0, opacity: 1 })
      return
    }

    gsap.set(panel, {
      top: 0,
      right: 0,
      width: BTN_PX,
      height: BTN_PX,
      visibility: "visible",
      opacity: 1,
      borderRadius: 20,
    })
    gsap.set(items, { y: 15, opacity: 0 })

    tweenRef.current = gsap.timeline({ defaults: { ease: "power3.out" } })
    tweenRef.current
      .to(panel, {
        width: sp ? "calc(100vw - 20px)" : PANEL_WIDTH,
        height: sp ? "calc(100vh - 20px)" : "auto",
        duration: 0.3,
      })
      .to(
        panel,
        {
          top: offset.top,
          right: offset.right,
          borderColor: "transparent",
          duration: 0.35,
        },
        "<0.15",
      )
      .to(
        items,
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
        },
        "<0.3",
      )
  }, [reducedMotion])

  const toggleMenu = useCallback(() => {
    if (open) closeMenu()
    else openMenu()
  }, [open, closeMenu, openMenu])

  const onNavClick = useCallback(
    (target: PageId | "about-anchor") => {
      closeMenu()
      if (target === "about-anchor") {
        const el = document.getElementById("about")
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
        } else {
          navigate("home")
          requestAnimationFrame(() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
          })
        }
        return
      }
      navigate(target)
    },
    [closeMenu],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeMenu])

  useEffect(() => {
    if (open) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
    return () => {
      lenis?.start()
    }
  }, [open, lenis])

  useEffect(() => {
    if (open) closeMenu()
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps -- 仅路由切换时关闭

  useEffect(() => {
    return () => {
      tweenRef.current?.kill()
      lenis?.start()
    }
  }, [lenis])

  useEffect(() => {
    const root = document.documentElement
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.setProperty("--scrollbar", `${scrollbar}px`)
    const onResize = () => {
      root.style.setProperty("--scrollbar", `${window.innerWidth - root.clientWidth}px`)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <div
      className="junni-menu"
      data-gooey-color="transparent"
      data-type={menuType}
      data-menu-active={menuActive}
      data-menu-open={open}
      data-namespace={namespace}
      data-active={menuActive}
    >
      <div className="junni-menu_inner">
        <span className="junni-menu_text">MENU </span>
        <span className="junni-menu_wrap">
          <button
            type="button"
            className="junni-menu_btn"
            aria-expanded={open}
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={toggleMenu}
          >
            <span className="junni-menu_dot" />
          </button>
          <div
            className="junni-menu_nav"
            ref={panelRef}
            style={{
              width: BTN_PX,
              height: BTN_PX,
              top: 0,
              right: 0,
              opacity: 0,
              visibility: "hidden",
            }}
          >
            <nav className="junni-nav" aria-label="站点导航">
              <div className="junni-nav_scroll" data-lenis-prevent="">
                <div className="junni-nav_inner">
                  <ul className="junni-nav_list">
                    {JUNNI_MENU_NAV.map((item, i) => (
                      <li
                        key={item.menu}
                        className="junni-nav_item"
                        data-menu={item.menu}
                        ref={(el) => {
                          navItemRefs.current[i] = el
                        }}
                      >
                        <button
                          type="button"
                          className="junni-nav_item_link"
                          onClick={() => onNavClick(item.page)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="junni-nav_actions"
                    ref={actionsRef}
                    style={{ opacity: 0, transform: "translateY(15px)" }}
                  >
                    <button
                      type="button"
                      className="junni-nav_action junni-nav_action--primary"
                      onClick={() => onNavClick(JUNNI_MENU_ACTIONS.portfolio.page)}
                    >
                      <span>{JUNNI_MENU_ACTIONS.portfolio.label}</span>
                      <ArrowRight className="junni-nav_action-icon" aria-hidden />
                    </button>
                    <a
                      className="junni-nav_action junni-nav_action--resume"
                      href={profile.resumeUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      onClick={closeMenu}
                    >
                      <Download className="junni-nav_action-icon" aria-hidden />
                      <span>{JUNNI_MENU_ACTIONS.resume.label}</span>
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </span>
      </div>
    </div>
  )
}
