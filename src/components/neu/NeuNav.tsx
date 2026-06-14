import { navigate } from "@/hooks/useRoute"

export type NeuSection = "top" | "about" | "service"

const LINKS: { id: NeuSection; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "service", label: "Service" },
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
    </header>
  )
}
