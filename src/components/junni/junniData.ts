/** junni.co.jp Hero 文案（MVP 2.0：6×6 网格卡片版） */
export const junniHero = {
  logo: "IFUYUN",
  menu: "MENU",
  // 首屏 JUNNI 下方的手写体标语（原站 home_kv 唯一文案）
  tagline: "自由に、ユニークに。",
  // KV 背面副标题（PRODUCT × UI / UX 标题下方那句，
  // 与 manifesto 是两段不同文案——manifesto 属于下方 home_about）
  kvLead: [
    "懂产品的设计师，",
    "懂 AI 的产品人。",
    "探索未来数字体验的无限可能。",
  ],
  manifesto: [
    "我是付云椒，",
    "一名懂产品的设计师，",
    "也是懂 AI 的产品人，",
    "在设计、产品与 AI 之间穿针引线。",
  ],
  manifestoExtended: [
    "从需求洞察到交互设计，",
    "从高保真原型到落地开发，",
    "我以 UI/UX 与产品思维为底，",
    "借助 AI 工作流，",
    "独立完成从问题定义到方案输出的全链路。",
    "我始终相信，",
    "好的产品，应当从“体验”的设计开始。",
  ],
  // home_about 按原站拆成 3 个 <p class="home_about_text">，
  // 每段内部逐字 span 化，随滚动从背景绿显色为黑。
  aboutParagraphs: [
    [
      "我是付云椒，",
      "一名懂产品的设计师，",
      "也是懂 AI 的产品人，",
      "在设计、产品与 AI 之间穿针引线。",
    ],
    [
      "从需求洞察到交互设计，",
      "从高保真原型到落地开发，",
      "我以 UI/UX 与产品思维为底，",
      "借助 AI 工作流，",
      "独立完成从问题定义到方案输出的全链路。",
    ],
    [
      "我始终相信，",
      "好的产品，应当从“体验”的设计开始。",
    ],
  ],
  aboutLabel: "ABOUT",
  aboutCta: "Cloud & Pepper 🌶️",
  marquee: "SCROLL DOWN・MORE DETAIL・",
} as const

/** 网格：6 列 × 6 行 = 36 格（front + back = 72 满屏图层） */
export const JUNNI_GRID_COLS = 6
export const JUNNI_GRID_ROWS = 6
export const JUNNI_GRID_COUNT = JUNNI_GRID_COLS * JUNNI_GRID_ROWS

/** 舞台总高（vh 倍数）：决定 sticky 钉住期间用于翻面的滚动行程 */
export const JUNNI_STAGE_VH = 2.35

/** 手风琴项数据结构：text（单段长文）与 body（图2 结构化排版）二选一 */
export type JunniSolution = {
  num: string
  name: string
  detail: string
  image: string
  alt: string
  text?: string
  body?: {
    groups: {
      subtitle: string
      period?: string
      points: { label?: string; value: string }[]
    }[]
  }
}

