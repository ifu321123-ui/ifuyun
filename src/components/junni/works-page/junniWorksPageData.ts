import type { TextureFocal } from "../drumrollGeometry"

export type WorksPageItem = {

  slug: string

  title: string

  description: string

  image: string

  /** 3D 圆筒贴图（竖版海报）；列表区仍用 image */

  drumrollImage?: string

  /** 滚筒贴图 cover 裁切锚点（不拉伸） */

  drumrollFocal?: TextureFocal

  titleSize?: "small" | "middle" | "normal"

}



export const WORKS_PAGE_ABOUT_TEXT = [

  "我是付云椒，",

  "成都锦城学院数字媒体技术专业在读，",

  "一位兼具产品设计、",

  "UI/UX 设计与 AI 工作流",

  "能力的复合型创作者。",

  "个人定位——",

  "懂产品的设计师，懂 AI 的产品人。",

  "在校期间担任码绘技术工作室 UI 组负责人，",

  "主导团队知识库建设与竞赛项目设计；",

  "同时参与四川银行问卷后台管理系统",

  "等商业项目的原型与界面设计。",

  "在移动端体验、文化叙事、",

  "B 端系统与 AIGC 创作中持续探索。",

  "以下为精选的部分项目与作品，",

  "欢迎浏览。",

] as const



export const WORKS_PAGE_ABOUT_IMAGES = [

  "/works/shiyuan/01.png",

  "/works/shiyuan/02.png",

  "/works/shiyuan/03.png",

  "/works/shiyuan/04.png",

  "/works/shiyuan/05.png",

  "/works/shiyuan/06.png",

  "/works/mahui/01.png",

  "/works/scbank/01.png",

  "/works/shiyuan/01.png",

  "/works/shiyuan/03.png",

  "/works/shiyuan/05.png",

  "/works/mahui/01.png",

  "/works/scbank/01.png",

  "/works/shiyuan/02.png",

  "/works/shiyuan/04.png",

  "/works/shiyuan/06.png",

]



export const WORKS_PAGE_ITEMS: WorksPageItem[] = [

  {

    slug: "shiyuan",

    title: "食援",

    description:
      "食援，是一款以「药食同源」「乡村振兴」「以食为援」为核心理念的 App。旨在让用户深入了解中医药膳文化，将药膳食材知识普及与乡村振兴助农融于一体的综合型平台。让用户「懂药膳、选好材」，同时助力农户增收，推动乡村产业振兴。",

    image: "/works/shiyuan/01.png",

    drumrollImage: "/works/shiyuan/drumroll.png",

    drumrollFocal: "bottom",

    titleSize: "normal",

  },

  {

    slug: "shuxiang",

    title: "蜀香",

    description:
      "蜀香，是介绍四川非遗酒文化的数字化平台，是一款旅游、文化、科普以及交友相结合的 App，主要包括 VR 数字导览以及线上购票、酒文化科普、圈子等功能，致力于让大家更加深刻地了解酒文化。通过 VR 数字化技术打破地域界限，让群众轻松了解蜀地非遗酒文化的历史与艺术，为用户提供便利的同时采用线上购票功能，推动非遗酒四川的旅游业。",

    image: "/works/shuxiang/01.png",

    drumrollImage: "/works/shuxiang/drumroll.png",

    drumrollFocal: "top",

    titleSize: "normal",

  },

  {

    slug: "yidirenjian",

    title: "一地人间",

    description:
      "在时代巨轮的推动下，中国农业从刀耕火种走向智慧农业，完成了一场深刻的变革。那「看天吃饭」的智慧，蕴含着对风雨的敬畏、对季节的感知，更是一代代人对土地深沉的依恋与守护。本网页以「中国人的土地情感」为叙事核心，构建一部跨越时空的农业记忆长卷。",

    image: "/works/yidirenjian/01.png",

    drumrollImage: "/works/yidirenjian/drumroll.png",

    drumrollFocal: "center",

    titleSize: "small",

  },

  {

    slug: "mahui-studio",

    title: "码绘工作室",

    description:
      "工作室面向对外展示的重要门户，是集工作室展示、文章动态、产品展示和简历投递于一体的 Web 平台。",

    image: "/works/mahui/01.png",

    drumrollImage: "/works/mahui/drumroll.png",

    drumrollFocal: "top",

    titleSize: "normal",

  },

  {

    slug: "scbank-survey",

    title: "SCBANK SURVEY",

    description:
      "服务于银行内部人员；为市场调研岗设计客户偏好、产品反馈等问卷；为管理层快速获取战略决策所需调研数据，助力精准决策与业务优化。",

    image: "/works/scbank/01.png",

    drumrollImage: "/works/scbank/drumroll.png",

    drumrollFocal: "top",

    titleSize: "middle",

  },

  {

    slug: "yunyacun",

    title: "崖上的希望·云崖村扶贫纪实",

    description:
      "本作品将「镜头」聚焦四川大凉山悬崖村，一座位于悬崖之上的村庄。在国家的大力脱贫攻坚和精准扶贫政策下，我们一起见证悬崖村「藤梯变钢梯」、从贫瘠茅草屋到小康楼房、从没有经济支撑到发展特色农业旅游的「云端巨变」！",

    image: "/works/yunyacun/drumroll.png",

    drumrollImage: "/works/yunyacun/drumroll.png",

    drumrollFocal: "center",

    titleSize: "small",

  },

  {

    slug: "shanxiaoyang",

    title: "膳小羊",

    description:
      "借鉴「汉代陶俑羊」的圆润身形与青铜器云纹。以「羊致清和」隐喻中医养生智慧，用「膳小羊」形象承载文化传承与城乡善意联结。",

    image: "/works/shanxiaoyang/01.png",

    drumrollImage: "/works/shanxiaoyang/drumroll.png",

    drumrollFocal: "top",

    titleSize: "middle",

  },

]



export const WORKS_PAGE_DATA: WorksPageItem[][] = [WORKS_PAGE_ITEMS]



export const WORKS_PAGE_TOTAL = WORKS_PAGE_DATA.length

