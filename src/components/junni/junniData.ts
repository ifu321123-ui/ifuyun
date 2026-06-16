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
export const JUNNI_STAGE_VH = 2.35

/** SERVICE / PERFORMANCE 区块（01–06），文案 1:1 取自原站中文版 */
export const junniSolutions = [
  {
    num: "01",
    name: "Virtual Gallery",
    detail: "规划、设计和开发可通过网络浏览器查看的虚拟画廊。",
    text: "我们可以规划、设计和开发可通过电脑和智能手机上的网络浏览器轻松访问的虚拟画廊。我们通过精心打造的3D世界和便捷易用的操控方式，为用户提供沉浸式体验。艺术品和产品可以在虚拟空间中逼真地再现，适用于博物馆、企业展厅和线上活动。现实世界无法呈现的视觉效果，在3D空间中得以实现；探索超越现实局限的全新表达方式。",
    image: "/works/shiyuan/01.png",
    alt: "虚拟画廊",
  },
  {
    num: "02",
    name: "NFT (Non Fangible Token)",
    detail: "NFT发行、项目管理、规划、设计和使用NFT的Web服务开发。",
    text: "我们提供全面的制作和支持服务，涵盖从NFT发行和项目管理到基于NFT的网络服务的规划、设计和开发。以我们自己的“Fluffy HUGS”项目为例，我们利用区块链技术最大化艺术作品和数字内容的价值。让我们与Juni携手，共同打造一个全新的数字生态系统，通过Discord和社交媒体管理构建社群，拓展未来无限可能。",
    image: "/works/shiyuan/02.png",
    alt: "NFT（非实体代币）",
  },
  {
    num: "03",
    name: "AR Experience",
    detail: "基于浏览器的 Web AR/XR 的规划、设计和开发。",
    text: "我们可以规划、设计和开发可通过浏览器轻松访问的 Web AR（增强现实）和 XR（跨现实）内容。凭借前沿技术和创新理念，我们打造令人惊喜和振奋的互动体验。我们在企业推广、教育和娱乐等各个领域创造全新价值和互动体验。Juni 的解决方案将带您体验超越现实与数字界限的精彩内容。",
    image: "/works/shiyuan/03.png",
    alt: "增强现实体验",
  },
  {
    num: "04",
    name: "GPS Check in",
    detail: "规划、设计和开发基于 GPS 的智能手机连接签到功能。",
    text: "我们提供基于GPS技术的签到功能的规划、设计和开发服务。为了提升用户在活动、场馆和商店的体验，我们基于GPS定位信息打造流畅的签到流程。我们追求用户友好的界面和直观的操作，并提供量身定制的解决方案，以满足企业的特定需求。此外，我们还通过利用签到功能开展活动和推广，增强用户参与度。",
    image: "/works/shiyuan/04.png",
    alt: "GPS签到",
  },
  {
    num: "05",
    name: "Aceess Control System",
    detail: "活动等的入场管理系统功能的规划、设计和开发。",
    text: "我们可以为各类活动、展览及其他活动规划、设计和开发入场管理系统。我们以数字化为核心的入场管理系统确保流畅高效的入场流程。我们提供全面的解决方案，包括使用二维码和NFC技术进行快速签到、实时监控入场状态以及增强安全性。凭借可定制的界面和直观的操作，我们提升了组织者和参与者的便利性，革新了活动管理方式。",
    image: "/works/shiyuan/05.png",
    alt: "访问控制系统",
  },
  {
    num: "06",
    name: "Live Streaming Platform",
    detail: "设计和开发用于直播活动的视频流媒体平台。",
    text: "我们可以为现场活动规划、设计和开发视频流媒体平台。我们高质量的流媒体技术和互动式观看体验，能够将精彩瞬间实时传递给观众。凭借直观的用户界面、稳定的流媒体环境和可定制的功能，我们能够满足各种规模的活动需求。我们致力于最大程度地提升观众参与度，充分发挥您现场活动的价值。",
    image: "/works/shiyuan/06.png",
    alt: "直播平台",
  },
] as const

/** 原站标题：逐字描边 + transition-delay 入场 */
export const junniServiceTitle = "PERFORMANCE"
export const junniServiceSub = "我们的服务交付记录简介"
