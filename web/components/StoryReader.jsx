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
import { localizeLearning, localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    backKids: "返回儿童故事",
    backStories: "返回故事馆",
    kidsMeta: (ageBand) => `${ageBand} 岁 · 儿童模式`,
    actLabel: (act, total) => `第 ${act} 幕 / 共 ${total} 幕`,
    cantonese: "粤语原文",
    mandarin: "普通话",
    english: "English",
    quickReadAlong: "跟读这一句",
    quickWords: "看本幕词语",
    previous: "上一幕",
    restart: "从头开始",
    quiz: (count) => `做 ${count} 道小测`,
    reread: "再读一次",
    summary: "看学习小结",
    recordFamily: "录下我家的版本",
    map: "去声音地图",
    kidsHome: "回儿童故事",
    sampleNotice:
      "这是示例故事，用于演示产品体验。正式版会替换为经本人授权的真实家庭故事；录音可随时删除，AI 合成音会明确标注。",
    hideTranslation: "收起翻译",
    showTranslation: "显示翻译",
    revealTranslation: "点开普通话翻译",
    translationToggleAria: "显示或隐藏普通话翻译",
    shareEyebrowFamily: "带走一张我家的声音卡",
    shareEyebrow: "带走一张声音卡",
    shareTitle: "把这段乡音，发给你想念的人",
    shareText: "故事卡会带上故事名、方言、地点和一句金句。下载后可以发微信、发朋友圈，也可以打印出来夹在书里。",
    shareNotice: "当前为原型示例卡；正式版会加入真实录音二维码和家族故事页。",
    glossary: "方言词注释",
    endingTitle: "故事读完了",
  },
  en: {
    backKids: "Back to kids",
    backStories: "Back to stories",
    kidsMeta: (ageBand) => `${ageBand} · Kids mode`,
    actLabel: (act, total) => `Act ${act} of ${total}`,
    cantonese: "Cantonese",
    mandarin: "Mandarin",
    english: "English",
    quickReadAlong: "Read along",
    quickWords: "Word cards",
    previous: "Previous act",
    restart: "Start over",
    quiz: (count) => `Take ${count} quiz questions`,
    reread: "Read again",
    summary: "Learning summary",
    recordFamily: "Record our version",
    map: "Sound map",
    kidsHome: "Back to kids",
    sampleNotice:
      "This is a sample story used to demonstrate the product. A future release will use authorized family stories; recordings can be deleted at any time, and synthetic audio is clearly labeled.",
    hideTranslation: "Hide translation",
    showTranslation: "Show translation",
    revealTranslation: "Tap for the English translation",
    translationToggleAria: "Show or hide the translation",
    shareEyebrowFamily: "Take home a family voice card",
    shareEyebrow: "Take home a voice card",
    shareTitle: "Send a piece of home to someone you miss",
    shareText: "The card carries the story title, dialect, place, and one line. Download it, share it, or print it and keep it in a book.",
    shareNotice: "This is a prototype card; a future release will add a real recording QR code and a family story page.",
    glossary: "Glossary",
    endingTitle: "The story is finished",
  },
};

