import Link from "next/link";
import AudioButton from "../../components/AudioButton";
import { voiceSamples } from "../../lib/voice-samples";

export const metadata = {
  title: "关于与隐私 · 声迹",
  description: "声迹为什么做、怎么做、如何保护录音与故事。",
};

export default function AboutPage() {
  return (
    <div className="container about-layout">
      <div className="about-copy">
        <span className="eyebrow">关于声迹</span>
        <p className="about-quote">
          我们不想做方言翻译器，
          <br />
          我们想做一个<strong>家庭的声音抽屉</strong>。
        </p>
        <p>
          声迹的起点很简单：外婆讲了一个很长的故事，我听得懂一半，笑了一半。
          后来想再听，才发现没有录下来。
        </p>
        <p>
          市面上的方言产品，大多在解决“听不懂”的问题：翻译、朗读、识别。
          但还有另一个问题没人解决：<strong>那些声音，怎么留下来？</strong>
        </p>
        <p>
          声迹把一段真实录音，变成 3-8 幕互动故事：你可以听原声、看翻译、点开方言词，
          最后带走一张声音卡。它不替代老人，也不生成虚构故事，只是把真实的声音
          整理成可以传下去的样子。
        </p>
        <div className="tag-row">
          <span className="tag">TRAE 好应用大赏赛</span>
          <span className="tag">游戏娱乐 / 文化体验</span>
          <span className="tag">粤语 · 第一季</span>
          <span className="tag">原型版本</span>
        </div>

        <section className="about-card about-card-left">
          <h2>真人粤语样本</h2>
          <p>
            下面三段不是合成音，来自香港社区粤语读本项目「冚唪唥」，由真人朗读、以
            CC BY 4.0 授权。我们只做了裁剪与响度归一化，用来说明「原声」应该是什么质感；
            它们不是本站故事的录音。
          </p>
          <ul className="voice-list">
            {voiceSamples.map((sample) => (
              <li className="voice-item" key={sample.id}>
                <div className="voice-head">
                  <strong>{sample.title}</strong>
                  <span>{sample.duration}</span>
                </div>
                <p className="voice-note">{sample.note}</p>
                <AudioButton
                  audioUrl={sample.src}
                  label={`播放${sample.title} · ${sample.reader}`}
                  hint={`${sample.credit} · CC BY 4.0`}
                />
                <a
                  className="voice-source"
                  href={sample.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  原始页面 ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="voice-license">
            音频版权归原作者与朗读者所有，依 CC BY 4.0 使用；已裁剪至 60-90 秒并统一响度，
            完整录音见各段来源页。
          </p>
        </section>
      </div>

      <div>
        <section className="about-card">
          <h2>我们怎么做</h2>
          <ul>
            <li>
              <strong>原声优先：</strong>真实录音是主角；AI 只做转写、翻译、注释和辅助朗读。
            </li>
            <li>
              <strong>多幕互动：</strong>故事 3-8 幕随机，每幕一到两个选择、两个结局，让听故事变成参与故事。
            </li>
            <li>
              <strong>声音地图：</strong>把故事钉在发生的地方，形成家庭/社区的地方记忆。
            </li>
            <li>
              <strong>可分享：</strong>生成声音故事卡，发给家人朋友，而不是看完即走。
            </li>
          </ul>
        </section>

        <section className="about-card">
          <h2>录音、隐私与授权</h2>
          <ul>
            <li>录音前会说明用途：用于生成故事、可能在作品页展示；不会用于训练模型。</li>
            <li>需要讲述者本人同意；涉及第三方故事时，需取得相关授权。</li>
            <li>故事中不展示真实姓名、住址、电话等个人信息；可用“阿婆/外公”等称呼。</li>
            <li>
              <strong>本机录音：</strong>录音棚里的音频只保存在这台设备的浏览器里，声迹服务器不接收录音；
              换设备需要手动导出任务包或完整档案。
            </li>
            <li>
              <strong>自动转写：</strong>使用浏览器自带的语音服务（Chrome / Edge 支持），开启时音频可能
              发送给浏览器厂商；可以在录音棚关闭，改为手动输入。
            </li>
            <li>录音与故事可随时删除；删除会同时移除本机音频与转写，无法恢复。</li>
            <li>AI 合成音会明确标注；不会用 AI 冒充真实人物。</li>
          </ul>
        </section>

        <section className="about-card">
          <h2>关于这个原型</h2>
          <p>
            当前版本是 TRAE 好应用大赏赛的参赛原型，共 20 个互动故事，长度 3-8 幕：
            既有《月光光》《老鼠娶亲》这样的公有领域改编，也有广州地方传说、民俗与野史。
            现在已经加入本地录音棚、逐句转写校对和家庭任务包；云端上传、账号与自动转写会在赛后版本补上。
          </p>
          <p>
            如果你是粤语使用者，或者你家里也有一位爱讲故事的老人，欢迎告诉我们。
            我们想找到第一批真实故事。
          </p>
          <Link className="btn btn-primary" href="/stories/moonlight">
            先听一个故事 <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="about-card">
          <h2>技术说明</h2>
          <p>
            前端使用 Next.js + React；默认语音使用浏览器语音合成，并附 3 段 CC BY 4.0
            真人粤语样本；正式版计划接入 CosyVoice/FunASR 等方言语音能力。互动故事使用
            轻量 JSON 剧情结构，不依赖重型游戏引擎。
          </p>
        </section>
      </div>
    </div>
  );
}
