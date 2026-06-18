import { forwardRef } from "react"
import { useLenis } from "lenis/react"
import { navigate, type PageId } from "@/hooks/useRoute"
import { SITE_NAV } from "./junniMenuData"
import "./JunniSiteFooter.css"

type JunniSiteFooterProps = {
  activePage: PageId
  /** 作品页入场动画完成前可设为 false，其余页面保持默认 true */
  visible?: boolean
}

const JunniSiteFooter = forwardRef<HTMLElement, JunniSiteFooterProps>(
  function JunniSiteFooter({ activePage, visible = true }, ref) {
    const lenis = useLenis()

    const scrollTop = () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.1 })
      else window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
      <div className="jsf" data-visible={visible ? "true" : "false"} data-site-footer>
        <footer className="jsf__footer" ref={ref}>
          <div className="jsf__footer-inner">
            <ul className="jsf__footer-menu">
              {SITE_NAV.map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    className="jsf__footer-menu-link"
                    data-active={link.page === activePage}
                    onClick={() => link.page !== activePage && navigate(link.page)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="jsf__footer-brand">
              <p className="jsf__footer-logo">IFUYUN</p>
              <p className="jsf__footer-tagline">懂产品的设计师，懂 AI 的产品人。</p>
            </div>

            <button type="button" className="jsf__page-top" onClick={scrollTop}>
              <svg viewBox="0 0 48.3 54.54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M5,26.54L24.15,5l19.15,21.54"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="10"
                />
                <path
                  d="M5,49.54l19.15-21.54,19.15,21.54"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="10"
                />
              </svg>
              <span>页面顶部</span>
            </button>
          </div>
        </footer>
      </div>
    )
  },
)

export default JunniSiteFooter
