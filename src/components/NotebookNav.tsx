import { notebookNav } from "@/data"
import { navigate } from "@/hooks/useRoute"

export default function NotebookNav() {
  const onNavClick = (id: (typeof notebookNav)[number]["id"]) => {
    if (id === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    } else if (id === "work") {
      navigate("experience")
    } else if (id === "project") {
      navigate("projects")
    } else {
      navigate("contact")
    }
  }

  return (
    <nav className="notebook-nav notebook-nav--top">
      <div
        className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-[0_10px_30px_-18px_rgba(29,1,254,0.45)]"
        style={{ fontFamily: '"Figtree", sans-serif' }}
      >
        {notebookNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            style={{ fontWeight: 600, lineHeight: 1 }}
            className="rounded-md px-[1.05rem] py-[0.55rem] text-[1.05rem] text-[#1d01fe] transition-colors duration-300 hover:bg-[#1d01fe]/10"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
