export const profile = {
  name: "付云椒",
  role: "产品经理 / UX 设计师",
  age: 22,
  degree: "本科",
  heroTitle: "AI 产品经理",
  heroSubtitle: "产品设计师",
  slogan: "懂产品的设计师，懂 AI 的产品人。",
  description:
    "具备 UI/UX 设计与产品设计复合背景，熟悉需求分析、用户研究、业务逻辑设计与交互设计流程，能独立完成从问题定义到方案输出的全链路工作。",
  email: "3332597354@qq.com",
  phone: "13198317509",
  wechat: "13198317509",
  github: "https://github.com/ifu321123-ui",
  resumeUrl: "/resume.pdf",
  portfolioUrl: "/resume.pdf",
  currentStatus: "成都锦城学院 · 数字媒体技术（产品设计 / UI 方向）",
  previous: ["成都四方伟业（UI 实习生）", "码绘技术工作室 UI 组负责人"],
  brandClosing:
    "Let’s Build Something Together. 我相信 AI 正在改变产品创造方式，如果你也对产品、设计与 AI 充满兴趣，欢迎与我交流。",
  targetJobs: ["产品经理", "UX 设计", "AI 产品"],
}

export const about = {
  positioning:
    "AI 时代的复合型产品人，擅长在设计、产品与 AI 工程之间穿针引线，让好产品被更快、更好地造出来。",
  advantages: [
    {
      title: "设计 + 产品双栖",
      desc: "既能输出高保真交互与视觉规范，也能拆解复杂业务并沉淀可执行的产品方案。",
    },
    {
      title: "AI 工作流提效",
      desc: "熟练运用 Cursor、Gemini、Claude 进行方案推演与代码协作，缩短从想法到上线的链路。",
    },
    {
      title: "端到端交付力",
      desc: "从洞察、定义、设计到部署，能独立推动 0 到 1 产品落地并持续迭代。",
    },
  ],
  education: [
    {
      school: "成都锦城学院",
      major: "数字媒体技术",
      period: "2023.09 — 2027.06",
      items: [
        {
          title: "专业学习",
          period: "2023.09 — 至今",
          points: [
            "专业成绩：专业前 10%。",
            "主修课程涵盖 UI 设计、Web 前端网页设计与开发、软件工程、数字音视频处理、图形图像处理、数据库、设计概论、面向对象程序设计、PR / AE / PS / AI 等。",
          ],
        },
        {
          title: "码绘技术工作室 UI 组负责人",
          period: "2024.11 — 至今",
          points: [
            "资源整理：建设团队 UI 方向知识库，编写团队整体学习规划文档 40 余篇。",
            "团队管理：组织带领团队 30 余人参加国际、国家级竞赛并取得优异成绩。",
            "项目参研：带领团队成员开发项目，完成原型、界面及交互设计工作 3 项。",
          ],
        },
      ],
    },
  ],
  awards: [
    { name: "数字媒体科技作品及其创意 国赛三等奖", level: "国家级", year: "2025" },
    { name: "数字媒体科技作品及其创意 省赛二等奖", level: "省级", year: "2025" },
    { name: "未来设计师全国高校设计大赛 四川赛区一等奖", level: "省级", year: "2025" },
    { name: "第十五届蓝桥杯 四川赛区三等奖", level: "省级", year: "2025" },
    { name: "第十六届蓝桥杯 四川赛区三等奖（3 项）", level: "省级", year: "2025" },
    { name: "大学生农业创意设计大赛 四川省赛区三等奖", level: "省级", year: "2025" },
    { name: "“挑战杯”全国大学生创业大赛 四川赛区三等奖", level: "省级", year: "2025" },
    { name: "“互联网+”大学生创新创业大赛 四川赛区三等奖", level: "省级", year: "2025" },
    { name: "第十九届大学生创新创业大赛 金奖", level: "省级", year: "2025" },
    { name: "ican 大学生创新创业大赛 四川赛区三等奖", level: "省级", year: "2025" },
  ],
}

export const notebookNav = [
  { id: "about" as const, label: "about" },
  { id: "work" as const, label: "Work" },
  { id: "project" as const, label: "Project" },
  { id: "thinking" as const, label: "Thinking" },
  { id: "connect" as const, label: "Connect" },
]

