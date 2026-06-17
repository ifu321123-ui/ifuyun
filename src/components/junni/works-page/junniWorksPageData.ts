export type WorksPageItem = {
  slug: string
  title: string
  description: string
  image: string
  titleSize?: "small" | "middle" | "normal"
}

export const WORKS_PAGE_ABOUT_TEXT = [
  "アニメ公式サイトなどの",
  "エンターテインメント分野から、",
  "コーポレートサイト、キャンペーンサイト、",
  "サービスサイトのUI／UX、",
  "ライブ配信プラットフォームなど",
  "WEBサイトに限らず",
  "多岐にわたるジャンルのデザインを",
  "手掛けています。",
  "WEBサイトに掲載可能な制作実績の一部を",
  "ご紹介します。",
] as const

export const WORKS_PAGE_ABOUT_IMAGES = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0")
  return `/works/junni/about/works-image${n}.png`
})

const PAGE_1: WorksPageItem[] = [
  {
    slug: "basica",
    title: "BaSICA",
    description: "株式会社BaSICA コーポレートサイトリニューアル",
    image: "/works/junni/basica.jpg",
    titleSize: "normal",
  },
  {
    slug: "alche-studio",
    title: "Alche, Inc",
    description: "Alche株式会社 コーポレートサイトリニューアル",
    image: "/works/junni/alche-studio.png",
    titleSize: "normal",
  },
  {
    slug: "2nd-star-production",
    title: "2nd STAR PRODUCTION",
    description: "「2nd STAR PRODUCTION」コーポレートサイト制作",
    image: "/works/junni/2nd-star-production.jpg",
    titleSize: "small",
  },
  {
    slug: "opb_app",
    title: "ONE PIECE BASE",
    description: "ONE PIECE BASEアプリ開発／制作",
    image: "/works/junni/opb_app.png",
    titleSize: "middle",
  },
  {
    slug: "master-expo",
    title: "M@STER EXPO",
    description: "THE IDOLM@STER M@STER EXPO 公式ブース出展",
    image: "/works/junni/master-expo.png",
    titleSize: "middle",
  },
  {
    slug: "pokeca-event",
    title: "POKÉMON CARD GAME",
    description: "ポケモンカードゲーム イベントページ リニューアル",
    image: "/works/work01.png",
    titleSize: "normal",
  },
  {
    slug: "hugs_breed",
    title: "HUGs BREED",
    description: "NFT「Fluffy HUGs」HUGs BREED特設サイト",
    image: "/works/work02.png",
    titleSize: "normal",
  },
  {
    slug: "tensura-nazuke",
    title: "Nazukerumono",
    description: "リムル様に名付けられたら「〇〇」だった件 授名者（ナヅケルモノ）",
    image: "/works/work03.png",
    titleSize: "small",
  },
  {
    slug: "playyte",
    title: "Playyte",
    description: "音楽・エンターテイメントの「playyte,」コーポレートサイト制作",
    image: "/works/work04.png",
    titleSize: "normal",
  },
  {
    slug: "honey",
    title: "&honey",
    description: "オーガニックヘアケア製品「&honey」のECサイトリニューアル",
    image: "/works/work05.png",
    titleSize: "normal",
  },
  {
    slug: "reml",
    title: "REML",
    description: "電音部『分散型自律ゴーレム りむる』特設サイト",
    image: "/works/shiyuan/01.png",
    titleSize: "normal",
  },
  {
    slug: "nko-jishaku2023",
    title: "Jishaku Sai",
    description: "「N高S高N中等部文化祭2023 （磁石祭）」 サイト制作",
    image: "/works/shiyuan/02.png",
    titleSize: "small",
  },
]

const PAGE_2: WorksPageItem[] = PAGE_1.map((item, i) => ({
  ...item,
  slug: `${item.slug}-p2`,
  title: `${item.title} II`,
  image: WORKS_PAGE_ABOUT_IMAGES[i % WORKS_PAGE_ABOUT_IMAGES.length],
}))

const PAGE_3: WorksPageItem[] = PAGE_1.map((item, i) => ({
  ...item,
  slug: `${item.slug}-p3`,
  title: `${item.title} III`,
  image: WORKS_PAGE_ABOUT_IMAGES[(i + 4) % WORKS_PAGE_ABOUT_IMAGES.length],
}))

export const WORKS_PAGE_DATA: WorksPageItem[][] = [PAGE_1, PAGE_2, PAGE_3]

export const WORKS_PAGE_TOTAL = WORKS_PAGE_DATA.length
