# VoiceTrace · 声迹 · 方言故事书（原型 v0.1）

> English name: VoiceTrace  
> TRAE 好应用大赏赛参赛原型  
> 一句话：把爷爷奶奶讲的故事，变成可以玩的方言互动书。

## 运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000

生产构建：

```bash
npm run build
npm run start
```

## 页面

| 路由 | 内容 |
|---|---|
| `/` | 首页：价值主张、3 个故事、玩法、为什么做 |
| `/stories` | 故事馆：三种模式 / 9 个粤语故事 |
| `/stories/moonlight` | 《月光光》：正经模式 |
| `/stories/eagle-orchid` | 《井边的鹰爪兰》：鬼故事模式 |
| `/stories/lun-wenxu-congee` | 《状元及第粥》：野史模式 |
| `/library` | 粤语故事资料库：91 条素材 + 8 个 Agent 黄金样品 |
| `/studio` | AI 工坊：选素材 + 模式 → 生成 3 幕 → 对照黄金样品验收 |
| `/demo` | AI 预生成演示：3 个模式各 1 个真实模型故事，打开即看 |
| `/map` | 声音地图（示意）；同坐标故事合并为节点，点击后下拉选择 |
| `/about` | 关于、隐私、授权、技术说明 |

## 数据资料库

```text
data/corpus/
  meta.json               分类、模式、版本
  nursery/                6 个文件，22 首童谣
  legends/                6 个文件，20 条传说
  proverbs/               4 个文件，12 条歇后语 + 11 条农谚
  customs/                4 个文件，12 条民俗/节庆/饮食
  catalog/                1 个文件，8 条广府民间故事篇目
  riddles/                2 个文件，3 条谜语 + 3 条绕口令
  golden/                 4 个文件，8 个 Agent 黄金样品
data/generated/
  demo-stories.json       3 个真实模型预生成故事（正经/鬼故事/野史）
```

每条素材包含：标题、类型、地区、`modes`（正经/鬼故事/野史）、摘要、原文（可选）、标签、母题、方言词注释、来源链接、授权状态、故事潜力、难度、是否黄金样品。

黄金样品包含：原始素材、模式、期望实体、期望方言词注释、期望三幕结构、普通话翻译、检查项。后续 ASR、翻译、分幕、注释、内容安全都可以拿它做回归测试。

## AI 对接

复制 `.env.example` 为 `.env.local`，填入任意 OpenAI-compatible 模型：

```bash
LLM_API_KEY=your-key
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-chat
```

打开 `/studio`，选素材 + 模式，点“生成互动版”：

- 有 API Key：按模式（正经/鬼故事/野史）调用真实模型，输出 3 幕 + 注释 + 翻译。
- 没有 API Key：自动返回对应模式的黄金样品作为 Mock 输出，先把流程跑通。
- 每次输出都会对照黄金样品检查：三幕、结局、注释、翻译、实体是否幻觉。

API 路由：`app/api/generate-story/route.js`。  
提示词、输出 schema、校验逻辑都在这个文件里，方便后续替换模型或调整规则。

## 目录

```text
app/                 Next.js App Router 页面与全局样式
components/          导航、故事卡、互动阅读器、语音按钮、故事卡、地图
lib/stories.js       3 个故事的数据与图片 URL
public/              预留：真实录音、图片、故事卡素材
```

## 当前状态

- [x] 首页 / 故事馆 / 3 幕互动 / 结局 / 声音故事卡 / 声音地图 / 关于页
- [x] 三种模式：正经、鬼故事、野史；9 个互动故事
- [x] 移动端适配、方言词注释、普通话翻译、返回/重读
- [x] 粤语故事资料库：91 条素材，按内容子集拆成 23 个小文件
- [x] 8 个 Agent 黄金样品（正经 6 + 鬼故事 1 + 野史 1）
- [x] AI 工坊 `/studio`：Mock 模式 + OpenAI-compatible 模型调用 + 自动验收
- [x] 配置火山方舟 Agent Plan（`deepseek-v4.1-flash`），8 个黄金样品全部 7/7 通过
- [x] `/demo` 预生成 3 个模式各 1 个故事，现场不用等模型
- [x] `npm run build` 通过
- [ ] 真实 10 人试玩与报名材料

## 内容与授权

- 《月光光》：传统粤语童谣，公有领域改编。
- 《老鼠娶亲》：传统民间故事，公有领域改编。
- 《阿婆的艇仔粥》：虚构示例，正式版将替换为经授权的真实家庭故事。
- 图片：由 TRAE 文生图接口生成，仅用于原型演示。
- 语音：当前使用浏览器语音合成作为示例；正式版使用经授权的真实录音，并标注 AI 合成部分。

## 合规提示

- 本作品为 TRAE 好应用大赏赛参赛原型。
- 录音/故事需讲述者本人同意；可随时删除；不展示真实姓名、住址、电话。
- AI 合成音明确标注；不用 AI 冒充真实人物。
- 比赛要求以《赛事细则》为准。
