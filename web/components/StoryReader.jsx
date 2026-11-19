"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SceneAudio from "./SceneAudio";
import ShareCard from "./ShareCard";
import KidReadAlong from "./KidReadAlong";
import KidWordCards from "./KidWordCards";
import { getRecording, recordingId } from "../lib/recordings";
import { getKidLearning } from "../lib/kid-learning";
import { markSceneVisited } from "../lib/kid-progress";

export default function StoryReader({ story, kidMode = false }) {
  const scenes = useMemo(
    () =>
      story.scenes.reduce((acc, scene) => {
        acc[scene.id] = scene;
        return acc;
      }, {}),
    [story]
  );
  const actCount = useMemo(() => {
    const explicit = Number(story.actCount);
    if (explicit > 0) return explicit;
    return Math.max(...story.scenes.map((item) => Number(item.act) || 1));
  }, [story]);
  const firstScene = story.scenes[0].id;
  const recordBase = kidMode ? "/kids/record" : "/record";
  const [sceneId, setSceneId] = useState(firstScene);
  const [history, setHistory] = useState([]);
  const [activeTerm, setActiveTerm] = useState(null);
  const [familyQuote, setFamilyQuote] = useState("");
  const bodyRef = useRef(null);

  const scene = scenes[sceneId];
  const learning = useMemo(
    () => (kidMode ? getKidLearning(story.slug) : null),
    [kidMode, story.slug]
  );
  const sceneKidWords = learning?.sceneWords?.[scene.id] || [];
  const showGlossary = scene.glossary?.length > 0 && (!kidMode || sceneKidWords.length === 0);

  useEffect(() => {
    if (!kidMode) return;
    try {
      window.localStorage.setItem("voicetrace:last-kid-story", story.slug);
    } catch (error) {
      // 隐私模式可能禁用 localStorage，不影响阅读。
    }
  }, [kidMode, story.slug]);

  useEffect(() => {
    if (!kidMode) return;
    markSceneVisited(story.slug, sceneId);
  }, [kidMode, story.slug, sceneId]);

  useEffect(() => {
    if (!scene?.ending) {
      setFamilyQuote("");
      return undefined;
    }
    let alive = true;
    getRecording(recordingId(story.slug, scene.id))
      .then((record) => {
        if (!alive) return;
        const text = (record?.transcript || "").trim();
        setFamilyQuote(text ? (text.length > 64 ? `${text.slice(0, 64)}…` : text) : "");
      })
      .catch(() => {
        if (alive) setFamilyQuote("");
      });
    return () => {
      alive = false;
    };
  }, [story.slug, scene?.id, scene?.ending]);
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
    <div className={`reader ${kidMode ? "is-kid" : ""}`}>
      <div className="container">
        <div className="reader-top">
          <Link href={kidMode ? "/kids" : "/stories"} className="reader-back">
            <span aria-hidden="true">←</span> {kidMode ? "返回儿童故事" : "返回故事馆"}
          </Link>
          <span>
            {kidMode ? `${story.ageBand} 岁 · 儿童模式` : `${story.dialect} · ${story.type}`}
          </span>
        </div>

        <div className="reader-shell">
          <div className="reader-visual">
            <img
              src={scene.image || story.cover}
              alt={`${story.title} · ${scene.title}`}
              width="900"
              height="675"
              loading="eager"
              decoding="async"
            />
            <SceneAudio story={story} scene={scene} recordBase={recordBase} />
          </div>

          <div className="reader-body" ref={bodyRef}>
            <div className="act-progress" aria-label={`第 ${scene.act} 幕，共 ${actCount} 幕`}>
              {Array.from({ length: actCount }, (_, index) => index + 1).map((act) => (
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
            <div className="act-label">
              第 {scene.act} 幕 / 共 {actCount} 幕
            </div>
            {kidMode && learning ? (
              <div className="kid-quick-links" aria-label="本幕快捷入口">
                <a className="kid-quick-link" href="#kid-readalong">
                  跟读这一句
                </a>
                {sceneKidWords.length ? (
                  <a className="kid-quick-link" href="#kid-wordcards">
                    看本幕词语
                  </a>
                ) : null}
              </div>
            ) : null}
            <h1 className="scene-title">{scene.title}</h1>
            <p className="scene-text">{scene.textYue}</p>
            <p className="scene-text-zh">{scene.textZh}</p>

            {showGlossary && (
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

            {learning ? (
              <div className="kid-learn">
                <KidReadAlong story={story} scene={scene} />
                <KidWordCards slug={story.slug} words={sceneKidWords} />
              </div>
            ) : null}

            {scene.ending ? (
              <div className="ending-card">
                <h3>故事读完了</h3>
                <p>{scene.endingText}</p>
                <div className="share-actions">
                  {learning?.quiz?.length ? (
                    <Link
                      className="btn btn-primary"
                      href={`/kids/${story.slug}/quiz`}
                    >
                      做 {learning.quiz.length} 道小测
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={`btn ${
                      kidMode && learning?.quiz?.length ? "btn-ghost" : "btn-primary"
                    }`}
                    onClick={restart}
                  >
                    再读一次
                  </button>
                  {learning ? (
                    <Link className="btn btn-ghost" href={`/kids/${story.slug}/summary`}>
                      看学习小结
                    </Link>
                  ) : null}
                  <Link
                    className="btn btn-ghost"
                    href={`${recordBase}?story=${story.slug}&scene=${firstScene}`}
                  >
                    录下我家的版本
                  </Link>
                  <Link className="btn btn-ghost" href={kidMode ? "/kids" : "/map"}>
                    {kidMode ? "回儿童故事" : "去声音地图"}
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
              <span className="eyebrow">
                {familyQuote ? "带走一张我家的声音卡" : "带走一张声音卡"}
              </span>
              <h2>把这段乡音，发给你想念的人</h2>
              <p>
                故事卡会带上故事名、方言、地点和一句金句。下载后可以发微信、发朋友圈，
                也可以打印出来夹在书里。
              </p>
              <p className="notice" style={{ marginTop: 0 }}>
                当前为原型示例卡；正式版会加入真实录音二维码和家族故事页。
              </p>
            </div>
            <ShareCard
              story={story}
              quote={familyQuote || scene.endingText || story.quote}
              source={familyQuote ? "family" : "sample"}
            />
          </section>
        )}
      </div>
    </div>
  );
}
