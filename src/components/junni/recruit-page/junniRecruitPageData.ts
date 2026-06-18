const JUNNI = "https://junni.co.jp"

export const RECRUIT_PAGE_TITLE = "实习经历"

export const RECRUIT_THEME_MOBILE = "理解需求驱动产品落地"
export const RECRUIT_THEME_DESKTOP = ["理解需求", "驱动产品落地"] as const

export const RECRUIT_MESSAGE_CHARS =
  "参与盐田国际智慧港口数字孪生平台建设期间，我负责客户需求对接、业务指标梳理、产品原型设计及项目协同工作。围绕全域态势感知、智慧告警等核心业务场景，连接客户、产品与研发团队，推动需求从沟通讨论走向实际落地，助力港口数字化与智能化升级。"

export const RECRUIT_SPECIAL = {
  title: "成都四方伟业软件股份有限公司\n领先的大数据、人工智能产品及服务提供商",
  image: "/works/shiyuan/01.png",
  imageAlt: "四方伟业 · 数字孪生智能平台",
  text: "四方伟业（SEFONSOFT）总部位于成都，是一家专注大数据与人工智能领域的软件产品及服务提供商。公司以自主研发的数字孪生智能平台、可视化分析决策平台等核心产品，为超过1500家政府机构及企事业单位提供数据智能解决方案，业务覆盖智慧城市、交通、能源等多个行业，服务延伸至全球数十个国家和地区。",
  link: "https://www.sefonsoft.com/",
} as const

export const RECRUIT_POSITIONS = [
  {
    label: "Planner",
    href: "https://herp.careers/v1/junni/requisition-groups/817c6f85-7c0e-4b37-bb02-fd9989fffe76",
    letter: "P",
  },
  {
    label: "Web Director",
    href: "https://herp.careers/v1/junni/requisition-groups/6c0a48b2-97f0-49b9-9957-a2f209bfa5e8",
    letter: "W",
  },
  {
    label: "Designer",
    href: "https://herp.careers/v1/junni/requisition-groups/3b39d6ab-a712-40de-aa58-6c03733c028a",
    letter: "D",
  },
  {
    label: "Engineer",
    href: "https://herp.careers/v1/junni/requisition-groups/83f08bdc-85a2-4461-a153-067f2af759fe",
    letter: "E",
  },
  {
    label: "Back Office",
    href: "https://herp.careers/v1/junni/requisition-groups/bffcc04c-4a2e-45e3-939d-1c9cbb34cd18",
    letter: "B",
  },
] as const

export const RECRUIT_JOIN_US = "https://herp.careers/v1/junni"

export const RECRUIT_PITCH = {
  iframe: "https://speakerdeck.com/player/926606fedafd4ec485919212581f1e34",
  text: "ジュニの理念や価値基準などジュニの情報を簡潔にまとめた採用ピッチ資料です。ジュニに興味をお持ちの方は是非一度ご覧ください。",
} as const

export type RecruitProjectSlide = {
  image: string
  imageAlt: string
  title: string
  text: string
}

