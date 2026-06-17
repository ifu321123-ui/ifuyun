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
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/42010e6af63a4fd28da0ebb61f3c403b/works-basica_3_v2.jpg",
    titleSize: "normal",
  },
  {
    slug: "alche-studio",
    title: "Alche, Inc",
    description: "Alche株式会社 コーポレートサイトリニューアル",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/d0640a181d8a4c40bf9991385667a21a/image.png",
    titleSize: "normal",
  },
  {
    slug: "2nd-star-production",
    title: "2nd STAR PRODUCTION",
    description: "「2nd STAR PRODUCTION」コーポレートサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/5dcbe25a596548068d8232473e48b025/01.jpg",
    titleSize: "small",
  },
  {
    slug: "opb_app",
    title: "ONE PIECE BASE",
    description: "ONE PIECE BASEアプリ開発／制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/1199978e96ff42198f3481b2234d1381/works_opb_0.png",
    titleSize: "middle",
  },
  {
    slug: "master-expo",
    title: "M@STER EXPO",
    description: "THE IDOLM@STER M@STER EXPO 公式ブース出展",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/ebef9c2392e642ca81d0f9af5903ab57/idolmaster-expo_01.png",
    titleSize: "middle",
  },
  {
    slug: "pokeca-event",
    title: "POKÉMON CARD GAME",
    description: "ポケモンカードゲーム イベントページ リニューアル",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/b8cd3ab9657a44718a44ffcf512b1b1f/pokemon01.jpg",
    titleSize: "normal",
  },
  {
    slug: "hugs_breed",
    title: "HUGs BREED",
    description: "NFT「Fluffy HUGs」HUGs BREED特設サイト",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/98fbcefa1c6b4ee28a6e9ae6c399e370/breed01.png",
    titleSize: "normal",
  },
  {
    slug: "tensura-nazuke",
    title: "Nazukerumono",
    description: "リムル様に名付けられたら「〇〇」だった件 授名者（ナヅケルモノ）",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/7701372923404f21b2096c68b3cdbb2c/tensura_naduke02-%E3%81%AE%E3%82%B3%E3%83%92%E3%82%9A%E3%83%BC.png",
    titleSize: "small",
  },
  {
    slug: "playyte",
    title: "Playyte",
    description: "音楽・エンターテイメントの「playyte,」コーポレートサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/fee8b2b25aac4859be3d4095dc872f23/playyte01.png",
    titleSize: "normal",
  },
  {
    slug: "honey",
    title: "&honey",
    description: "オーガニックヘアケア製品「&honey」のECサイトリニューアル",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/741e59fc9efe489abfc9350d76f9aa3b/honey01.png",
    titleSize: "normal",
  },
  {
    slug: "reml",
    title: "REML",
    description: "電音部『分散型自律ゴーレム りむる』特設サイト",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/942c1fe4072f477193fbec4a387fe773/reml01.png",
    titleSize: "normal",
  },
  {
    slug: "nko-jishaku2023",
    title: "Jishaku Sai",
    description: "「N高S高N中等部文化祭2023 （磁石祭）」 サイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/35acfeae11034630bf5a24b9df525c4a/nko00.png",
    titleSize: "small",
  },
]

const PAGE_2: WorksPageItem[] = [
  {
    slug: "fluffy_hugs",
    title: "Fluffy HUGS",
    description: "NFT「Fluffy HUGs」スペシャルサイト",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/ccc35e45586840a2b1e7c0641f71e108/fluffyhugs01.jpg",
    titleSize: "normal",
  },
  {
    slug: "innofes",
    title: "Innofes DJ Booth",
    description: "現地とオンラインをインタラクティブにつなぐインスタレーション",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/87a50a8e97684a029c2b93ef640cebdf/innofes01.png",
    titleSize: "middle",
  },
  {
    slug: "junni_is",
    title: "Junni is...",
    description: "株式会社Junni採用特設サイト",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/12f0c77ba77745ea86ed35693f0fb9a3/junniis01.png",
    titleSize: "normal",
  },
  {
    slug: "virtualgallery",
    title: "Tensura Virtual Gallery",
    description: "「転スラバーチャルギャラリー」企画・開発",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/dfc0e56780ab4b55b3b283538830b51e/virtualgallery01.png",
    titleSize: "small",
  },
  {
    slug: "rwby",
    title: "RWBY",
    description: "アニメ『RWBY 氷雪帝国 』のプロモーション企画と公式サイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/83a917f03fd74556bcb588e354873dae/works-rwby01.png",
    titleSize: "normal",
  },
  {
    slug: "you0deco",
    title: "You0DECO TV",
    description: "アニメ『ユーレイデコ』公式サイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/cfa6414ed408428794693a684e0e3261/you0deco.png",
    titleSize: "middle",
  },
  {
    slug: "tensura-movie2022",
    title: "TENSURA MOVIE",
    description: "「劇場版 転生したらスライムだった件 紅蓮の絆編」公式サイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/13f8e51158614088beb9936c4f9e782d/tensura-guren.png",
    titleSize: "middle",
  },
  {
    slug: "vi-ta",
    title: "vi-ta",
    description: "[vi-ta hair design] WEBサイトリニューアル",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/85a3735de6b546109391029ccb16c379/vita01.png",
    titleSize: "normal",
  },
  {
    slug: "tokoshie",
    title: "TOKOSHIE×BULLET",
    description: "「永久×バレット」ティザーサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/060d5a2987cb401f87b2b122648771cf/tokoshie01.png",
    titleSize: "small",
  },
  {
    slug: "burnthewitch",
    title: "BURN THE WITCH",
    description: "アニメ「BURN THE WITCH」公式サイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/75264834d0db4f0781bc0a8b9ff3056d/btw01.png",
    titleSize: "normal",
  },
  {
    slug: "denonbu",
    title: "DENONBU",
    description: "「電音部」オフィシャルサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/2abcb88a41984b8e8156130b6e4ee122/denonbu01.png",
    titleSize: "normal",
  },
  {
    slug: "tensura-portal",
    title: "TENSURA PORTAL",
    description: "アニメ「転生したらスライムだった件」公式 ポータルサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/6ad8ee932b094c939c0fa515897901fc/tensura_thum01.jpg",
    titleSize: "middle",
  },
]

const PAGE_3: WorksPageItem[] = [
  {
    slug: "obsolete-official",
    title: "OBSOLETE",
    description: "アニメ「OBSOLETE」オフィシャルサイト制作",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/5b699b47fd484205be0225190dd65d56/obsolete01.png",
    titleSize: "normal",
  },
  {
    slug: "at-aroma",
    title: "@aroma",
    description: "@aroma online store renewal",
    image: "https://images.microcms-assets.io/assets/e484d7b150f44fd798f6bbac87df2877/a3458c6296eb4880b0e28b228233e58d/aroma02.png",
    titleSize: "normal",
  },
]

export const WORKS_PAGE_DATA: WorksPageItem[][] = [PAGE_1, PAGE_2, PAGE_3]

export const WORKS_PAGE_TOTAL = WORKS_PAGE_DATA.length