export const notebook = {
  nameScript: "IFU.YUN",
  role: "Product Designer",
  headlineMain: "软件应当",
  headlineFeel: "让人觉得",
  rotatingEmphasis: ["可靠", "真诚", "简单", "自然", "有趣"],
  location: "China • GMT +8:00",
  beliefsTitle: "3 things I strongly believe in",
  beliefs: [
    {
      text: "坚持不懈追求清晰",
      paper: "/notebook/note-lined.png",
      font: "hand" as const,
      className: "notebook-note--lined",
    },
    {
      text: "软件应当赋能于人",
      paper: "/notebook/note-grid.png",
      font: "sans" as const,
      className: "notebook-note--grid",
    },
    {
      text: "为每个瞬间而设计",
      paper: "/notebook/note-sticky.png",
      font: "serif" as const,
      className: "notebook-note--sticky",
    },
  ],
}

export const stats = [
  { value: "12", suffix: "+", label: "项目交付", desc: "B 端 / 创新体验 / 数字叙事" },
  { value: "2", suffix: "年", label: "AI 实践经验", desc: "工作流编排与提效落地" },
  { value: "3", suffix: "分钟", label: "招聘方判断窗口", desc: "快速完成能力与潜力评估" },
]

export const skillGroups = [
  {
    title: "产品能力",
    items: ["需求洞察", "PRD 撰写", "用户研究", "信息架构", "商业思维", "项目管理"],
  },
  {
    title: "设计能力",
    items: ["交互设计", "原型设计", "设计系统", "可用性测试", "视觉规范", "叙事表达"],
  },
  {
    title: "AI 能力",
    items: ["Prompt 工程", "工作流编排", "模型协作", "代码审查", "方案推演", "快速验证"],
  },
  {
    title: "技术工具栈",
    items: ["Figma", "Cursor", "Gemini", "Claude", "Tailwind CSS", "Vercel"],
  },
]

export const experiences = [
  {
    company: "成都四方伟业软件股份有限公司",
    role: "UI 实习生",
    period: "2025.07 — 2025.09",
    project: "深圳盐田国际集智慧口岸建设项目",
    summary:
      "参与 YITC 数字孪生平台建设，通过 3D 渲染 + 3D 模型构建 + 场景构建对港口地形地貌、道路、海域、码头及岸吊、龙门吊、堆场、闸口、集装箱等要素进行三维建构，实现物理世界与数字世界一比一的虚实交融、孪生共存。",
    loop: {
      problem: "传统港口管理依赖经验与人工，态势感知与协同效率不足，亟需数字化与精细化转型。",
      analysis:
        "深入挖掘并精炼业务需求，对接客户态势感知与全程保护诉求，明确数字孪生平台的关键能力边界。",
      solution:
        "担任项目经理助理，负责高保真原型设计直观呈现全程态势感知，输出标准化需求文档及《用户手册》《指标梳理文档》，紧跟研发迭代周期高效推进跨部门协作。",
      result: "助力传统港口实现数字化与精细化管理转型，支撑项目按迭代周期稳定交付。",
    },
    gains: ["数字孪生业务理解", "高保真原型与需求文档输出", "跨部门协作推进能力"],
  },
]

export type ProjectCategory = "B端" | "创新设计"

export const projectTabs: { key: ProjectCategory; label: string }[] = [
  { key: "B端", label: "企业级 B 端项目" },
  { key: "创新设计", label: "创新体验与文化设计" },
]

