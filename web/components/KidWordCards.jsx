"use client";

import { useEffect, useState } from "react";
import { readKidProgress, toggleKnownWord } from "../lib/kid-progress";
import { useSpeechPlayback } from "../hooks/useSpeechPlayback";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    aria: "本幕词语",
    title: "本幕词语",
    hint: "点开看意思，认识了就点一下。",
    listenTerm: (term) => `听「${term}」的粤语发音`,
    known: "学会了 ✓",
    unknown: "我学会了",
  },
  en: {
    aria: "Words in this act",
    title: "Words in this act",
    hint: "Tap to see the meaning. Tap again once you know it.",
    listenTerm: (term) => `Hear “${term}” in Cantonese`,
    known: "Known ✓",
    unknown: "I know it",
  },
};

export default function KidWordCards({ slug, words }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const { speaking, message: listenMessage, speak, stop } = useSpeechPlayback();
  const [expanded, setExpanded] = useState(null);
  const [known, setKnown] = useState([]);
  const [speakingTerm, setSpeakingTerm] = useState(null);

  useEffect(() => {
    setExpanded(null);
    try {
      setKnown(readKidProgress(slug).words);
    } catch (error) {
      setKnown([]);
    }
  }, [slug]);

  useEffect(() => {
    if (!speaking) setSpeakingTerm(null);
  }, [speaking]);

  if (!words?.length) return null;

  const handleToggle = (term) => {
    const entry = toggleKnownWord(slug, term);
    setKnown(entry.words);
  };

  const listen = (term) => {
    if (speakingTerm === term) {
      stop();
      return;
    }
    setSpeakingTerm(term);
    speak(term, { lang: "yue" });
  };

  return (
    <section className="kid-wordcards" id="kid-wordcards" aria-label={c.aria}>
      <div className="kid-wordcards-head">
        <h3>{c.title}</h3>
        <span className="kid-learn-hint">{c.hint}</span>
      </div>
      {listenMessage ? <p className="kid-learn-hint">{listenMessage}</p> : null}
      <div className="kid-wordcards-list">
        {words.map((word) => {
          const isOpen = expanded === word.term;
          const isKnown = known.includes(word.term);
          const isSpeaking = speakingTerm === word.term;
          return (
            <article
              key={word.term}
              className={`kid-wordcard ${isKnown ? "is-known" : ""}`}
            >
              <div className="kid-wordcard-head">
                <button
                  type="button"
                  className="kid-wordcard-term"
                  onClick={() => setExpanded(isOpen ? null : word.term)}
                  aria-expanded={isOpen}
                >
                  {word.term}
                </button>
                <button
                  type="button"
                  className="kid-wordcard-listen"
                  onClick={() => listen(word.term)}
                  aria-label={c.listenTerm(word.term)}
                  aria-pressed={isSpeaking}
                >
                  <span aria-hidden="true">{isSpeaking ? "■" : "▶"}</span>
                </button>
              </div>
              {isOpen ? (
                <>
                  <p>{word.meaning}</p>
                  <p className="kid-wordcard-example">{word.example}</p>
                </>
              ) : null}
              <button
                type="button"
                className="kid-wordcard-toggle"
                onClick={() => handleToggle(word.term)}
              >
                {isKnown ? c.known : c.unknown}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
