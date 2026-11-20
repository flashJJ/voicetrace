# VoiceTrace · 声迹

> **English name:** VoiceTrace\
> **中文名:** 声迹 · 方言故事书\
> **GitHub:** https://github.com/flashJJ/voicetrace\
> **Repo:** `voicetrace`\
> 最后更新：2026-11-17\
> 比赛周期：2026-11-10 至 2026-12-06\
> 报名截止：2026-11-23 23:59（北京时间）\
> 当前状态：3 种模式 / 28 个互动故事 / 17 个儿童故事 / 164 条资料库 / 3 段署名真人粤语示例 / 8 个黄金样品 / 8 项自动检查

[![Deploy demo to GitHub Pages](https://github.com/flashJJ/voicetrace/actions/workflows/pages.yml/badge.svg)](https://github.com/flashJJ/voicetrace/actions/workflows/pages.yml)

## 在线演示

- **GitHub Pages（静态演示）**：https://flashjj.github.io/voicetrace/
- 静态版包含：`/demo`、`/stories`、`/kids`、`/library`、`/map`、`/record`、`/archive`、`/about`
- `/studio` 的在线生成需要服务端，GitHub Pages 静态版会提示去 `/demo` 看预生成故事；完整生成版请本地运行或部署到 Vercel

## CI / 部署

- push 到 `main` → GitHub Actions 自动构建静态版并部署到 GitHub Pages
- 工作流：[`.github/workflows/pages.yml`](.github/workflows/pages.yml)
- 构建脚本：[`web/scripts/build-static.mjs`](web/scripts/build-static.mjs)（静态构建时临时移走 `app/api`，保留 `/demo` 等页面）
- 首次可能需要在 GitHub 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**
- 完整版（含 `/studio` 真实模型）建议在 Vercel 导入仓库，并配置 `LLM_API_KEY`、`LLM_BASE_URL`、`LLM_MODEL`

## 仓库关联

已关联：https://github.com/flashJJ/voicetrace

```bash
cd voicetrace
git init
git add .
git commit -m "feat: VoiceTrace initial prototype"
git branch -M main
git remote add origin https://github.com/flashJJ/voicetrace.git
git push -u origin main
```

`.env.local` 已被 `.gitignore` 忽略，不会提交；首次 clone 后复制 `web/.env.example` 为 `web/.env.local` 并填入 Key。

## 仓库结构

```text
voicetrace/
  README.md          项目总览、赛事策略、导航
  docs/              文档中心：contest/ 比赛材料、guide/ 项目指导、development/ 后续开发、blog/ 技术分享
  web/               Next.js 应用（可运行）
  候选方案/          未选中方向，保留备选
  已排期/            已选定方向
```

运行：

```bash
cd web
npm install
npm run dev
```

打开 <http://localhost:3000。环境变量参考> `web/.env.example`；`.env.local` 不提交。

测试与校验：

```bash
cd web
npm test              # 单元测试：儿童分级、叙事计划、choices 修复、家庭任务包
npm run check:content # 故事、资料库与黄金样品内容校验
node scripts/build-static.mjs
npm run test:static   # 静态产物路由、儿童页面与录音链接
```

## 0. 一句话结论

**这场比赛值得参加，但不值得为 1 万元冠军奖金从零造一个复杂产品。**

你已选择 **非遗/方言互动叙事**，具体产品定为 **“声迹 · 方言故事书”**：把爷爷奶奶讲的故事，变成可以玩的方言互动书。这个方向商业分不如 B 端工具，但在“暂时没有真实用户资源”的约束下，它更适合用家人/朋友的录音做出真实、有情绪冲击力的作品，目标是 **乐在其中奖 + 造物故事奖 + 值得一赏奖**。

原推荐的 **交付验收官**、**账单差异排查** 保留在 `候选方案/`，作为后续比赛/产品化的备选。

## 1. 关键日期

| 日期            | 阶段   | 要做的事               | 风险提示           |
| ------------- | ---- | ------------------ | -------------- |
| 11-10 至 11-23 | 报名   | 提交作品 + 可体验入口，供评委实测 | 只剩 8 天，必须先冻结范围 |
| 11-24 至 11-29 | 评审   | 评委结合材料与实际体验评选      | 产品必须能当场打开、能走通  |
| 11-30 至 12-03 | 路演准备 | 公示入围名单，准备演示材料      | 入围后时间很紧，素材要提前做 |
| 12-04 至 12-06 | 获奖公布 | 展示应用、交流创作过程、揭晓奖项   | 现场/线上表达决定印象分   |

> 注：微信文章写报名 11.10 起，TRAE 官方微博写 11.9 起；以报名页实际开放时间为准。

## 2. 推荐策略

### 主攻：声迹 · 方言故事书（游戏娱乐，可兼报学习生活）

- **一句话**：趁还会唱，把乡音留下来；同一批素材，三种讲法。
- **为什么选它**：你暂时没有 B 端用户资源，但可以用公开资料库 + 家人/朋友的方言录音，做出 20 个互动故事；情绪价值强，容易命中“乐在其中奖/造物故事奖”，也适合官方传播。
- **三种模式**：正经模式（家庭/长辈）、鬼故事模式（年轻人/悬疑）、野史模式（年轻人/八卦），用同一批粤语素材覆盖不同受众，解决“只吸引正经人、受众单一”的问题。
- **核心差异**：不是方言翻译器（瓯小鹿）、不是固定历史信件（乡音计划·读侨批）、不是官方大制作游戏（瓷都小匠），而是 **同一批地方记忆 × 三种语气 × 3 幕互动 + 语音示例 + 分享卡 + 声音地图**。
- **最大风险**：赛道有“乡音计划·读侨批”等强竞品；鬼故事/野史要守住“不血腥、不造谣、标注野史”的边界，不能为了猎奇牺牲尊重。

### 备选：交付验收官（行业服务 / 客户交付产品）

- **一句话**：把合同/SOW 变成可执行的验收清单，自动跑一遍，生成客户敢签、你能收尾款的验收报告。
- **适合条件**：你后续能接触到软件外包/自由职业者，愿意做 B 端产品。
- **优势**：痛点强、付费意愿高、竞争空白明显；**劣势**：评委可能觉得偏 B 端、不够“好玩”。

### 备选：账单差异排查（商业增长）

- **一句话**：上传两套账单，3 分钟定位每一笔差异的原因和责任人。
- **适合条件**：你能接触到电商商家、SaaS 公司或支付服务商，拿到脱敏账单样本。
- **优势**：ROI 极清晰，演示数字冲击强；**劣势**：对账类产品已有不少，需要靠“差异原因解释 + 调账建议”做出差异化。

### 不建议直接做

| 方向                   | 原因                                          |
| -------------------- | ------------------------------------------- |
| 装修报价审核               | RenoPit 已开源，土巴兔已有免费 AI 报价审核，装小蜜有成熟人工服务，正面撞车 |
| 投标文件废标检查             | 标桥 AI、实在智能等已产品化，且政策推动下大厂会加速进入               |
| 通用 AI 学习/错题/旅行/宠物/记账 | 市场极饱和，TRAE 社区参赛作品也高度集中，很难被记住                |
| 通用 API 变更监控          | Rumbliq、Apify 等已占位，通用监控很难差异化                |
| 通用 AI 合同审查           | 法务 AI 产品密集，合规与责任风险高                         |

### 2.1 原型（v0.1，已完成）

- 目录：[web](web/README.md)
- 技术栈：Next.js 16 + React 19
- 已实现：首页、故事馆、**3 种模式 / 28 个互动故事**（3-8 幕）、结局、方言词注释、普通话翻译、声音故事卡（Canvas 下载）、声音地图（示意）、关于/隐私页
- **粤语资料库**：164 条素材，按内容子集拆成 29 个文件，每条有 `modes` 字段；页面 `/library` 支持搜索/类型/地区/模式筛选、详情、导出
- **真人粤语录音**：3 段（67-74 秒），来自 CC BY 4.0 的「冚唪唥」项目，在 `/about` 播放并逐段署名
- **本地录音棚**：`/record` 选故事片段录音、试听、重录；音频只存在 IndexedDB，不上传
- **自动转写**：录音时用浏览器语音服务边录边出字，可关闭并手动校对；音频可能由浏览器厂商处理
- **声音档案**：`/archive` 按故事分组试听、改转写、导出、删除；故事页有录音时优先播放「我家的版本」
- **家庭任务包**：按故事导出待录清单给家人，录完导出档案包，再导入合并，全程不经过服务器
- **录音联动**：首页显示我家的声音统计，故事馆显示「已录 x/n」，AI 工坊可把转写填入素材，结局声音卡可用录音金句
- **儿童模式**：`/kids` 按 4-6、6-9 岁分组，17 个独立适龄故事；跟读、词卡、3 道小测、学习小结与家长清除；隐藏鬼故事与 AI 工坊
- **香港内容包**：天星小轮、叮叮电车、茶餐厅 3 个原创儿童故事，含粤语原文、普通话/英文翻译、词卡与小测
- **国际化**：全站简 / 繁 / EN 切换（同一路由）；28 个故事有完整英文覆盖，17 个儿童故事有英文词卡与小测；繁中由 opencc-js 统一转换；录音棚、档案、资料库、地图、AI 工坊与关于页均已接入
- **学习播放**：示例语音与读题支持慢速 / 标准 / 原速三档，偏好本机记忆；故事翻译可收起为「点开普通话翻译」，方便先听后看；儿童词卡可逐词听粤语发音
- **移动与离线**：`manifest` + Service Worker，可安装到主屏；已打开过的页面和封面离线可看；故事搜索、年龄筛选、收藏与继续阅读；故事页支持系统分享，失败时复制链接
- **隐私优先**：无需注册与账号；录音、学习记录、收藏只存本机，服务器不接收录音；无广告、无第三方统计；自动转写可关闭，AI 工坊只发送素材文本
- **黄金样品**：8 个（正经 6 + 鬼故事 1 + 野史 1）
- **AI 工坊**：`/studio` 选素材 + 模式 → 生成 3-8 幕/翻译/注释 → 自动对照黄金样品跑 8 项检查；已配置火山方舟 Agent Plan（`deepseek-v4.1-flash`）。历史记录（v0.3，7 项规则）为 8 个样品 7/7 通过，不等同于新规则结果
- **预生成演示**：`/demo` 已用真实模型预生成 3 个模式各 1 个故事（五羊传说 / 金花娘娘 / 波罗诞），现场不用等模型
- **参赛材料**：`deliverables/` 内含 18 张 v0.12 截图（含真机主屏快捷方式）、产品说明 PDF（8 页）、路演 PPT / PDF（10 页）与 3 分钟演示 MP4（烧字幕）+ SRT；试玩报告与报名帖草稿见文档导航
- 运行：`cd web && npm install && npm run dev`，打开 <http://localhost:3000>
- 构建：`npm run build` 已通过
- 待办：真实亲子试用（暂停）、报名帖补视频链接与 TRAE Session ID

> 重要调整：**不做人工录入**。先用公开素材建资料库，再用黄金样品验证 AI 输出；真实录音是后续加分项，不是前置条件。

## 3. 文档导航

文档中心见 [docs/README.md](docs/README.md)，按用途分为 `contest/`、`guide/`、`development/`、`blog/` 四个目录。

### 3.1 项目指导（开发必读）

| 文档 | 内容 | 适合什么时候看 |
|---|---|---|
| [01-项目总览](docs/guide/01-项目总览.md) | 产品定位、核心体验、页面地图、当前状态 | 第一次接触项目 |
| [02-技术架构](docs/guide/02-技术架构.md) | 技术栈、双构建、AI 链路、限流、部署拓扑 | 理解系统怎么跑 |
| [03-项目结构与代码地图](docs/guide/03-项目结构与代码地图.md) | 目录树、关键文件职责、常见改动落点 | 开始改代码 |
| [04-数据模型与内容规范](docs/guide/04-数据模型与内容规范.md) | 故事、资料库、黄金样品的字段与约束 | 加故事或素材 |
| [05-开发与部署指南](docs/guide/05-开发与部署指南.md) | 环境变量、构建、部署、检查清单、常见问题 | 本地运行或上线 |

### 3.2 后续开发

| 文档 | 内容 |
|---|---|
| [后续开发方案归档规范](docs/development/README.md) | 方案文件怎么命名、怎么登记 |
| [01-后续开发路线图](docs/development/01-后续开发路线图.md) | 版本映射、报名前收尾、评审期稳定、赛后迭代、技术债 |
| [02-v0.3 版本迭代计划](docs/development/02-v0.3-版本迭代计划.md) | v0.3 范围、关键方案、三个 Sprint、验收与回滚 |

### 3.3 技术博客

| 文档 | 主题 |
|---|---|
| [从一句童谣到一本可以玩的方言书](docs/blog/01-从一句童谣到一本可以玩的方言书.md) | 产品设计与内容结构 |
| [把模型输出变成可验收的黄金样品](docs/blog/02-把模型输出变成可验收的黄金样品.md) | AI 评测与事实约束 |
| [13 秒网关超时下的流式生成](docs/blog/03-13秒网关超时下的流式生成.md) | 网关超时、NDJSON、推理模型 |
| [一套代码两种部署](docs/blog/04-一套代码两种部署.md) | 静态导出与 standalone 共存 |
| [声音地图重叠节点怎么合并](docs/blog/05-声音地图重叠节点怎么合并.md) | 前端交互与可访问性 |

### 3.4 比赛材料

| 文档                                         | 内容                                    | 适合什么时候看         |
| ------------------------------------------ | ------------------------------------- | --------------- |
| [01-赛事速览与规则拆解](docs/contest/01-赛事速览与规则拆解.md)       | 赛程、赛道、奖项、硬性要求、评分逻辑推断                  | 参赛前必读           |
| [02-竞品调研方案](docs/contest/02-竞品调研方案.md)             | 调研方法、竞品矩阵模板、TRAE 参赛作品饱和地图、初步结论        | 选题前             |
| [03-好想法调研方案](docs/contest/03-好想法调研方案.md)           | 好想法标准、20 个提问、12 个候选评分、Top 3 详细分析、验证计划 | 选题/定方向          |
| [04-同类赛事对比与参与决策](docs/contest/04-同类赛事对比与参与决策.md)   | 赛事优缺点、12+ 同类比赛对比、值不值得参与、注意事项          | 决定投入多少时间        |
| [05-8天执行计划](docs/contest/05-8天执行计划.md)             | 11.15-11.23 逐日计划、范围冻结、提交清单、演示脚本       | 开工后每天看          |
| [06-粤语资料库与黄金样品](docs/contest/06-粤语资料库与黄金样品.md)     | 164 条素材、按子集拆分的文件结构、8 个黄金样品、授权策略       | 做资料库/Agent 评测时  |
| [07-三种叙事模式](docs/contest/07-三种叙事模式.md)             | 正经/鬼故事/野史：受众、语气、素材映射、28 个互动故事、风险边界    | 做内容/扩受众时        |
| [08-10人试玩报告（模拟）](docs/contest/08-10人试玩报告-模拟.md)    | 模拟 10 人试玩、指标、发现、优先修改项                 | 内部排练；提交前必须换真实数据 |
| [09-报名帖草稿](docs/contest/09-报名帖草稿.md)               | 标题、介绍、差异、TRAE 说明、提交清单                 | 写报名帖时           |
| [10-3分钟演示脚本](docs/contest/10-3分钟演示脚本.md)           | 早期录屏逐字稿、时间轴、现场应急、评委追问；模拟段落不可当真实证据 | 查看早期录制草稿      |
| [11-产品说明文档](docs/contest/11-产品说明文档.md) / [PDF 版](deliverables/VoiceTrace-声迹-产品说明文档.pdf) | 产品定位、核心功能、体验路径、AI 验收、部署、边界与可复制介绍 | 报名、评审、了解产品    |
| [12-路演宣讲材料](docs/contest/12-路演宣讲材料.md)             | 10 页路演文案与讲稿、3 分钟演示流程、评委问答、应急清单 | 正式路演与宣讲        |
| [13-参赛加码迭代计划](docs/contest/13-参赛加码迭代计划.md)       | 7 天加码路线：AI 可体验化、内容增量、多方言取舍与排期 | 决定是否加码时        |
| [已排期/03-非遗方言叙事](已排期/03-非遗方言叙事/README.md)   | **已选定主攻方向**的一页概念书（声迹 · 方言故事书）         | 现在就看            |
| [候选方案/01-交付验收官](候选方案/01-交付验收官/README.md)   | 未选中，保留备选                              | 后续 B 端产品化时      |
| [候选方案/02-账单差异排查](候选方案/02-账单差异排查/README.md) | 未选中，保留备选                              | 有电商/财务资源时       |

## 4. 参赛组织规范

为保持后续开发与计划一致，本项目采用以下归档规范：

1. **候选方案按序号归档**：每个方向一个子文件夹，命名格式 `候选方案/NN-方案名/`，文件夹内放 `README.md`（一页概念书）和后续原型/调研材料。
2. **已排期方案统一放入 `已排期/`**：一旦确定主攻方向，将该方案文件夹整体移入 `已排期/`，并在本 README 的变更记录中登记。
3. **所有改动先登记**：新增功能、改变方向、调整范围，先更新 `05-8天执行计划.md` 或本 README，再动代码，保证计划与开发一致、全程留痕。
4. **调研来源可追溯**：每份文档末尾保留“参考来源”，关键数据标注出处与日期。
5. **不把未验证的假设写成结论**：市场数据、竞品能力、评奖偏好，均标注“推断/待核实”。

## 5. 下一步（今天就能做）

- [x] 选定主攻方向：非遗/方言互动叙事 → **声迹 · 方言故事书**。
- [x] 建立粤语故事资料库：164 条素材 + 8 个黄金样品（`/library`）。
- [x] 用黄金样品跑通“素材 → 3-8 幕结构 + 方言词注释 + 普通话翻译”。
- [x] 接入火山方舟 Agent Plan；历史 7 项规则下 8 个样品 7/7 通过，v0.4 起升级为 8 项检查。
- [x] 3 种模式 / 28 个互动故事（3-8 幕）+ 17 个儿童故事 + `/demo` 预生成。
- [ ] 真实亲子试用暂停：按现有仿真记录做材料，不再声称真实用户证据。
- [ ] 按 `docs/contest/09` 补齐报名帖：视频链接、TRAE Session ID；用户证据只写仿真与自测。
- [x] 3 分钟演示视频与字幕已重录：`deliverables/VoiceTrace-声迹-3分钟演示.mp4`（179 秒，烧字幕）与 `.srt`
- [x] 产品说明 PDF、路演 PPT / PDF 与 18 张 v0.12 截图已导出到 `deliverables/`；`17-pwa-home.png` 为真机 Chrome 快捷方式，材料中未写成独立窗口
- [ ] 真实录音作为可选加分项：有家人/朋友愿意录再补，不作为前置条件。

## 6. 变更记录

| 日期         | 变更                                                                     | 影响文件                                                       | 备注                     |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------- |
| 2026-11-15 | 建立参赛作战包，完成赛事、竞品、想法、同类赛事与执行计划初稿                                         | 全部                                                         | 初始版本                   |
| 2026-11-15 | 用户选定“非遗/方言叙事”；将候选 03 移入 `已排期/`，产品定名“声迹 · 方言故事书”                        | README、已排期、docs/contest/05                                         | 主攻方向变更，执行计划改为方向 C      |
| 2026-11-15 | 搭建 Next.js 原型 v0.1：首页/故事馆/3 幕互动/故事卡/声音地图/关于；构建通过                       | web/、README                                                | 待替换真实录音与接入 ASR         |
| 2026-11-15 | 建立粤语故事资料库：91 条素材 + 6 个黄金样品；新增 `/library` 页面与 `docs/contest/06`                 | web/data、web/lib/corpus.js、web/app/library、docs/contest/06         | 取消人工录入，改为公开素材 + 黄金样品验收 |
| 2026-11-15 | 新增 AI 工坊 `/studio` + `/api/generate-story`：Mock/真实模型切换 + 黄金样品自动验收      | web/app/studio、web/app/api/generate-story、web/.env.example | 下一步配置真实模型 Key          |
| 2026-11-15 | 数据按子集拆分为 23 个小文件 + `modes` 字段；新增鬼故事/野史 6 个互动模块；黄金样品扩到 8 个；新增 `docs/contest/07` | web/data/corpus、web/lib/stories-\*、web/app/stories、docs/contest/07 | 三种叙事模式上线               |
| 2026-11-15 | 配置火山方舟 Agent Plan（`deepseek-v4.1-flash`）；8 个黄金样品全部 7/7 通过              | web/.env.local、web/app/api/generate-story                  | 真实模型验收完成；Key 不提交、不显示   |
| 2026-11-15 | 真实模型预生成 3 个模式各 1 个故事；新增 `/demo`；补齐模拟试玩、报名帖、3 分钟演示脚本                    | web/data/generated、web/app/demo、docs/contest/08-10                 | 进入报名材料阶段；模拟数据不可当真实证据   |
| 2026-11-16 | 声音地图同坐标 6 故事合并为点击下拉节点；新增产品说明与路演宣讲材料；本地 3 分钟演示视频及字幕已生成 | web/components/StoryMap.jsx、web/app/globals.css、docs/contest/05、docs/contest/11-12、README、deliverables | 地图桌面/移动端验证通过；模拟试玩仍不可作为真实证据 |
| 2026-11-16 | 封面与主视觉 11 张图本地化到 `web/public/covers`；手机端新增汉堡导航 | web/lib/image.js、web/lib/stories*.js、web/public/covers、web/components/SiteHeader.jsx、web/app/globals.css | 静态站点不再依赖实时生图接口；≤680px 可访问全部页面 |
| 2026-11-16 | 语音等待 `voiceschanged`；分享卡引文限 3 行；新增 Open Graph / Twitter Card、`og.jpg` 与 favicon | web/components/AudioButton.jsx、web/components/ShareCard.jsx、web/app/layout.js、web/app/icon.svg、web/public/og.jpg、web/next.config.mjs | 分享带缩略图；语音提示更准确；控制台无 404 |
| 2026-11-16 | 《月光光》《阿婆的艇仔粥》补真分支；全部图片补宽高与懒加载 | web/lib/stories.js、web/app/page.js、web/app/stories/page.js、web/components/StoryCard.jsx、web/components/StoryReader.jsx、web/components/StoryMap.jsx | 9 故事均为 5 幕 / 2 结局；首屏只加载 hero |
| 2026-11-16 | 封面转 900px WebP（2.12MB → 0.52MB）；新增 robots.txt | web/lib/image.js、web/public/covers、web/app/robots.js | 9 张封面实际传输约 308KB；爬虫可读取 robots.txt |
| 2026-11-16 | 资料库 91 条改为 12 条/页分页；新增参赛加码迭代计划 | web/components/CorpusLibrary.jsx、web/app/globals.css、docs/contest/13 | 列表 DOM 从 91 条降到 12 条；7 天路线文档化 |
| 2026-11-16 | 首页改文案并新增逐字点亮的声音波形；修复 `aspect-ratio` 被图片 height 属性压制 | web/app/page.js、web/components/VoiceMoment.jsx、web/app/globals.css、web/app/layout.js、web/public/og.jpg、docs/contest/05、contest/09、contest/11、contest/12 | 首屏出现记忆点；口号在各材料中统一 |
| 2026-11-17 | 文档中心重组：比赛材料迁入 `docs/contest/`，新增 `guide/` 项目指导、`development/` 后续开发方案、`blog/` 技术分享 | docs/、README.md | 原 13 份比赛文档仅移动不改内容；新增 13 份文档 |
| 2026-11-18 | 新增 v0.3 版本迭代计划，路线图补充版本映射 | docs/development/02-v0.3-版本迭代计划.md、01-后续开发路线图.md、docs/README.md、README.md | 比赛期间冻结 main，v0.3 在 release/v0.3 开发 |
| 2026-11-19 | 发布 v0.6 儿童模式：9 个适龄故事、儿童录音页、家长门、年龄标签、继续阅读与自测试 | web/app/kids、web/components、web/tests、web/scripts、docs/development/05-08 | GitHub Pages 与 Trae FunctionWeb 同日发布 |
| 2026-11-19 | v0.7 学习闭环：9 个故事词卡与小测、逐幕跟读回放、小测页、学习小结、本机进度与家长页清除入口 | web/data/kids、web/lib/kid-learning.js、web/lib/kid-progress.js、web/components/Kid*.jsx、web/app/kids/[slug]/quiz、web/app/kids/[slug]/summary、web/app/kids/parent、web/scripts、web/tests、docs/development/07 | 跟读为练习录音，不写入声音档案；进度只存本机 |
| 2026-11-19 | v0.8 适龄内容：5 个儿童独立故事与封面、儿童池增至 14 个、14 条适龄素材、脚本自测记录、材料收尾清单与 `v0.8.0` 冻结 | web/lib/stories-kids.js、web/public/covers、web/data/kids/learning.json、web/data/corpus/nursery/07-kid-v08.json、web/scripts、web/tests、docs/development/08-10 | 真实亲子试用未完成，已在试用记录中标注 |
| 2026-11-20 | v0.9 国际化：简 / 繁 / EN 全站切换、25 个故事英文覆盖、14 个儿童故事英文词卡与小测、各工具页文案英文化、语言偏好记忆与英文覆盖测试 | web/components/LocaleProvider.jsx、web/data/i18n、web/lib/i18n-content.js、web/app、web/components、web/hooks、web/tests/i18n.test.mjs、scripts/check-static.mjs、docs/development/13 | 暂停真实试用，先面向香港与海外华侨家庭；`v0.9.0` 冻结 |
| 2026-11-20 | v0.10 学习体验：朗读速度三档与本机记忆、故事翻译收起/点开、儿童词卡逐词发音 | web/lib/playback.js、web/hooks/usePlaybackRate.js、web/components/SpeechRateControl.jsx、StoryReader、KidReadAlong、KidQuiz、KidWordCards、AudioButton、globals.css、tests/playback.test.mjs | `v0.10.0` 冻结 |
| 2026-11-20 | v0.11 移动与离线：PWA manifest / Service Worker / 离线页与安装提示、系统分享、故事搜索年龄筛选收藏与继续阅读 | web/public/manifest.webmanifest、sw.js、offline.html、icons、PwaRegister、PwaInstall、ShareStoryButton、StoryFavoriteButton、ContinueReading、stories/page.js、lib/favorites.js、lib/story-search.js、tests/story-search.test.mjs | `v0.11.0` 冻结 |
| 2026-11-20 | v0.12 香港内容包：天星小轮、叮叮电车、茶餐厅 3 个原创儿童故事与封面，补齐英文覆盖、词卡与小测；故事总数 28、儿童池 17 | web/lib/stories-hk.js、stories.js、public/covers、data/i18n/stories-hk-en.json、data/i18n/learning-en.json、data/kids/learning.json、tests/i18n.test.mjs、README、about | `v0.12.0` 截稿冻结 |
| 2026-11-20 | 材料数字刷新：报名帖、演示脚本、产品说明、路演稿、截图清单统一为 28 个故事 / 17 个儿童故事，并补三语、慢速、翻译收起、PWA 离线、搜索收藏与香港内容包 | docs/contest/07、09、10、11、12、13、14、README | PDF、PPT、演示视频与截图待重做 |
| 2026-11-20 | 收尾材料按双入口重做：产品说明、路演 10 页、报名帖、3 分钟脚本、截图清单；统一 25/14/164/8 数字 | docs/contest/06-14、docs/development/01、05、10、README | 真实试用缺口保持显式标注；PDF/PPT/视频仍待制作 |
| 2026-11-20 | 修复亲子角色走查 P1：儿童词注去重、首屏跟读入口、跟读听示例、小测听题目、跨设备提示 | web/hooks/useSpeechPlayback.js、StoryReader、KidReadAlong、KidQuiz、KidWordCards、kids/parent、globals.css、web/tests、web/scripts | 单测增至 25 项；静态检查覆盖新按钮与提示 |
| 2026-11-20 | 参赛材料成品：17 张 v0.12 截图、8 页产品说明 PDF、10 页路演 PPT / PDF、3 分钟演示 MP4（白字黑描边烧字幕）与 SRT；故事馆「继续阅读」条不再压导语 | deliverables/、web/app/globals.css、docs/contest/14、README | PWA 主屏安装截图未拍；真实试用缺口保持标注 |
| 2026-11-20 | 补真机主屏截图：`17-pwa-home.png` 为 Chrome 快捷方式（图标带 Chrome 徽标），v0.12 截图合计 18 张 | deliverables/screenshots/v0.12、docs/contest/14、README | 独立窗口未取证，材料按实际形态标注 |
| 2026-11-20 | 隐私卖点上位：首页与关于页写清无需注册、录音只存本机、无广告与第三方统计；报名帖、产品说明、路演稿同步，重导 PDF 与 PPT | web/app/page.js、about/page.js、globals.css、docs/contest/09/11/12、deliverables、README | 自动转写与 AI 工坊的数据边界保留说明 |
| 2026-11-20 | 关于页与报名帖补浏览器兼容说明：Chrome / Edge 全功能，Safari 需手动安装且转写不可用，夸克 / UC / 微信内置浏览器可能受限；产品说明 PDF 与路演 PPT 同步 | web/app/about/page.js、docs/contest/09、deliverables、README | 自动转写与 PWA 安装列为降级项 |
