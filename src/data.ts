export const profile = {
  name: "你的名字",
  role: "AI 复合型产品经理 / 产品设计",
  slogan: "用产品思维连接 AI 能力，让好的体验真正落地。",
  description:
    "我专注于在产品设计、复杂业务逻辑与 AI 工程之间架起桥梁，从需求洞察到全流程交付，打造兼具商业价值与极致体验的数字产品。",
  email: "hello@example.com",
  wechat: "your_wechat_id",
  github: "https://github.com/yourname",
}

export const stats = [
  { value: "12", suffix: "+", label: "交付项目", desc: "B端 / C端 / 创新设计" },
  { value: "2", suffix: "年", label: "AI 实践经验", desc: "AI 工作流与提效落地" },
  { value: "8", suffix: "+", label: "落地经验", desc: "从 0 到 1 完整交付" },
]

export const skillGroups = [
  {
    title: "产品能力",
    items: ["需求洞察", "PRD 撰写", "用户研究", "数据分析", "项目管理", "商业思维"],
  },
  {
    title: "设计能力",
    items: ["交互设计", "原型设计", "信息架构", "设计系统", "可用性测试", "视觉规范"],
  },
  {
    title: "AI 能力",
    items: ["Prompt 工程", "AI 工作流编排", "RAG 应用", "Agent 设计", "模型选型", "AI 提效"],
  },
  {
    title: "技术工具栈",
    items: ["Figma", "Cursor", "Claude / Gemini", "Axure", "SQL", "Vercel"],
  },
]

export const experiences = [
  {
    company: "成都四方伟业股份有限公司",
    role: "产品设计实习生",
    period: "2023 — 2024",
    points: [
      "负责企业级 B 端产品的交互设计与原型搭建，输出高保真设计稿与交互规范。",
      "深度参与需求梳理，将复杂业务逻辑转化为清晰可执行的产品方案。",
      "跟进产品全流程交付，协同研发、测试推动功能上线与迭代优化。",
    ],
    gains: [
      "沉淀了对复杂业务逻辑的拆解与抽象能力。",
      "建立了以商业价值为导向的产品思维框架。",
    ],
  },
]

export type ProjectCategory = "B端" | "创新设计" | "AI工作流"

export const projectTabs: { key: ProjectCategory; label: string }[] = [
  { key: "B端", label: "企业级 B 端项目" },
  { key: "创新设计", label: "创新体验与文化设计" },
  { key: "AI工作流", label: "AI 工作流" },
]

export const projects = [
  {
    category: "B端" as ProjectCategory,
    title: "四川银行问卷后台管理系统",
    desc: "面向金融业务的问卷全生命周期管理平台，覆盖问卷创建、发放、回收与数据分析。",
    tags: ["B端", "金融", "数据可视化"],
  },
  {
    category: "B端" as ProjectCategory,
    title: "西南交通大学工位管理系统",
    desc: "为高校实验室设计的工位预约与资源调度系统，提升空间利用率与管理效率。",
    tags: ["B端", "预约系统", "资源调度"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "一地人间",
    desc: "以人文叙事为核心的文化体验设计，探索地域记忆与情感共鸣的数字表达。",
    tags: ["文化设计", "叙事体验"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "食援",
    desc: "聚焦食物援助场景的公益服务设计，连接捐赠者与需求方的高效体验。",
    tags: ["公益", "服务设计"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "蜀香",
    desc: "传统川味文化的现代化品牌与体验设计，融合地域特色与当代审美。",
    tags: ["品牌", "文化"],
  },
  {
    category: "创新设计" as ProjectCategory,
    title: "云崖村",
    desc: "乡村文旅数字化体验设计，用沉浸式叙事激活在地文化与旅游价值。",
    tags: ["文旅", "沉浸体验"],
  },
]

export const aiWorkflow = [
  { step: "Figma", desc: "设计稿与交互原型", detail: "高保真设计、组件化规范" },
  { step: "Cursor", desc: "AI 辅助编码", detail: "组件生成、逻辑实现" },
  { step: "Gemini / Claude", desc: "AI 协作推理", detail: "方案推演、内容生成、代码审查" },
  { step: "Deploy", desc: "一键部署上线", detail: "Vercel 自动化发布" },
]

export const navItems = [
  { id: "home", label: "首页" },
  { id: "experience", label: "工作经历" },
  { id: "projects", label: "项目作品" },
  { id: "thinking", label: "产品思考" },
  { id: "contact", label: "联系我" },
]

export const thinking = [
  {
    title: "AI 不是替代设计，而是放大判断力",
    desc: "AI 把执行成本降到极低，产品经理的核心价值回归到「判断什么值得做」与「定义好的标准」。",
  },
  {
    title: "复杂业务的本质是抽象能力",
    desc: "B 端产品的护城河在于对业务逻辑的深度理解，把混乱的现实抽象为清晰、可扩展的产品结构。",
  },
  {
    title: "体验是商业的复利",
    desc: "好的体验不是成本，而是长期复利。每一个细节的打磨，都会沉淀为用户的信任与品牌资产。",
  },
]