/** PERFORMANCE 区块（01–05）：文案取自个人简介（教育 / 实习 / 项目 / 获奖） */
export const junniSolutions: JunniSolution[] = [
  {
    num: "01",
    name: "教育背景",
    detail: "成都锦城学院 · 数字媒体技术（产品设计 / UI 方向）· 2023.09 — 2027.06",
    body: {
      groups: [
        {
          subtitle: "专业学习",
          period: "2023.09 — 至今",
          points: [
            { label: "专业成绩", value: "专业前 10%。" },
            {
              label: "主修课程",
              value:
                "UI 设计、Web 前端网页设计与开发、软件工程、数字音视频处理、图形图像处理、数据库、设计概论、面向对象程序设计、PR / AE / PS / AI 等。",
            },
          ],
        },
        {
          subtitle: "码绘技术工作室 UI 组负责人",
          period: "2024.11 — 至今",
          points: [
            { label: "资源整理", value: "建设团队 UI 方向知识库，编写团队整体学习规划文档 40 余篇。" },
            { label: "团队管理", value: "组织带领团队 30 余人参加国际、国家级竞赛并取得优异成绩。" },
            { label: "项目参研", value: "带领团队成员开发项目，完成原型、界面及交互设计工作 3 项。" },
          ],
        },
      ],
    },
    image: "/works/shiyuan/01.png",
    alt: "教育背景",
  },
  {
    num: "02",
    name: "实习经历",
    detail: "成都四方伟业软件股份有限公司 · UI 实习生 · 2025.07 — 2025.09",
    body: {
      groups: [
        {
          subtitle: "深圳盐田国际集智慧口岸建设项目",
          period: "2025.07 — 2025.09",
          points: [
            {
              label: "项目介绍",
              value:
                "YITC 数字孪生平台通过 3D 渲染 + 3D 模型构建 + 场景构建等技术，对港口地形地貌、道路、海域、码头及岸吊、龙门吊、堆场、闸口、集装箱等要素进行三维重构，从而形成物理世界与数字世界虚实交融、孪生共存。",
            },
            {
              label: "工作概况",
              value:
                "参与盐田港智慧港口数字孪生项目，担任项目经理助理。负责高保真原型设计，直观呈现全域态势感知及资产三维重构；与客户对接，深度挖掘并精炼业务需求，输出标准化需求文档；编写《用户手册》《指标梳理文档》，紧跟项目研发迭代周期，高效推进跨部门协作，助力传统港口实现数字化与精细化管理转型。",
            },
          ],
        },
      ],
    },
    image: "/works/shiyuan/02.png",
    alt: "实习经历 · 四方伟业",
  },
  {
    num: "03",
    name: "项目经历",
    detail: "四川银行问卷后台 / 西南交大工位系统 / 码绘工作室官网",
    body: {
      groups: [
        {
          subtitle: "四川银行问卷后台管理系统（B 端）",
          period: "2024.11 — 2025.11",
          points: [
            {
              label: "项目介绍",
              value:
                "服务于银行内部人员，为市场调研岗设计客户偏好、产品反馈等问卷，帮助管理层快速获取战略决策所需调研数据，助力精准决策与业务优化。",
            },
            {
              label: "工作概况",
              value:
                "精准把握需求，设计审批与消息管理模块、问卷管理（问卷国际化）、商户机构及按管理角色划分的权限；深入分析用户特性，对原型进行视觉优化。",
            },
          ],
        },
        {
          subtitle: "西南交通大学工位管理系统（移动端 / B 端）",
          period: "2024.05 — 2024.11",
          points: [
            {
              label: "项目介绍",
              value:
                "服务于西南交通大学研究生及实验室管理人员，提供便捷的工位申请、审批与管理功能。系统支持工位分配、工作间管理、在线申请、审批流程及数据可视化。",
            },
            {
              label: "工作概况",
              value:
                "从概念到落地的完整设计流程，根据角色设计差异化权限，设计并优化消息通知机制、工位管理、审批流程、数据统计等核心需求；移动端适配，确保操作流畅性与视觉一致性。",
            },
          ],
        },
        {
          subtitle: "码绘技术工作室官网设计（C 端 / 移动端）",
          period: "2025.11 — 至今",
          points: [
            {
              label: "项目介绍",
              value:
                "工作室面向对外展示的重要门户，是集工作室展示、文章动态、产品展示和简历投递与一体的 Web 平台。",
            },
            {
              label: "工作概况",
              value:
                "从概念到落地的完整设计流程，需求分析与设计策略，构建交互体系，进行用户旅程优化，根据工作室的品牌调性进行视觉化设计；移动端适配，确保操作流畅性与视觉一致性。",
            },
          ],
        },
      ],
    },
    image: "/works/shiyuan/03.png",
    alt: "项目经历 · B 端产品",
  },
  {
    num: "04",
    name: "作品",
    detail: "食援 / 蜀香 / 一地人间 · 移动端与 AIGC 创新设计",
    body: {
      groups: [
        {
          subtitle: "移动端设计",
          points: [
            {
              label: "食援",
              value:
                "《食援》是一款以「药食同源」「乡村振兴」「以食为援」为核心理念，药膳食材普及与乡村振兴助农于一体的综合型平台。",
            },
            {
              label: "蜀香",
              value:
                "《蜀香》是介绍四川非遗酒文化的数字化平台，是一款旅游、文化、科普以及交友相结合的 App。",
            },
            {
              label: "一地人间",
              value: "网页以「中国人的土地情感」为叙事核心，构建一部跨越时空的农业记忆长卷。",
            },
          ],
        },
        {
          subtitle: "AIGC 设计",
          points: [
            {
              label: "ifu 个人网页 · vibecoding",
              value:
                "以 React + Vite 搭建个人作品集网站，运用 Cursor、Gemini、Claude 等 AI 工具进行 vibecoding 开发，将产品设计、UX 设计与 AI 工作流整合呈现，涵盖教育背景、实习项目、创新作品与获奖荣誉等板块，实现从原型到上线的快速迭代与部署。",
            },
            {
              label: "膳小羊 · IP 设计",
              value:
                "以「膳小羊」为核心 IP，融合汉代陶俑羊造型与青铜器云纹元素，将中医养生理念、文化传承与助农叙事融入视觉形象体系。",
            },
          ],
        },
      ],
    },
    image: "/works/shiyuan/04.png",
    alt: "项目经历 · 创新设计",
  },
  {
    num: "05",
    name: "获奖荣誉",
    detail: "国家级 / 省级竞赛获奖 10 余项 · 2025",
    body: {
      groups: [
        {
          subtitle: "个人荣誉",
          period: "2025",
          points: [
            { value: "数字媒体科技作品及其创意 · 国赛三等奖" },
            { value: "数字媒体科技作品及其创意 · 省赛二等奖" },
            { value: "未来设计师全国高校设计大赛 · 四川赛区一等奖" },
            { value: "第十五届蓝桥杯 · 四川赛区三等奖" },
            { value: "第十六届蓝桥杯 · 四川赛区三等奖（3 项）" },
            { value: "大学生农业创意设计大赛 · 四川省赛区三等奖" },
            { value: "「挑战杯」全国大学生创业大赛 · 四川赛区三等奖" },
            { value: "「互联网+」大学生创新创业大赛 · 四川赛区三等奖" },
            { value: "第十九届大学生创新创业大赛 · 金奖" },
            { value: "ican 大学生创新创业大赛 · 四川赛区三等奖" },
          ],
        },
      ],
    },
    image: "/works/shiyuan/05.png",
    alt: "获奖情况",
  },
]

