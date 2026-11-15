import Link from "next/link";
import demo from "../../data/generated/demo-stories.json";
import { getCorpusItem, modeLabel } from "../../lib/corpus";

export const metadata = {
  title: "AI 预生成演示 · 声迹",
  description: "三种模式各一个真实模型预生成故事：五羊传说、金花娘娘、波罗诞。",
};

const order = ["heritage", "ghost", "wild_history"];

const stories = order
  .map((mode) => demo.stories.find((story) => story.mode === mode))
  .filter(Boolean);

function choiceLabel(choice, index) {
  if (typeof choice === "string") return choice;
  return choice?.label || `选择 ${index + 1}`;
}

export default function DemoPage() {
  return (
    <div className="container studio">
      <section className="page-hero" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">AI 预生成 · 真实模型</span>
        <h1 className="page-title">三种模式，各一个预生成故事。</h1>
        <p className="page-lede">
          这一页直接用真实模型预生成的结果，现场演示不用等 30-80 秒。
          三个故事都通过 7/7 通用检查；想看模型重新生成，去{" "}
          <Link href="/studio" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            AI 工坊
          </Link>
          。
        </p>
        <div className="mode-nav">
          {stories.map((story) => (
            <a key={story.mode} className="mode-chip" href={`#demo-${story.mode}`}>
              <strong>{modeLabel(story.mode)}</strong>
              <span>{story.output.title}</span>
            </a>
          ))}
        </div>
      </section>

      {stories.map((story) => {
        const item = getCorpusItem(story.corpusId);
        const checks = story.validation || [];
        const passed = checks.filter((check) => check.pass).length;
        const output = story.output;

        return (
          <section
            className="mode-section"
            id={`demo-${story.mode}`}
            key={story.mode}
            style={{ paddingTop: 10 }}
          >
            <div className="mode-heading">
              <div>
                <span className="eyebrow">{modeLabel(story.mode)} · AI 预生成</span>
                <h2 className="section-title">{output.title}</h2>
              </div>
              <p className="section-desc">
                素材：{item?.title || story.corpusId}
                <br />
                {story.model} · 约 {Math.round(story.latencyMs / 1000)} 秒 · {passed}/{checks.length} 通过
              </p>
            </div>

            <div className="studio-panel">
              <div className="studio-mode is-live">
                <strong>真实模型预生成</strong>
                <span>{story.model}</span>
                <small>
                  生成于 {new Date(story.generatedAt).toLocaleString("zh-CN")} · 非 Mock ·
                  现场可直接使用本页
                </small>
              </div>

              <div className="studio-validation">
                <div className="studio-validation-head">
                  <strong>
                    通用检查：{passed} / {checks.length} 通过
                  </strong>
                  <span>{story.corpusId}</span>
                </div>
                <div className="studio-checks">
                  {checks.map((check) => (
                    <div key={check.name} className={check.pass ? "is-pass" : "is-fail"}>
                      <span>{check.pass ? "通过" : "未通过"}</span>
                      <code>{check.name}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="studio-output">
                <div className="studio-entities">
                  {(output.entities || []).map((entity) => (
                    <span key={entity}>{entity}</span>
                  ))}
                </div>

                <div className="studio-scenes">
                  {(output.scenes || []).map((scene) => (
                    <article className="studio-scene" key={`${scene.act}-${scene.title}`}>
                      <div className="studio-scene-head">
                        <span>第 {scene.act} 幕</span>
                        <h3>{scene.title}</h3>
                      </div>
                      <p className="studio-scene-yue">{scene.textYue || scene.summary}</p>
                      <p className="studio-scene-zh">{scene.textZh || scene.summary}</p>
                      {scene.choices?.length ? (
                        <div className="studio-choices">
                          {scene.choices.map((choice, index) => (
                            <span key={`${choiceLabel(choice, index)}-${index}`}>
                              {choiceLabel(choice, index)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="studio-ending">结局</div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="studio-grid">
                  <div>
                    <div className="corpus-section-label">方言词注释</div>
                    {(output.glossary || []).map((entry) => (
                      <div className="corpus-glossary-item" key={entry.term}>
                        <strong>{entry.term}</strong>
                        <span>{entry.meaning}</span>
                        {entry.note ? <small>{entry.note}</small> : null}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="corpus-section-label">普通话翻译</div>
                    <p className="studio-translation">{output.translationZh}</p>
                    <div className="corpus-section-label">结局</div>
                    <p className="studio-translation">{(output.endings || []).join(" / ")}</p>
                  </div>
                </div>

                <div className="corpus-actions">
                  <Link className="btn btn-primary" href="/studio">
                    在 AI 工坊重新生成
                  </Link>
                  <span className="corpus-meta">
                    {item?.region} · {item?.license}
                  </span>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <div className="notice" style={{ marginTop: 10, marginBottom: 60 }}>
        说明：这 3 个故事是真实模型预生成结果，用于演示与内部排练；正式提交前建议再用真实用户试玩数据替换“用户证据”部分。
      </div>
    </div>
  );
}
