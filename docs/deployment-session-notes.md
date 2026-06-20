# 部署与上线 — 对话整理笔记

> 整理时间：2026-06-20  
> 项目仓库：[ifu321123-ui/ifuyun](https://github.com/ifu321123-ui/ifuyun)  
> 线上地址：**https://ifuyun.pages.dev**

---

## 1. 项目概况

| 项 | 说明 |
|---|---|
| 技术栈 | Vite 8 + React 19 + TypeScript + Tailwind CSS v4 |
| 类型 | 纯静态 SPA（无后端、无数据库） |
| 路由 | Hash 路由（如 `/#/experience`），无需服务端 rewrite |
| 构建产物 | `dist/` 目录 |
| 本地命令 | `npm run dev` / `npm run build` / `npm run preview` |

**结论：不需要买云服务器**，只需静态托管 +（可选）自定义域名。

---

## 2. 部署方案（已实施）

### 2.1 托管平台

选用 **Cloudflare Pages**（免费 CDN + HTTPS + 全球访问）。

- 项目名称：`ifuyun`
- 正式 URL：`https://ifuyun.pages.dev`
- Cloudflare 账号：`ifu321123@gmail.com`
- Account ID：`ab0adaa8dc22155dbb60d4fe613a3627`

### 2.2 仓库内相关文件

```
wrangler.toml                          # Cloudflare Pages 配置
vercel.json                            # 备用（Vercel 一键部署）
public/_headers                        # CDN 缓存与安全头
.github/workflows/deploy-cloudflare-pages.yml  # GitHub Actions 自动部署（需配置 Secrets）
package.json                           # scripts.deploy、engines.node >= 20
src/lib/scrollEnv.ts                   # 手机/桌面滚动与动效策略
```

### 2.3 常用命令

```bash
# 本地开发
npm install
npm run dev

# 本地验证构建
npm run build
npm run preview

# 手动部署到 Cloudflare（需本机 wrangler 已登录）
npm run deploy
```

### 2.4 首次部署过程摘要

1. `npm run build` 验证通过  
2. `npx wrangler login` 完成 OAuth  
3. `npx wrangler pages project create ifuyun`  
4. 遇到 **`interactive.mp4` 超过 25MB**（Cloudflare 单文件上限）→ 用 ffmpeg 压缩至约 4.8MB 后重新部署  
5. 后续 push + `npm run deploy` 更新线上

### 2.5 GitHub Actions 自动部署（可选，未完全配置）

Workflow 已写入 `.github/workflows/deploy-cloudflare-pages.yml`，需在 GitHub 仓库 **Settings → Secrets** 添加：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`（见上文）

---

## 3. 域名相关讨论

### 3.1 免费 vs 买域名

| | 免费 `ifuyun.pages.dev` | 自定义域名（如 `.com`） |
|---|---|---|
| 费用 | 0 | 约 ¥80/年 |
| 网站内容 | 完全相同 | 完全相同 |
| 是否需要服务器 | 都不需要 | 都不需要 |
| 专业感 | 一般 | 更好（简历推荐） |
| 稳定性（CDN） | 基本相同 | 基本相同 |

**当前选择**：先用免费地址 `ifuyun.pages.dev` 分享给面试官。

### 3.2 域名购买建议（若后续购买）

- **首选 `.com`**（约 83 元/年），最通用、最正式  
- 不推荐仅为省钱买 `.online`、`.icu` 等  
- `.cn` 在国内常与备案绑定；当前 Cloudflare 海外托管一般**不需备案**  
- 买完后在 Cloudflare Pages → Custom domains 绑定即可  

---

## 4. 访问与稳定性

### 4.1 访客体验

- **无需登录**，任何人打开链接即可访问  
- 分享链接：`https://ifuyun.pages.dev`（务必带 `https://`）  
- 建议用 Chrome / Safari 打开；微信内置浏览器偶有问题，可复制到系统浏览器  

### 4.2 国内访问注意

- Cloudflare `*.pages.dev` 在国内**多数能开**，但速度/稳定性因运营商而异  
- 已移除 **Google Fonts**（国内常被墙，会导致长时间白屏/加载条）  
- 若长期面向国内用户且要求极稳，可考虑：买域名 + 国内 CDN + ICP 备案（流程更长）  

---

## 5. 手机端问题与修复（重要）

### 5.1 用户反馈现象

- 手机打开后「一直加载进入，加载成功又开始加载进入」  
- 类似循环进入 / 动画重播 / 顶部加载条反复出现  

### 5.2 原因分析

1. **Lenis 平滑滚动 + GSAP ScrollTrigger** 在 iOS/安卓上与地址栏伸缩冲突，滚动位置被反复拉回顶部，scrub 动画从头播放  
2. **Google Fonts** 在国内阻塞，延长「加载中」感知  
3. 首页重型动效：JunniHero 翻面、GunzeTransition（320vh）、JunniWorks WebGL 3D 圆筒  
4. 首次挂载时 `useScrollToTopOnRoute` 曾不必要地 `scrollTo(0)`  

### 5.3 已实施修复（`src/lib/scrollEnv.ts`）

**手机/触摸设备（`hover: none` + `pointer: coarse`）**：

| 能力 | 手机 | 桌面 |
|---|---|---|
| Lenis 平滑滚动 | 关闭，原生滚动 | 开启 |
| ScrollTrigger scrub 动画 | 关闭 | 开启 |
| IntroFlip 全屏入场 | 跳过 | 保留 |
| JunniHero | 固定首屏 KV，不滚动翻面 | 完整翻面 |
| GunzeTransition | 静态展示文案（`apply(0.72)`） | 完整滚动动画 |
| JunniWorks WebGL | 关闭，静态列表 | 3D 圆筒 |
| resize 时 ScrollTrigger.refresh | 关闭 | 保留 |
| `html.touch-static` CSS 类 | 缩短 hero/gunze/works 滚动高度 | — |

**其他**：

- 去掉 `index.html` 中 Google Fonts，改用系统字体栈  
- `interactive.mp4` 压缩以满足 Cloudflare 25MB 限制  

### 5.4 测试建议

1. **完全关闭标签页**后重新打开（不要只刷新）  
2. 或使用**无痕模式**  
3. 微信内打开有问题时 → 复制链接到 Safari/Chrome  
4. 部署后若仍见旧版 → 清缓存或等 CDN 数分钟  

---

## 6. 页面标题修改（已完成）

- **修改前**：`个人品牌 · AI 复合型产品经理`  
- **修改后**：`付云椒的个人网站`  
- **位置**：`index.html` 的 `<title>`（浏览器/微信顶栏显示）  
- 已部署至线上  

---

## 7. 当前 Git 状态参考

主要相关 commit（从新到旧）：

- 页面标题改为「付云椒的个人网站」（本地可能未 commit，已 deploy）  
- `660dc16` — 手机端关闭 scroll-scrub / WebGL  
- `fbe5635` — 手机 Lenis + 去 Google Fonts  
- `175afb8` — 压缩 shiyuan 视频  
- `5c2667a` — GitHub Actions + deploy 脚本  
- `76eb861` — wrangler / vercel / _headers 初始部署配置  

---

## 8. 新对话可继续探讨的方向

- [ ] 手机端问题是否已完全解决（需用户反馈：微信 / Safari / Chrome）  
- [ ] 配置 GitHub Actions Secrets，实现 `git push` 自动部署  
- [ ] 购买 `.com` 并绑定 Cloudflare Custom Domain  
- [ ] 国内访问优化（备案 + 阿里云/腾讯云 CDN）  
- [ ] 首屏 JS 体积优化（当前 bundle ~960KB）  
- [ ] 微信分享卡片（Open Graph / 微信 JS-SDK 需备案域名）  

---

## 9. 关键链接

| 用途 | URL |
|---|---|
| 线上站点 | https://ifuyun.pages.dev |
| GitHub 仓库 | https://github.com/ifu321123-ui/ifuyun |
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Pages 项目 | https://dash.cloudflare.com → Workers & Pages → ifuyun |

---

## 10. 给新对话的上下文提示（可直接复制）

```
我在做个人作品集网站 vibecoding_web，已部署到 https://ifuyun.pages.dev（Cloudflare Pages）。
仓库：ifu321123-ui/ifuyun，构建命令 npm run build，输出 dist/。
手机端曾因 Lenis+ScrollTrigger 导致反复「加载进入」，已在 touch 设备关闭 scrub/WebGL（见 src/lib/scrollEnv.ts）。
页面标题已改为「付云椒的个人网站」。尚未购买自定义域名。
请阅读 docs/deployment-session-notes.md 后继续帮我……
```