export default function StoryReader({ story, kidMode = false }) {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const localizedStory = useMemo(
    () => localizeStory(story, locale, localize),
    [story, locale, localize]
  );
  const scenes = useMemo(
    () =>
      localizedStory.scenes.reduce((acc, scene) => {
        acc[scene.id] = scene;
        return acc;
      }, {}),
    [localizedStory]
  );
  const actCount = useMemo(() => {
    const explicit = Number(localizedStory.actCount);
    if (explicit > 0) return explicit;
    return Math.max(...localizedStory.scenes.map((item) => Number(item.act) || 1));
  }, [localizedStory]);
  const firstScene = localizedStory.scenes[0].id;
  const recordBase = kidMode ? "/kids/record" : "/record";
  const [sceneId, setSceneId] = useState(firstScene);
  const [history, setHistory] = useState([]);
  const [activeTerm, setActiveTerm] = useState(null);
  const [familyQuote, setFamilyQuote] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const bodyRef = useRef(null);

  const scene = scenes[sceneId];
  const learning = useMemo(
    () =>
      kidMode
        ? localizeLearning(story.slug, getKidLearning(story.slug), locale, localize)
        : null,
    [kidMode, story.slug, locale, localize]
  );
  const sceneKidWords = learning?.sceneWords?.[scene.id] || [];
  const showGlossary = scene.glossary?.length > 0 && (!kidMode || sceneKidWords.length === 0);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("voicetrace:show-translation") === "0") {
        setShowTranslation(false);
      }
    } catch (error) {
      // 隐私模式禁用 localStorage 时保持默认显示。
    }
  }, []);

  const toggleTranslation = useCallback(() => {
    setShowTranslation((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("voicetrace:show-translation", next ? "1" : "0");
      } catch (error) {
        // 写不进去也不影响当前会话。
      }
      return next;
    });
  }, []);

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
            <span aria-hidden="true">←</span> {kidMode ? c.backKids : c.backStories}
          </Link>
          <span>
            {kidMode
              ? c.kidsMeta(localizedStory.ageBand)
              : `${localizedStory.dialect} · ${localizedStory.type}`}
          </span>
        </div>

        <div className="reader-shell">
          <div className="reader-visual">
            <img
              src={scene.image || localizedStory.cover}
              alt={`${localizedStory.title} · ${scene.title}`}
              width="900"
              height="675"
              loading="eager"
              decoding="async"
            />
            <SceneAudio story={localizedStory} scene={scene} recordBase={recordBase} />
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
            <div className="act-label">{c.actLabel(scene.act, actCount)}</div>
            {kidMode && learning ? (
              <div className="kid-quick-links" aria-label="Shortcuts">
                <a className="kid-quick-link" href="#kid-readalong">
                  {c.quickReadAlong}
                </a>
                {sceneKidWords.length ? (
                  <a className="kid-quick-link" href="#kid-wordcards">
                    {c.quickWords}
                  </a>
                ) : null}
              </div>
            ) : null}
            <h1 className="scene-title">{scene.title}</h1>
            <span className="scene-text-label">{c.cantonese}</span>
            <p className="scene-text">{scene.textYue}</p>
            <div className="translation-head">
              <span className="scene-text-label">
                {locale === "en" ? c.english : c.mandarin}
              </span>
              <button
                type="button"
                className="translation-toggle"
                onClick={toggleTranslation}
                aria-expanded={showTranslation}
                aria-label={c.translationToggleAria}
              >
                {showTranslation ? c.hideTranslation : c.showTranslation}
              </button>
            </div>
            {showTranslation ? (
              <p className="scene-text-zh">
                {locale === "en" ? scene.textEn || scene.textZh : scene.textZh}
              </p>
            ) : (
              <button
                type="button"
                className="translation-reveal"
                onClick={toggleTranslation}
              >
                {c.revealTranslation}
              </button>
            )}

            {showGlossary && (
              <>
                <div className="glossary" aria-label={c.glossary}>
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
                <KidReadAlong story={localizedStory} scene={scene} />
                <KidWordCards slug={story.slug} words={sceneKidWords} />
              </div>
            ) : null}

            {scene.ending ? (
              <div className="ending-card">
                <h3>{c.endingTitle}</h3>
                <p>{scene.endingText}</p>
                <div className="share-actions">
                  {learning?.quiz?.length ? (
                    <Link
                      className="btn btn-primary"
                      href={`/kids/${story.slug}/quiz`}
                    >
                      {c.quiz(learning.quiz.length)}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={`btn ${
                      kidMode && learning?.quiz?.length ? "btn-ghost" : "btn-primary"
                    }`}
                    onClick={restart}
                  >
                    {c.reread}
                  </button>
                  {learning ? (
                    <Link className="btn btn-ghost" href={`/kids/${story.slug}/summary`}>
                      {c.summary}
                    </Link>
                  ) : null}
                  <Link
                    className="btn btn-ghost"
                    href={`${recordBase}?story=${story.slug}&scene=${firstScene}`}
                  >
                    {c.recordFamily}
                  </Link>
                  <Link className="btn btn-ghost" href={kidMode ? "/kids" : "/map"}>
                    {kidMode ? c.kidsHome : c.map}
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
                {c.previous}
              </button>
              <button type="button" className="btn btn-ghost" onClick={restart}>
                {c.restart}
              </button>
            </div>

            {story.type.includes("示例") && <p className="notice">{c.sampleNotice}</p>}
          </div>
        </div>

        {scene.ending && (
          <section className="share-panel">
            <div>
              <span className="eyebrow">
                {familyQuote ? c.shareEyebrowFamily : c.shareEyebrow}
              </span>
              <h2>{c.shareTitle}</h2>
              <p>{c.shareText}</p>
              <p className="notice" style={{ marginTop: 0 }}>
                {c.shareNotice}
              </p>
            </div>
            <ShareCard
              story={localizedStory}
              quote={familyQuote || scene.endingText || localizedStory.quote}
              source={familyQuote ? "family" : "sample"}
            />
          </section>
        )}
      </div>
    </div>
  );
}