/** 标题：逐字描边 + transition-delay 入场 */
export const junniServiceTitle = "PERFORMANCE"
export const junniServiceSub = "我的在校 · 实习 · 项目与获奖记录"

export type JunniWork = {
  slug: string
  title: string
  description: string
  href: string
  image: string
  titleSize?: "small" | "middle" | "normal"
}

/** junni.co.jp home_works：先保留原站文案与链接，图片后续可替换为自己的项目素材 */
export const junniWorks: JunniWork[] = [
  {
    slug: "basica",
    title: "BaSICA",
    description: "株式会社BaSICA コーポレートサイトリニューアル",
    href: "/works/basica",
    image: "/works/junni/basica.jpg",
    titleSize: "normal",
  },
  {
    slug: "alche-studio",
    title: "Alche, Inc",
    description: "Alche株式会社 コーポレートサイトリニューアル",
    href: "/works/alche-studio",
    image: "/works/junni/alche-studio.png",
    titleSize: "normal",
  },
  {
    slug: "2nd-star-production",
    title: "2nd STAR PRODUCTION",
    description: "「2nd STAR PRODUCTION」コーポレートサイト制作",
    href: "/works/2nd-star-production",
    image: "/works/junni/2nd-star-production.jpg",
    titleSize: "small",
  },
  {
    slug: "opb_app",
    title: "ONE PIECE BASE",
    description: "ONE PIECE BASEアプリ開発／制作",
    href: "/works/opb_app",
    image: "/works/junni/opb_app.png",
    titleSize: "middle",
  },
  {
    slug: "master-expo",
    title: "M@STER EXPO",
    description: "THE IDOLM@STER M@STER EXPO 公式ブース出展",
    href: "/works/master-expo",
    image: "/works/junni/master-expo.png",
    titleSize: "middle",
  },
  {
    slug: "and_more",
    title: "and more...",
    description: "WORKS - 制作実績一覧ページ",
    href: "/works",
    image: "",
  },
]
