"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AudioButton from "./AudioButton";
import ShareCard from "./ShareCard";

export default function StoryReader({ story }) {
  const scenes = useMemo(
    () =>
      story.scenes.reduce((acc, scene) => {
        acc[scene.id] = scene;
        return acc;
      }, {}),
    [story]
  );
  const firstScene = story.scenes[0].id;
  const [sceneId, setSceneId] = useState(firstScene);
  const [history, setHistory] = useState([]);
  const [activeTerm, setActiveTerm] = useState(null);
  const bodyRef = useRef(null);

  const scene = scenes[sceneId];
  const activeGlossary = scene.glossary?.find((item) => item.term === activeTerm);

  const goTo = useCallback(
    (next) => {
      if (!scenes[next]) return;
      setHistory((prev) => [...prev, sceneId]);
      setSceneId(next);
      setActiveTerm(null);
      window.requestAnimationFrame(() => {
        bodyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [sceneId, scenes]
  );

  const back = useCallback(() => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setSceneId(previous);
    setActiveTerm(null);
  }, [history]);

  const restart = useCallback(() => {
    setSceneId(firstScene);
    setHistory([]);
    setActiveTerm(null);
  }, [firstScene]);

  return (
    <div className="reader">
      <div className="container">
        <div className="reader-top">
          <Link href="/stories" className="reader-back">
            <span aria-hidden="true">←</span> 返回故事馆
          </Link>
          <span>
            {story.dialect} · {story.type}
          </span>
        </div>

        <div className="reader-shell">
          <div className="reader-visual">
            <img
              src={scene.image || story.cover}
              alt={`${story.title} · ${scene.title}`}
              width="1216"
              height="912"
              loading="eager"
              decoding="async"
            />
            <div className="reader-audio">
              <AudioButton
                text={scene.audioText || scene.textYue}
                label="播放本幕粤语示例语音"
              />
            </div>
          </div>

          <div className="reader-body" ref={bodyRef}>
            <div className="act-progress" aria-label={`第 ${scene.act} 幕，共 3 幕`}>
              {[1, 2, 3].map((act) => (
                <div
                  key={act}
                  className={`act-step ${
                    act < scene.act ? "is-done" : act === scene.act ? "is-active" : ""
                  }`}
                >
                  <span />
                </div>
              ))}
            </div>
            <div className="act-label">第 {scene.act} 幕 / 共 3 幕</div>
            <h1 className="scene-title">{scene.title}</h1>
            <p className="scene-text">{scene.textYue}</p>
            <p className="scene-text-zh">{scene.textZh}</p>

            {scene.glossary?.length > 0 && (
              <>
                <div className="glossary" aria-label="方言词注释">
                  {scene.glossary.map((item) => (
                    <button
                      type="button"
                      key={item.term}
                      className={`glossary-chip ${activeTerm === item.term ? "is-active" : ""}`}
                      onClick={() =>
                        setActiveTerm((prev) => (prev === item.term ? null : item.term))
                      }
                      aria-expanded={activeTerm === item.term}
                    >
                      {item.term}
                    </button>
                  ))}
                </div>
                {activeGlossary && (
                  <div className="glossary-panel">
                    <strong>{activeGlossary.term}</strong> · {activeGlossary.meaning}
                    <br />
                    {activeGlossary.note}
                  </div>
                )}
              </>
            )}

            {scene.ending ? (
              <div className="ending-card">
                <h3>故事读完了</h3>
                <p>{scene.endingText}</p>
                <div className="share-actions">
                  <button type="button" className="btn btn-primary" onClick={restart}>
                    再读一次
                  </button>
                  <Link className="btn btn-ghost" href="/map">
                    去声音地图
                  </Link>
                </div>
              </div>
            ) : (
              <div className="choices">
                {scene.choices.map((choice) => (
                  <button
                    type="button"
                    key={choice.next + choice.label}
                    className="choice-btn"
                    onClick={() => goTo(choice.next)}
                  >
                    {choice.label}
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            )}

            <div className="reader-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={back}
                disabled={history.length === 0}
              >
                上一幕
              </button>
              <button type="button" className="btn btn-ghost" onClick={restart}>
                从头开始
              </button>
            </div>

            {story.type.includes("示例") && (
              <p className="notice">
                这是示例故事，用于演示产品体验。正式版会替换为经本人授权的真实家庭故事；
                录音可随时删除，AI 合成音会明确标注。
              </p>
            )}
          </div>
        </div>

        {scene.ending && (
          <section className="share-panel">
            <div>
              <span className="eyebrow">带走一张声音卡</span>
              <h2>把这段乡音，发给你想念的人</h2>
              <p>
                故事卡会带上故事名、方言、地点和一句金句。下载后可以发微信、发朋友圈，
                也可以打印出来夹在书里。
              </p>
              <p className="notice" style={{ marginTop: 0 }}>
                当前为原型示例卡；正式版会加入真实录音二维码和家族故事页。
              </p>
            </div>
            <ShareCard story={story} quote={scene.endingText || story.quote} />
          </section>
        )}
      </div>
    </div>
  );
}
