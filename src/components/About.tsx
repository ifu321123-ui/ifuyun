import { Award, Briefcase, Compass, FolderKanban, GraduationCap } from "lucide-react"
import Section from "./Section"
import { about, briefProjects, experiences } from "@/data"

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="关于我"
      title="个人简介"
      description="一份关于定位、优势、理念与成长经历的综合介绍。"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* 个人定位 */}
        <div className="group rounded-2xl glass-strong p-7 transition-all duration-300 hover:-translate-y-1 lg:col-span-3">
          <div className="flex items-start gap-4">
            <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <Compass className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">个人定位</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {about.positioning}
              </p>
            </div>
          </div>
        </div>

        {/* 在校经历 */}
        <div className="group rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1 lg:col-span-3">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <GraduationCap className="size-5" />
            </div>
            <h3 className="text-base font-semibold">在校经历</h3>
          </div>
          <div className="space-y-6">
            {about.education.map((edu) => (
              <div key={edu.school}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {edu.school}
                    </h4>
                    <p className="mt-1 text-sm text-accent">{edu.major}</p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {edu.period}
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {edu.items.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h5>
                        <span className="rounded-full bg-accent-muted px-2.5 py-1 text-xs font-medium text-accent">
                          {item.period}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-2.5">
                        {item.points.map((p) => (
                          <li
                            key={p}
                            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 实习经历 */}
        <div className="group rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1 lg:col-span-3">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <Briefcase className="size-5" />
            </div>
            <h3 className="text-base font-semibold">实习经历</h3>
          </div>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.company} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {exp.company}
                    </h4>
                    <span className="rounded-full bg-accent-muted px-2.5 py-1 text-xs font-medium text-accent">
                      {exp.role}
                    </span>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {exp.period}
                  </span>
                </div>
                {exp.project && (
                  <p className="mt-2 text-sm font-medium text-accent">{exp.project}</p>
                )}
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {exp.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 项目经历 */}
        <div className="group rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1 lg:col-span-3">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <FolderKanban className="size-5" />
            </div>
            <h3 className="text-base font-semibold">项目经历</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {briefProjects.map((project) => (
              <li
                key={project.title}
                className="rounded-xl border border-border p-4 transition-colors hover:border-accent/40"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {project.title}
                </h4>
                <span className="mt-2 inline-block rounded-full bg-accent-muted px-2.5 py-1 text-xs font-medium text-accent">
                  {project.type}
                </span>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {project.period}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 获奖情况 */}
        <div className="group rounded-2xl glass p-7 transition-all duration-300 hover:-translate-y-1 lg:col-span-3">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <Award className="size-5" />
            </div>
            <h3 className="text-base font-semibold">获奖情况</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {about.awards.map((award) => (
              <li
                key={award.name}
                className="rounded-xl border border-border p-4 transition-colors hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {award.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-accent-muted px-2 py-0.5 text-xs font-medium text-accent">
                    {award.level}
                  </span>
                </div>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {award.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
