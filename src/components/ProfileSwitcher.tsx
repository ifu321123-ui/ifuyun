import { useMemo, useState } from "react"
import { about, experiences, projects } from "@/data"

const profileTabs = [
  { key: "education", label: "在校经历", eyebrow: "Campus" },
  { key: "internship", label: "实习经历", eyebrow: "Internship" },
  { key: "projects", label: "项目经历", eyebrow: "Projects" },
  { key: "awards", label: "获奖情况", eyebrow: "Awards" },
] as const

type ProfileTab = (typeof profileTabs)[number]["key"]

type ProfileCard = {
  title: string
  meta: string
  text: string
  tags?: string[]
}

export default function ProfileSwitcher() {
  const [active, setActive] = useState<ProfileTab>("education")

  const cards = useMemo<Record<ProfileTab, ProfileCard[]>>(
    () => ({
      education: about.education.flatMap((education) =>
        education.items.map((item) => ({
          title: item.title,
          meta: `${education.school} · ${education.major} · ${item.period}`,
          text: item.points[0],
          tags: item.points.slice(1, 3),
        })),
      ),
      internship: experiences.map((experience) => ({
        title: experience.company,
        meta: `${experience.role} · ${experience.period}`,
        text: experience.loop.result,
        tags: experience.gains,
      })),
      projects: projects.slice(0, 6).map((project) => ({
        title: project.title,
        meta: `${project.category} · ${project.tags.join(" / ")}`,
        text: project.desc,
      })),
      awards: about.awards.map((award) => ({
        title: award.name,
        meta: `${award.level} · ${award.year}`,
        text: "以竞赛实践验证设计、产品与技术综合能力。",
      })),
    }),
    [],
  )

  const activeTab = profileTabs.find((tab) => tab.key === active) ?? profileTabs[0]

  return (
    <section className="profile-switcher" id="profile" aria-label="个人简介信息切换">
      <div className="profile-switcher__shell">
        <div className="profile-switcher__grid">
          <nav className="profile-switcher__menu" aria-label="个人简介分类">
            {profileTabs.map((tab, index) => (
              <button
                key={tab.key}
                type="button"
                className="profile-switcher__tab"
                data-active={active === tab.key}
                onClick={() => setActive(tab.key)}
              >
                <span className="profile-switcher__tab-index">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="profile-switcher__tab-label">{tab.label}</span>
                  <span className="profile-switcher__tab-eyebrow">{tab.eyebrow}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="profile-switcher__panel" key={active}>
            <div className="profile-switcher__panel-head">
              <span>{activeTab.eyebrow}</span>
              <h3>{activeTab.label}</h3>
            </div>

            <div className="profile-switcher__cards">
              {cards[active].map((card) => (
                <article key={`${card.title}-${card.meta}`} className="profile-card">
                  <div>
                    <h4>{card.title}</h4>
                    <p className="profile-card__meta">{card.meta}</p>
                  </div>
                  <p className="profile-card__text">{card.text}</p>
                  {card.tags && card.tags.length > 0 && (
                    <ul className="profile-card__tags">
                      {card.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