/** 实习项目轮播：图片与文案一一对应，后续可替换为真实项目截图 */
export const RECRUIT_PROJECT_SLIDES: RecruitProjectSlide[] = [
  {
    image: "/works/yantian/01.png",
    imageAlt: "盐田港数字孪生平台 · 全域态势感知",
    title: "盐田港数字孪生平台",
    text: "面向盐田国际集装箱码头的大型港口数字孪生可视化系统，通过三维重构与数据大屏，实现港口全域态势感知、智能监管与智慧告警，助力传统港口完成数字化、精细化管理转型。",
  },
  {
    image: "/works/yantian/02.png",
    imageAlt: "客户需求对接 · 每周汇报演示会议",
    title: "客户需求对接与需求转化",
    text: "作为需求接口人，参与每周汇报演示会议，与项目经理一同对接盐田港客户。会后 24 小时内将客户提出的问题与优化点整理成标准化需求清单，明确内容、优先级与影响范围，把业务语言翻译成研发能理解的产品语言。",
  },
  {
    image: "/works/yantian/03.png",
    imageAlt: "智慧告警 · 危险品总览 · 数字孪生原型界面",
    title: "高保真原型设计与模块迭代",
    text: "负责智慧告警、危险品总览等核心业务模块的原型设计与切图工作。从用户视角出发，以直观的界面逻辑推演大型港口数字化转型的交互路径，跟进 demo 迭代，确保每次交付对应解决客户核心诉求。",
  },
  {
    image: "/works/yantian/04.png",
    imageAlt: "岸吊 · 龙门吊 · 集装箱指标梳理文档",
    title: "业务指标对齐与核对",
    text: "与甲方对齐岸吊、龙门吊、出入车辆、集装箱等数据指标，将合作方指标清单与功能清单逐项核对审查，区分完成与未完成项并标注，确保原型图上每一项指标准确可靠。",
  },
  {
    image: "/works/yantian/05.png",
    imageAlt: "用户手册 · 指标文档 · PPT 与 Excel 输出",
    title: "项目文档输出与知识沉淀",
    text: "输出《用户手册》与《指标文档》，沉淀项目知识体系。用户手册帮助客户快速上手平台操作，指标文档系统梳理业务指标名称与数据来源，为研发团队与客户建立统一的业务认知基准。",
  },
]

export const RECRUIT_TVCM = {
  youtube: "https://www.youtube.com/embed/EnyUkPlSATI?si=2k15RQgcUx_amOXh&controls=0",
} as const

export const RECRUIT_INTERVIEWS = [
  {
    member: "Designer / Fukasawa",
    num: "#3",
    image: `${JUNNI}/assets/images/recruit/interview/3.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/290039",
    heading: "ジュニの中の人インタビュー #3",
    title: "「こんなに楽しい仕事って他にない」",
  },
  {
    member: "Frontend Engineer / Nakamura",
    num: "#7",
    image: `${JUNNI}/assets/images/recruit/interview/7.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/313627",
    heading: "ジュニの中の人インタビュー #7",
    title: "「思いを知ることがモチベーションになる。」",
  },
  {
    member: "Backend Engineer / Hashimoto",
    num: "#11",
    image: `${JUNNI}/assets/images/recruit/interview/11.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/340145",
    heading: "ジュニの中の人インタビュー #11",
    title: "「宮崎⇆東京でエンジニアと神主、どちらも本業として妥協しない働き方」",
    titleHtml: true,
  },
  {
    member: "Web Director / Takahashi",
    num: "#13",
    image: `${JUNNI}/assets/images/recruit/interview/13.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/546103",
    heading: "ジュニの中の人インタビュー #13",
    title: "「クライアントの熱い想いを受け止め、期待を超え続けたい」",
  },
] as const

export const RECRUIT_WANTEDLY = "https://www.wantedly.com/companies/junni"
export const RECRUIT_WANTEDLY_LOGO_FRONT = `${JUNNI}/assets/images/recruit/wantedly_front.svg`
export const RECRUIT_WANTEDLY_LOGO_BACK = `${JUNNI}/assets/images/recruit/wantedly_back.svg`
export const RECRUIT_FOOTER_LOGO = `${JUNNI}/assets/images/footer_logo.svg`

export const RECRUIT_FOOTER_NAV = [
  { label: "TOP", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORKS", href: "/works" },
  { label: "SERVICE", href: "/service" },
  { label: "RECRUIT", href: "/recruit" },
  { label: "CONTACT", href: null },
] as const

export const RECRUIT_SNS = [
  { label: "X", href: "https://twitter.com/junni_jp" },
  { label: "facebook", href: "https://www.facebook.com/junni.jp" },
  { label: "Instagram", href: "https://www.instagram.com/junni_jp/?hl=ja" },
  { label: "note", href: "https://note.com/junni_jp" },
] as const
