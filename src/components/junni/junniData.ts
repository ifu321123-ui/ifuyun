/** junni.co.jp Hero 文案（MVP 2.0：6×6 网格卡片版） */
export const junniHero = {
  logo: "IFUYUN",
  menu: "MENU",
  // 首屏 JUNNI 下方的手写体标语（原站 home_kv 唯一文案）
  tagline: "自由に、ユニークに。",
  // KV 背面副标题（原站 kv_back 主视觉：ASOBIGOKORO × TECHNOLOGY 标题下方那句，
  // 与 manifesto 是两段不同文案——manifesto 属于下方 home_about）
  kvLead: [
    "アソビゴコロとテクノロジーで、",
    "潜在する価値やメッセージを",
    "新しい体験とともに世界に届ける。",
  ],
  manifesto: [
    "わたしたちジュニは",
    "自由で、ユニークな発想で、",
    "デジタルとリアルを融合した",
    '"体験"を伴うクリエイティブを生み出す会社です。',
  ],
  manifestoExtended: [
    "創業以来、様々なブランドやコンテンツを、",
    "広く世界に、ファンに届けるため、",
    "WEBサイトやアプリ、動画配信サービスや、",
    "デジタルサイネージを活用した体験コンテンツなど",
    "多様なクリエイティブを作成してきました。",
    "これからも様々なクリエイティブを、",
    'つねに、"体験"の設計から考えていきます。',
  ],
  // home_about 按原站拆成 3 个 <p class="home_about_text">，
  // 每段内部逐字 span 化，随滚动从背景绿显色为黑。
  aboutParagraphs: [
    [
      "わたしたちジュニは",
      "自由で、ユニークな発想で、",
      "デジタルとリアルを融合した",
      '"体験"を伴うクリエイティブを生み出す会社です。',
    ],
    [
      "創業以来、様々なブランドやコンテンツを、",
      "広く世界に、ファンに届けるため、",
      "WEBサイトやアプリ、動画配信サービスや、",
      "デジタルサイネージを活用した体験コンテンツなど",
      "多様なクリエイティブを作成してきました。",
    ],
    [
      "これからも様々なクリエイティブを、",
      'つねに、"体験"の設計から考えていきます。',
    ],
  ],
  aboutLabel: "ABOUT",
  aboutCta: "ABOUT JUNNI",
  marquee: "SCROLL DOWN・MORE DETAIL・",
} as const

/** 网格：6 列 × 6 行 = 36 格（front + back = 72 满屏图层） */
export const JUNNI_GRID_COLS = 6
export const JUNNI_GRID_ROWS = 6
export const JUNNI_GRID_COUNT = JUNNI_GRID_COLS * JUNNI_GRID_ROWS

/** 舞台总高（vh 倍数）：决定 sticky 钉住期间用于翻面的滚动行程 */
export const JUNNI_STAGE_VH = 2.6
