import { navigate } from "@/hooks/useRoute"

export type NeuSection = "top" | "about" | "service" | "team" | "news" | "contact"

const LINKS: { id: NeuSection; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "service", label: "Service" },
  { id: "team", label: "Team" },
  { id: "news", label: "News" },
  { id: "contact", label: "Contact" },
]

export default function NeuNav({
  active,
  onDark,
  onJump,
}: {
  active: NeuSection
  onDark: boolean
  onJump: (id: NeuSection) => void
}) {
  return (
    <header className="neu-nav" data-on-dark={onDark}>
      <button
        type="button"
        className="neu-logo"
        onClick={() => navigate("home")}
        aria-label="返回本站首页"
      >
        Neu
      </button>

      <nav className="neu-navlinks">
        {LINKS.map((l) => (
          <button
            key={l.id}
            type="button"
            className="neu-navlink"
            data-active={active === l.id}
            onClick={() => onJump(l.id)}
          >
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
