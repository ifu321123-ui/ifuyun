/** junni.co.jp/about/ 文案与素材（1:1 原站） */

export const JUNNI_ABOUT_ASSETS = {
  vision: "/works/junni/about-page/vision.svg",
  outline: "/works/junni/about-page/outline.png",
  map: "/works/junni/about-page/map.svg",
  mask: "/works/junni/about-page/mask.webp",
  /** VALUE 插图原站为 Lottie，此处用原站 CDN 占位 */
  valueIllust: (n: number) =>
    `https://junni.co.jp/assets/lottie/value-illust-anime-${String(n).padStart(2, "0")}.json`,
} as const

export const ABOUT_PAGE_TITLE = "ABOUT JUNNI"

export const ABOUT_MISSION = {
  title: "MISSION",
  subtitle: "ジュニが社会に対して果たすべき使命・役割",
  lead: [
    "アソビゴコロとテクノロジーで、",
    "潜在する価値やメッセージを",
    "新しい体験とともに世界に届ける。",
  ],
  body: [
  [
    "ブランドやコンテンツが届けたいメッセージを、",
    "より世界に、人々に届けるために。",
  ],
  [
    "アソビゴコロにあふれる自由な発想と、",
    "デジタル技術を伴う\"ものづくり\"で",
    "驚きや感動とともに伝わる体験を生み出し、",
    "よりその価値を世界や、未来につなげていきます。",
  ],
  ],
} as const

export const ABOUT_VISION = {
  title: "VISION",
  subtitle: "ジュニが理想とするあるべき姿",
  desc: ["自由に、ユニークに。", "驚きや感動をともなう体験を、", "次々に生み出すチームに。"],
  body: [
    "自由な発想で共に考え、",
    "新しいアイデアを大胆に試す。",
    "仲間やパートナー、世界とつながり、",
    "ともに楽しみ、ともに価値を分かち合う。",
    "そんなクリエイティブチームを目指しています。",
  ],
} as const

export type AboutValueItem = {
  num: string
  ja: string
  en: string
  sub: string
  detail: string
}

export const ABOUT_VALUES: AboutValueItem[] = [
  {
    num: "01",
    ja: "成長の相乗",
    en: "CROSS & GROWTH",
    sub: "役割や専門を超え、共に成長する",
    detail:
      "日々の業務の中で、新しい体験や解決策を創り出すことで、共に成長し続ける文化を築いていく。",
  },
  {
    num: "02",
    ja: "断然前のめり",
    en: "FALL FORWARD",
    sub: "失敗を恐れず、挑戦を楽しむ",
    detail:
      "一歩踏み出すことでしか得られない学びを大切にし、挑戦の積み重ねから、未来につながる価値を育てる。",
  },
  {
    num: "03",
    ja: "遊びと学び",
    en: "PLAY & STUDY",
    sub: "アソビゴコロをもって探求し、吸収する",
    detail:
      "新しい知識や技術を積極的に吸収していく。その遊びと学びの循環で、驚きや感動を生む体験を生み出す。",
  },
  {
    num: "04",
    ja: "主張と尊重",
    en: "ASSERT & RESPECT",
    sub: "自分を表現し、他者のアイデアに目を向ける",
    detail:
      "自分の考えを自由に表現しながら、他者の違いを受け入れ、ユニークさの掛け合わせにより豊かなクリエイティブを共創する。",
  },
]

export const ABOUT_VALUE_SUBTITLE = "MISSION / VISION実現のための4つの行動指針"

export type AboutOutlineRow = { term: string; desc: string }

export const ABOUT_OUTLINE = {
  title: "OUTLINE",
  subtitle: "会社概要",
  rows: [
    { term: "会社名", desc: "株式会社ジュ二" },
    { term: "英表記", desc: "JUNNI.co.,ltd." },
    { term: "代表者", desc: "岡村 雅宏" },
    { term: "設立", desc: "2014年3月22日" },
    { term: "資本金", desc: "1,000万円" },
    { term: "所在地", desc: "東京都新宿区新宿1-16-10\nコスモス御苑ビル4F" },
    {
      term: "事業内容",
      desc: "ウェブ制作・デジタルクリエイティブ\nサービス・プロダクト開発\nデジタル ✕ リアル展示制作\nブランド・コンテンツの戦略設計",
    },
  ] satisfies AboutOutlineRow[],
  mapUrl: "https://maps.google.com/?q=東京都新宿区新宿1-16-10",
} as const

export const ABOUT_CHARACTER = {
  title: "CHARACTER",
  subtitle: "ジュニのコーポレートキャラクターの紹介",
  nameLabel: "名前：",
  name: "ジュニくん",
  paragraphs: [
    [
      "ジュニくんが「バク」モチーフなのは、",
      "夢や希望を現実に変える",
      "私たちの能力を表現しているからです。",
    ],
    [
      "バクが象徴するように、",
      "ネガティブなもの(嫌な悪夢）を食べ（取り除き）、",
      "ポジティブな未来を切り拓く",
      "私たちの意志を表現するためです。",
    ],
  ],
} as const

export const ABOUT_FOOTER_LINKS = [
  { id: "home" as const, label: "TOP" },
  { id: "about" as const, label: "ABOUT", active: true },
  { id: "portfolio" as const, label: "WORKS" },
  { id: "projects" as const, label: "SERVICE" },
  { id: "contact" as const, label: "CONTACT" },
] as const

export const ABOUT_COPYRIGHT = "Copyright © JUNNI Co., Ltd. All Rights Reserved."

/** 字母间加空格，对齐原站 M I S S I O N 排版 */
export function spaceLetters(text: string) {
  return Array.from(text).join(" ")
}

/** 页头标题 A B O U T  J U N N I */
export function spacedPageTitle(title: string) {
  return title.split(" ").map((word) => spaceLetters(word)).join("\u00a0\u00a0")
}
