import { WORKS_PAGE_DATA, type WorksPageItem } from "../works-page/junniWorksPageData"

export type WorkCredit = { role: string; name: string }

export type WorkMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string; poster?: string }
  | { type: "youtube"; src: string; alt?: string }

export type WorkSection = {
  heading?: string
  body?: string[]
  media?: WorkMedia
}

export type WorkDetail = {
  slug: string
  title: string
  subtitle: string
  heroImage: string
  heroVideo?: string
  client: string
  scope: string
  release: string
  website?: string
  credits: WorkCredit[]
  intro: string
  sections: WorkSection[]
}

const DEFAULT_CREDITS: WorkCredit[] = [
  { role: "产品策划", name: "付云椒" },
  { role: "UI / UX 设计", name: "付云椒" },
  { role: "视觉设计", name: "付云椒" },
  { role: "原型表达", name: "付云椒" },
]

export const WORK_DETAIL_BY_SLUG: Record<string, WorkDetail> = {
  shiyuan: {
    slug: "shiyuan",
    title: "食援",
    subtitle: "中医药膳科普 · 助农电商平台",
    heroImage: "/works/shiyuan/01.png",
    heroVideo: "/works/shiyuan/interactive.mp4",
    client: "蓝桥杯大赛参赛作品",
    scope: "产品设计 / UI 设计 / IP 设计",
    release: "2025",
    credits: DEFAULT_CREDITS,
    intro:
      "《食援》是一款以「药食同源」「乡村振兴」「以食为援」为核心理念的 App。旨在让用户深入了解中医药膳文化，将药膳食材知识普及与乡村振兴助农融于一体的综合型平台，让用户「懂药膳、选好材」，同时助力农户增收。",
    sections: [
      {
        heading: "圈子、帮扶与其他界面",
        body: [
          "圈子模块以「共论药膳、共助乡村」为核心，打造知识分享与助农成果可见的社区闭环；帮扶模块从消费助农延伸至情感联结，涵盖定点帮扶、滞销急救与助农商城；其余界面覆盖个人中心、登录、搜索与识材等常用场景。",
        ],
        media: { type: "image", src: "/works/shiyuan/02.png", alt: "食援 圈子 · 帮扶 · 其他界面" },
      },
      {
        heading: "设计规范、Logo 与 IP，建立食援的视觉识别体系",
        body: [
          "从图标、配色到字体，构建统一的绿色健康调性；Logo 以「食」字与稻穗结合，传递健康与丰收；IP「膳小羊」以圆润造型贯穿各模块，增强品牌亲和力。",
          "下方原型图完整呈现首页、百科、圈子、帮扶与个人中心等核心界面框架。",
        ],
        media: { type: "image", src: "/works/shiyuan/03.png", alt: "食援 设计规范 · Logo · IP · 原型图" },
      },
      {
        heading: "特色功能：从计划定制到互动体验",
        body: [
          "「制定计划」根据用户体质与节气智能推荐七日养生方案；「养生五色」以五脏对应五色食材，点击即可查看功效；「小厨房」可视化演示药食相冲风险；「锦囊妙书」以可听可读的三维空间呈现中医典故。",
        ],
        media: { type: "image", src: "/works/shiyuan/04.png", alt: "食援 特色功能" },
      },
      {
        heading: "引导页与界面总览",
        body: [
          "引导页以「药膳助农」「智能定制」「百科全书」三步叙事，让用户在进入 App 前即感受到药食同源与乡村振兴的核心理念。",
          "界面展示涵盖首页、百科、圈子、帮扶等主要场景，呈现完整的移动端产品体验。",
        ],
        media: { type: "image", src: "/works/shiyuan/05.png", alt: "食援 引导页与界面展示" },
      },
      {
        body: [
          "效果展示汇总了 App 在真实场景中的视觉呈现，涵盖手持设备 mockup、文创周边与多场景界面组合，呈现食援品牌的完整落地效果。",
        ],
        media: { type: "image", src: "/works/shiyuan/06.png", alt: "食援 效果展示" },
      },
    ],
  },
  shuxiang: {
    slug: "shuxiang",
    title: "蜀香",
    subtitle: "四川非遗酒文化数字化平台",
    heroImage: "/works/shuxiang/01.png",
    client: "创新设计课程作品",
    scope: "产品设计 / UI 设计 / VR 体验",
    release: "2025",
    credits: DEFAULT_CREDITS,
    intro:
      "蜀香是介绍四川非遗酒文化的数字化平台，融合旅游、文化、科普与社交。通过 VR 数字导览、线上购票、酒文化科普与圈子等功能，让用户更深刻地了解蜀地非遗酒文化。",
    sections: [
      {
        heading: "从需求洞察到产品结构，搭建非遗酒文化数字体验框架",
        body: [
          "围绕老酒客与年轻文化爱好者两类典型用户，梳理「学习—交流—分享」核心诉求。产品以旗亭、翠屏、雅集、简策四大模块组织信息，分别承载快捷入口、非遗专题、酒圈社交与个人中心。",
        ],
        media: { type: "image", src: "/works/shuxiang/01.png", alt: "蜀香 产品概述与需求分析" },
      },
      {
        heading: "标志、插图与 IP，让非遗酒文化有温度、有记忆点",
        body: [
          "标志将酒坛与「蜀」字结合，传递非遗酒文化与古蜀文明的融合。插图以宜宾翠屏大观楼夜景营造地域文化氛围；IP「酒墩墩」延续酒坛造型，延展至文创周边，增强品牌亲和力。",
        ],
        media: { type: "image", src: "/works/shuxiang/02.png", alt: "蜀香 标志与 IP 设计" },
      },
      {
        heading: "字体、配色与图标体系，统一新中式视觉语言",
        body: [
          "以苹方与博洋柳体建立层级分明的字体规范；配色选用酒红、赭石与米白等传统色系。图标融合旗亭、古书、剪纸纹样等元素，在金刚区与标签栏保持一致的戏曲红调性。",
        ],
        media: { type: "image", src: "/works/shuxiang/03.png", alt: "蜀香 设计规范" },
      },
      {
        heading: "以「品酒五步骤」构建引导页叙事",
        body: [
          "引导页以静心、观色、闻香、品味、感悟五步品酒流程为概念，用大面积酒红曲线与留白营造仪式感，让用户在进入 App 前即感受到非遗酒文化的沉浸氛围。",
        ],
        media: { type: "image", src: "/works/shuxiang/04.png", alt: "蜀香 引导页设计" },
      },
      {
        heading: "四大一级页面，覆盖逛、学、聊、我的完整路径",
        body: [
          "旗亭聚合快捷入口与精品推荐；翠屏呈现非遗专题与游玩路线；雅集打造酒圈社交 feed；简策提供个人权益与常用功能。各页在统一视觉规范下保持模块清晰、路径简短。",
        ],
        media: { type: "image", src: "/works/shuxiang/05.png", alt: "蜀香 一级页面" },
      },
      {
        body: [
          "以下为蜀香 App 核心界面总览，涵盖引导、首页、发现、社区、个人中心等主要场景，呈现完整的移动端产品体验。",
        ],
        media: { type: "image", src: "/works/shuxiang/06.png", alt: "蜀香 界面总览" },
      },
    ],
  },
  yidirenjian: {
    slug: "yidirenjian",
    title: "一地人间",
    subtitle: "中国人的土地情感 · 农业记忆长卷",
    heroImage: "/works/yidirenjian/01.png",
    heroVideo: "/works/yidirenjian/yidirenjian.mp4",
    client: "文化叙事设计作品",
    scope: "网页设计 / 交互叙事 / 视觉设计",
    release: "2025",
    credits: DEFAULT_CREDITS,
    intro:
      "本网页以「中国人的土地情感」为叙事核心，构建一部跨越时空的农业记忆长卷。融合传统与现代视觉语言，借助互动体验与可视化技术，呈现农业发展轨迹，唤醒用户与泥土相连的情感记忆。",
    sections: [
      {
        heading: "种的是粮，连的是根",
        body: [
          "从河南大饥荒的历史记忆到智慧农业的当代图景，作品以「根·起源」「苦·共生」「新·生长」三条叙事脉络，串联农业发展、政策支持、新农人与土地情感，构建可交互的文化叙事体验。",
        ],
        media: { type: "image", src: "/works/yidirenjian/02.png", alt: "一地人间 设计说明与产品架构" },
      },
      {
        heading: "特色界面 · 灾年记忆与土地共生",
        body: [
          "「灾年记忆」以碎裂玻璃隐喻历史创伤，点击进入粮荒岁月；「川甘大饥荒」以旧报纸版式呈现史料；「等枝芽·成繁花」以双手接芽象征新农人接过时代种子，滚动叙事串联人与土地的情感纽带。",
        ],
        media: { type: "image", src: "/works/yidirenjian/03.png", alt: "一地人间 特色界面 · 灾年记忆" },
      },
      {
        heading: "特色界面 · 农业变迁与土地记忆",
        body: [
          "「农业变迁」以时间轴呈现四阶段农具演变；「土地记忆拼图」以拼图交互唤醒农耕记忆；「一票一饭」科普粮票历史；「耕织图」以画卷式横向滚动展现传统耕织场景。",
        ],
        media: { type: "image", src: "/works/yidirenjian/04.png", alt: "一地人间 特色界面 · 农业变迁" },
      },
    ],
  },
  "mahui-studio": {
    slug: "mahui-studio",
    title: "码绘工作室",
    subtitle: "工作室品牌门户 · Web 平台设计",
    heroImage: "/works/mahui/01.png",
    client: "码绘技术工作室",
    scope: "官网设计 / 品牌视觉 / 移动端适配",
    release: "2025",
    website: "#",
    credits: [
      { role: "UI 组负责人", name: "付云椒" },
      { role: "交互设计", name: "付云椒" },
      { role: "视觉设计", name: "付云椒" },
      { role: "前端协作", name: "码绘技术团队" },
    ],
    intro:
      "码绘技术工作室官网是集工作室展示、技术培养、竞赛活动、产品发布与简历投递于一体的 Web 平台。以深蓝与黑白为主调，传递专业、创新、年轻的品牌气质，并同步完成移动端适配。",
    sections: [
      {
        heading: "从引导登录到全站模块，构建完整品牌门户",
        body: [
          "引导与登录页以指纹动效与几何图形建立科技感知；技术培养、竞赛与项目开发模块以 3D 球体与编号列表呈现工作室核心能力。",
          "活动页展示线下课堂与新闻动态；Framework 与 Score 以行星轨迹与雷达图可视化组织架构与技能维度；产品页、移动端视图与简历投递页覆盖访客了解、成果展示与人才招募的完整路径。",
        ],
        media: { type: "image", src: "/works/mahui/01.png", alt: "码绘工作室官网设计展示" },
      },
    ],
  },
  "scbank-survey": {
    slug: "scbank-survey",
    title: "SCBANK SURVEY",
    subtitle: "四川银行后台管理系统",
    heroImage: "/works/scbank/01.png",
    client: "四川银行（课程 / 竞赛项目）",
    scope: "B 端后台 / 原型设计 / 交互设计",
    release: "2024 — 2025",
    credits: [
      { role: "产品策划", name: "付云椒" },
      { role: "交互设计", name: "付云椒" },
      { role: "界面设计", name: "付云椒" },
    ],
    intro:
      "面向银行内部运营场景的后台管理系统，整合客户意见收集、问卷调研、留言自动分发与处理进度追踪等能力。以舒适、高效、简约为情绪版设计导向，帮助提升服务效率与客户体验。",
    sections: [
      {
        heading: "布局、配色与组件，建立统一的 B 端设计体系",
        body: [
          "以 1440px 画布、200px 侧栏与 24 栏栅格构建清晰的信息架构；主题色蓝 #4D6DFF 与辅助色 #FFB85C 搭配成功、信息、警示等功能色。",
          "图标提供线性、面性与双色三种样式；按钮、分页、输入框、日期选择、开关与下拉等基础组件规范完整，保障多模块界面的一致性。",
        ],
        media: { type: "image", src: "/works/scbank/02.png", alt: "四川银行后台 设计规范" },
      },
      {
        heading: "从精准原型到高保真界面",
        body: [
          "精准原型阶段严格把控组件布局与弹窗逻辑，以流程图串联问卷管理、统计分析、权限与账号等核心模块，满足 UX 规范并便于评审迭代。",
          "高保真界面涵盖仪表盘数据可视化、列表筛选与分页、用户管理、表单弹窗等典型 B 端场景，在统一视觉语言下呈现完整产品体验。",
        ],
        media: { type: "image", src: "/works/scbank/03.png", alt: "四川银行后台 原型与高保真" },
      },
    ],
  },
  yunyacun: {
    slug: "yunyacun",
    title: "崖上的希望·云崖村扶贫纪实",
    subtitle: "悬崖村脱贫攻坚 · 数字叙事设计",
    heroImage: "/works/shiyuan/04.png",
    client: "乡村振兴主题作品",
    scope: "视觉叙事 / 网页设计 / 信息设计",
    release: "2025",
    credits: DEFAULT_CREDITS,
    intro:
      "作品聚焦四川大凉山悬崖村，见证「藤梯变钢梯」、从茅草屋到小康楼房、从贫瘠到特色农业旅游的云端巨变，以数字叙事传递脱贫攻坚的时代记忆。",
    sections: [
      {
        heading: "用视觉叙事记录悬崖村的时代变迁",
        body: [
          "以时间轴与对比影像为核心叙事结构，强化「_before / after_」的视觉冲击。大幅留白与庄重排版传递对土地与变革的尊重。",
        ],
        media: { type: "image", src: "/works/shiyuan/04.png", alt: "崖上的希望 主视觉" },
      },
      {
        body: [
          "数据可视化与人物故事穿插其中，避免单一煽情。整体色调从苍凉转向温暖，呼应「希望」主题。",
        ],
        media: { type: "image", src: "/works/shiyuan/05.png", alt: "崖上的希望 叙事页" },
      },
    ],
  },
  shanxiaoyang: {
    slug: "shanxiaoyang",
    title: "膳小羊",
    subtitle: "中医药膳助农平台 IP · 文化传承与城乡联结",
    heroImage: "/works/shanxiaoyang/01.png",
    client: "食援项目 IP 设计",
    scope: "IP 设计 / 角色设定 / 视觉延展",
    release: "2026",
    credits: DEFAULT_CREDITS,
    intro:
      "膳小羊是食援平台的 IP 形象，以「羊」谐音「阳」传递传统养生智慧，担任中医药膳文化与乡村农户之间的善意联结者。造型借鉴汉代陶俑羊的圆润体态，以药草绿为主色调，温润谦和地承载药膳科普与助农好物甄选。",
    sections: [
      {
        heading: "三视图与表情包，建立可延展的角色资产",
        body: [
          "正面、侧面与背面三视图规范角色比例与细节，配色以米白、浅蓝、朱红与深棕构成识别体系。",
          "六款表情包覆盖打招呼、休息、比心、委屈、加油与欢呼等情绪，适配 App 空状态、互动反馈与社交传播场景。",
        ],
        media: { type: "image", src: "/works/shanxiaoyang/02.png", alt: "膳小羊 三视图与表情包" },
      },
      {
        heading: "场景延展与文创周边",
        body: [
          "插画场景涵盖药材甄选、药膳烹煮与茶舍阅读等叙事画面，强化「药食同源」与田园疗愈氛围。",
          "周边延展至购物袋、纸杯、餐具、手机壳与贴纸等物料， slogan「药膳为桥，乡村共富，健康同享」贯穿品牌触点。",
        ],
        media: { type: "image", src: "/works/shanxiaoyang/03.png", alt: "膳小羊 场景延展与周边" },
      },
      {
        body: [
          "宣传海报与横幅将 IP 与轻食、低卡、新鲜等关键词结合，形成统一的线下与线上视觉输出；感谢页以大幅角色插画收尾，强化品牌记忆点。",
        ],
        media: { type: "image", src: "/works/shanxiaoyang/04.png", alt: "膳小羊 品牌海报与应用" },
      },
    ],
  },
}

/** Flat ordered list of portfolio items (page 1). */
export function getWorksList(): WorksPageItem[] {
  return WORKS_PAGE_DATA.flat()
}

export function getWorkDetail(slug: string): WorkDetail | undefined {
  return WORK_DETAIL_BY_SLUG[slug]
}

export function getAdjacentWorks(slug: string): {
  prev: WorksPageItem | null
  next: WorksPageItem | null
  current: WorksPageItem | null
} {
  const list = getWorksList()
  const index = list.findIndex((w) => w.slug === slug)
  if (index < 0) return { prev: null, next: null, current: null }
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
    current: list[index],
  }
}