export const projects = [
  {
    category: "B端" as ProjectCategory,
    title: "四川银行问卷后台管理系统",
    desc: "服务于银行内部人员，为市场调研岗设计客户偏好、产品反馈等问卷，帮助管理层快速获取战略决策所需调研数据的原型设计（B 端）。",
    loop: "问题：流程复杂且反馈不清晰；方案：设计审批与消息管理模块、问卷管理（问卷国际化）、商户机构及按管理角色划分的权限；结果：助力精准决策与业务优化。",
    tags: ["B端", "金融", "后台管理", "2024.11—2025.11"],
  },
  {
    category: "B端" as ProjectCategory,
    title: "西南交通大学工位管理系统",
    desc: "服务于研究生及实验室管理人员的工位申请、审批与管理平台，支持工位分配、工作间管理、在线申请、审批流程及数据可视化（原型、界面设计 · 移动端 / B 端）。",
    loop: "问题：预约冲突与信息分散；方案：按角色设计差异化权限并优化消息通知、工位管理与审批流程；结果：移动端适配，提升操作流畅性与视觉一致性。",
    tags: ["B端", "移动端", "资源调度", "2024.05—2024.11"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "码绘技术工作室官网设计",
    desc: "工作室面向对外展示的重要门户，集工作室展示、文章动态、产品展示与简历投递于一体的 Web 平台（原型、界面设计 · C 端 / 移动端）。",
    loop: "创意概念：打造工作室品牌门户；核心亮点：完整设计流程构建交互体系并按品牌调性做视觉化设计；价值输出：移动端适配，保障操作流畅性与视觉一致性。",
    tags: ["官网", "品牌门户", "C端", "2025.11—至今"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "一地人间",
    desc: "农业文化数字叙事设计，探索地域文化在数字媒介中的表达。",
    loop: "创意概念：在地文化记忆数字化；核心亮点：情境化叙事路径；价值输出：增强用户文化共鸣。",
    tags: ["文化设计", "叙事体验"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "食援",
    desc: "饮食文化疗愈体验设计，连接内容叙事与情感体验。",
    loop: "创意概念：饮食与情绪疗愈结合；核心亮点：可感知互动体验；价值输出：提升公益传播温度。",
    tags: ["文化设计", "服务体验"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "蜀香",
    desc: "川菜文化数字叙事设计，融合传统文化与当代体验。",
    loop: "创意概念：川味文化年轻化表达；核心亮点：多层叙事视觉系统；价值输出：强化地域品牌识别。",
    tags: ["品牌", "文化设计"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "云崖村",
    desc: "乡村振兴主题数字设计，打造乡村文旅内容体验。",
    loop: "创意概念：乡村叙事与文旅场景融合；核心亮点：沉浸式数字内容；价值输出：助力在地文化传播。",
    tags: ["文旅", "数字叙事"],
  },
]

export const briefProjects = [
  { title: "四川银行问卷后台管理系统", type: "原型设计 · B 端", period: "2024.11 — 2025.11" },
  { title: "西南交大工位管理系统", type: "原型、界面设计 · 移动端 / B 端", period: "2024.05 — 2024.11" },
  { title: "码绘技术工作室官网设计", type: "原型、界面设计 · C 端 / 移动端", period: "2025.11 — 至今" },
]

export const aiWorkflow = [
  { step: "Figma", desc: "设计原型", detail: "高保真界面与组件规范沉淀" },
  { step: "Cursor", desc: "代码开发", detail: "快速搭建页面结构与交互逻辑" },
  { step: "Gemini + Claude", desc: "AI 辅助优化", detail: "方案推演、文案生成、代码审查" },
  { step: "Deploy", desc: "项目上线", detail: "持续发布与迭代验证" },
]

export const aiWorkflowChapters = [
  {
    index: "01",
    stage: "需求规划",
    name: "Gemini / Claude",
    role: "先用 AI 推演需求边界，再用产品判断做取舍，明确优先级与验证路径。",
    learnt:
      "把模糊问题拆解成可验证的小问题，利用多模型并行给出备选方案，再由自己做标准化判断。",
    works: ["需求拆解", "竞品信息检索", "PRD 草稿", "方案对比"],
    highlight: "需求定义阶段效率提升约 3 倍，显著减少前期返工。",
  },
  {
    index: "02",
    stage: "视觉交互",
    name: "Figma",
    role: "把方案沉淀为可复用的组件与交互原型，保证体验一致性与协作效率。",
    learnt:
      "先建立组件规范再做页面扩展，让每一次新增需求都可复用已有设计资产。",
    works: ["高保真界面", "交互原型", "组件规范", "设计走查"],
    highlight: "组件复用让同类页面设计时间缩短约 50%。",
  },
  {
    index: "03",
    stage: "开发实现",
    name: "Cursor",
    role: "通过 vibecoding 方式把设计稿快速落地为可交互页面与可维护组件。",
    learnt:
      "保持‘小步提交 + 快速验证’节奏，让 AI 辅助编码服务于清晰结构而不是堆砌代码。",
    works: ["页面搭建", "组件抽象", "交互实现", "重构调优"],
    highlight: "从设计到可运行页面压缩到小时级，支持独立 0 到 1 交付。",
  },
  {
    index: "04",
    stage: "上线迭代",
    name: "Deploy",
    role: "提交即预览，一键发布，持续收集反馈并进行迭代优化。",
    learnt:
      "把上线当成日常动作而不是阶段终点，快速完成‘发布-反馈-优化’短循环。",
    works: ["自动化部署", "预览验收", "迭代发布", "体验优化"],
    highlight: "显著降低验证成本，让想法更快被市场与招聘方验证。",
  },
]

export const navItems = [
  { id: "home", label: "首页" },
  { id: "experience", label: "工作经历" },
  { id: "projects", label: "项目作品" },
  { id: "thinking", label: "产品思考" },
  { id: "contact", label: "联系我" },
]
