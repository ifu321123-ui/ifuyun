import type { NeuSection } from "./NeuNav"

const MENU: { en: string; jp: string; id: NeuSection }[] = [
  { en: "Top", jp: "トップ", id: "top" },
  { en: "Team", jp: "チーム Neu", id: "team" },
  { en: "About", jp: "Neuについて", id: "about" },
  { en: "News", jp: "お知らせ", id: "news" },
  { en: "Service", jp: "サービスと強み", id: "service" },
  { en: "Contact", jp: "お問合せ", id: "contact" },
]

export default function NeuFooter({ onJump }: { onJump: (id: NeuSection) => void }) {
  return (
    <footer className="neu-footer" data-neu-dark>
      <div className="neu-wrap neu-footer__inner">
        <div className="neu-footer__logo">Neu</div>

        <div className="neu-footer__menu">
          {MENU.map((m) => (
            <a
              key={m.en}
              className="neu-footer__item"
              href={`#neu-${m.id}`}
              onClick={(e) => {
                e.preventDefault()
                onJump(m.id)
              }}
            >
              <span className="neu-footer__item-en">{m.en}</span>
              <span className="neu-footer__item-jp">{m.jp}</span>
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
