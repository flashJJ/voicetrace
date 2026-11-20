"use client";

import Link from "next/link";
import demo from "../../data/generated/demo-stories.json";
import { getCorpusItem } from "../../lib/corpus";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "AI 预生成 · 真实模型",
    title: "三种模式，各一个预生成故事。",
    ledePre: "这一页直接用真实模型预生成的结果，现场演示不用等 30-80 秒。三个故事都通过 7/7 通用检查；想看模型重新生成，去",
    studio: "AI 工坊",
    ledePost: "。",
    modes: {
      heritage: "正经模式",
      ghost: "鬼故事模式",
      wild_history: "野史模式",
    },
    sectionEyebrow: (mode) => `${mode} · AI 预生成`,
    source: "素材：",
    meta: (model, seconds, passed, total) => `${model} · 约 ${seconds} 秒 · ${passed}/${total} 通过`,
    liveTitle: "真实模型预生成",
    generated: (date) => `生成于 ${date} · 非 Mock · 现场可直接使用本页`,
    checksHead: (passed, total) => `通用检查：${passed} / ${total} 通过`,
    pass: "通过",
    fail: "未通过",
    act: (n) => `第 ${n} 幕`,
    ending: "结局",
    glossary: "方言词注释",
    translation: "普通话翻译",
    endings: "结局",
    regenerate: "在 AI 工坊重新生成",
    choiceFallback: (index) => `选择 ${index + 1}`,
    notice:
      "说明：这 3 个故事是真实模型预生成结果，用于演示与内部排练；正式提交前建议再用真实用户试玩数据替换“用户证据”部分。",
    dateLocale: "zh-CN",
  },
  en: {
    eyebrow: "AI PRE-GENERATED · REAL MODEL",
    title: "Three modes, one pre-generated story each.",
    ledePre:
      "This page uses real model output so a live demo doesn't wait 30-80 seconds. All three stories pass 7/7 general checks. To watch the model generate a new one, go to the ",
    studio: "AI studio",
    ledePost: ".",
    modes: {
      heritage: "Heritage",
      ghost: "Ghost story",
      wild_history: "Hearsay",
    },
    sectionEyebrow: (mode) => `${mode} · AI pre-generated`,
    source: "Source: ",
    meta: (model, seconds, passed, total) => `${model} · ~${seconds}s · ${passed}/${total} passed`,
    liveTitle: "Real model, pre-generated",
    generated: (date) => `Generated ${date} · Not mock · Ready to use live on this page`,
    checksHead: (passed, total) => `General checks: ${passed} / ${total} passed`,
    pass: "Pass",
    fail: "Fail",
    act: (n) => `Act ${n}`,
    ending: "Ending",
    glossary: "Dialect glossary",
    translation: "Mandarin translation",
    endings: "Endings",
    regenerate: "Regenerate in AI studio",
    choiceFallback: (index) => `Choice ${index + 1}`,
    notice:
      "Note: these three stories are real model outputs for demos and internal rehearsal. Before submission, replace the “user evidence” section with real playtest data.",
    dateLocale: "en-US",
    demoNote: "Demo story text is shown in its original Chinese.",
  },
};

const order = ["heritage", "ghost", "wild_history"];

const stories = order
  .map((mode) => demo.stories.find((story) => story.mode === mode))
  .filter(Boolean);

export default function DemoPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);

  return (
    <div className="container studio">
      <section className="page-hero" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">
          {c.ledePre}
          <Link href="/studio" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            {c.studio}
          </Link>
          {c.ledePost}
        </p>
        {locale === "en" ? <p className="page-lede">{c.demoNote}</p> : null}
        <div className="mode-nav">
          {stories.map((story) => (
            <a key={story.mode} className="mode-chip" href={`#demo-${story.mode}`}>
              <strong>{c.modes[story.mode] || story.mode}</strong>
              <span>{localize(story.output.title)}</span>
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
                <span className="eyebrow">
                  {c.sectionEyebrow(c.modes[story.mode] || story.mode)}
                </span>
                <h2 className="section-title">{localize(output.title)}</h2>
              </div>
              <p className="section-desc">
                {c.source}
                {item?.title || story.corpusId}
                <br />
                {c.meta(
                  story.model,
                  Math.round(story.latencyMs / 1000),
                  passed,
                  checks.length
                )}
              </p>
            </div>

            <div className="studio-panel">
              <div className="studio-mode is-live">
                <strong>{c.liveTitle}</strong>
                <span>{story.model}</span>
                <small>
                  {c.generated(new Date(story.generatedAt).toLocaleString(c.dateLocale))}
                </small>
              </div>

              <div className="studio-validation">
                <div className="studio-validation-head">
                  <strong>{c.checksHead(passed, checks.length)}</strong>
                  <span>{story.corpusId}</span>
                </div>
                <div className="studio-checks">
                  {checks.map((check) => (
                    <div key={check.name} className={check.pass ? "is-pass" : "is-fail"}>
                      <span>{check.pass ? c.pass : c.fail}</span>
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
                        <span>{c.act(scene.act)}</span>
                        <h3>{scene.title}</h3>
                      </div>
                      <p className="studio-scene-yue">{scene.textYue || scene.summary}</p>
                      <p className="studio-scene-zh">{scene.textZh || scene.summary}</p>
                      {scene.choices?.length ? (
                        <div className="studio-choices">
                          {scene.choices.map((choice, index) => {
                            const label = typeof choice === "string" ? choice : choice?.label;
                            const text = label || c.choiceFallback(index);
                            return <span key={`${text}-${index}`}>{text}</span>;
                          })}
                        </div>
                      ) : (
                        <div className="studio-ending">{c.ending}</div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="studio-grid">
                  <div>
                    <div className="corpus-section-label">{c.glossary}</div>
                    {(output.glossary || []).map((entry) => (
                      <div className="corpus-glossary-item" key={entry.term}>
                        <strong>{entry.term}</strong>
                        <span>{entry.meaning}</span>
                        {entry.note ? <small>{entry.note}</small> : null}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="corpus-section-label">{c.translation}</div>
                    <p className="studio-translation">{output.translationZh}</p>
                    <div className="corpus-section-label">{c.endings}</div>
                    <p className="studio-translation">{(output.endings || []).join(" / ")}</p>
                  </div>
                </div>

                <div className="corpus-actions">
                  <Link className="btn btn-primary" href="/studio">
                    {c.regenerate}
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
        {c.notice}
      </div>
    </div>
  );
}
