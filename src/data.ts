export const profile = {
  name: "付云椒",
  role: "AI 复合型产品经理 / 产品设计师",
  heroTitle: "AI 产品经理",
  heroSubtitle: "产品设计师",
  slogan: "我不是在展示作品，我在展示一个持续成长的 AI 产品创造者。",
  description:
    "聚焦产品设计、复杂业务与 AI 工具融合落地，能独立完成从需求定义、方案设计到网页上线的全链路交付。",
  email: "hello@example.com",
  wechat: "your_wechat_id",
  github: "https://github.com/yourname",
  resumeUrl: "/resume.pdf",
  portfolioUrl: "/resume.pdf",
  currentStatus: "成都锦城学院 · 数字媒体技术（产品设计 / UI 方向）",
  previous: ["成都四方伟业", "码绘技术工作室 UI 组"],
  brandClosing:
    "Let’s Build Something Together. 我相信 AI 正在改变产品创造方式，如果你也对产品、设计与 AI 充满兴趣，欢迎与我交流。",
  targetJobs: ["AI 产品实习", "产品经理实习", "产品设计实习"],
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
            "专业成绩：专业前 10%",
            "主修课程涵盖 UI 设计、图形图像处理、数据库、Web 前端开发与面向对象程序设计。",
          ],
        },
        {
          title: "码绘技术工作室 UI 组负责人",
          period: "2024.11 — 至今",
          points: [
            "建设团队 UI 知识库，编写 40 余篇学习与规范文档。",
            "组织带领团队 30 余人参与竞赛并取得多项成绩。",
            "带领成员完成 3 个项目的原型、界面与交互设计。",
          ],
        },
      ],
    },
  ],
  awards: [
    { name: "数字媒体科技作品及其创意 国赛三等奖", level: "国家级", year: "2025" },
    { name: "数字媒体科技作品及其创意 省赛二等奖", level: "省级", year: "2025" },
    { name: "未来设计师全国高校设计大赛 四川赛区一等奖", level: "省级", year: "2025" },
    { name: "第十九届大学生创新创业大赛 金奖", level: "省级", year: "2025" },
  ],
}

export const notebookNav = [
  { id: "about" as const, label: "about" },
  { id: "work" as const, label: "Work" },
  { id: "connect" as const, label: "Connect" },
]

export const notebook = {
  nameScript: "JACKIE",
  role: "Product Designer",
  headlineMain: "Software should",
  headlineFeel: "feel",
  rotatingEmphasis: ["natural", "honest"],
  location: "Cape Town • GMT +2:00",
  beliefsTitle: "3 things I strongly believe in",
  beliefs: [
    {
      text: "tirelessly pursue clarity.",
      paper: "/notebook/note-lined.png",
      font: "hand" as const,
      className: "notebook-note--lined",
    },
    {
      text: "Software should empower.",
      paper: "/notebook/note-grid.png",
      font: "mono" as const,
      className: "notebook-note--grid",
    },
    {
      text: "Design for moments",
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
    company: "成都四方伟业股份有限公司",
    role: "产品设计实习生",
    period: "2023 — 2024",
    summary: "在企业级 B 端场景中完成需求梳理、交互设计与跨团队协同交付。",
    loop: {
      problem: "复杂业务链路长、角色多，原有界面信息层级混乱，关键流程可用性不足。",
      analysis: "梳理多角色任务流与高频操作路径，定位信息架构与操作反馈的核心断点。",
      solution:
        "重构后台信息架构并输出高保真交互方案，建立关键页面组件规范，协同研发推进实现。",
      result: "缩短关键任务路径，提升业务功能可理解性，支撑多轮版本迭代稳定交付。",
    },
    gains: ["复杂业务抽象能力", "跨团队协作推进能力", "产品闭环思维与价值判断"],
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
    desc: "覆盖问卷创建、发放、回收与数据分析的企业级后台系统。",
    loop: "问题：流程复杂且反馈不清晰；方案：重构任务路径与页面信息层级；结果：提升高频操作效率。",
    tags: ["B端", "金融", "后台管理"],
  },
  {
    category: "B端" as ProjectCategory,
    title: "西南交通大学工位管理系统",
    desc: "面向高校实验室的工位预约与资源调度平台。",
    loop: "问题：预约冲突与信息分散；方案：统一预约规则并可视化资源状态；结果：提高空间利用率与管理效率。",
    tags: ["B端", "预约系统", "资源调度"],
  },
  {
    category: "B端" as ProjectCategory,
    title: "码绘技术工作室空间管理系统",
    desc: "工作室空间与设备的数字化管理方案。",
    loop: "问题：空间资源登记与使用追踪低效；方案：建立统一操作台与可追溯记录；结果：降低管理成本。",
    tags: ["B端", "空间管理", "流程优化"],
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
