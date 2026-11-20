"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSpeechPlayback } from "../hooks/useSpeechPlayback";
import { saveKidQuiz } from "../lib/kid-progress";
import { localizeLearning, localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";
import SpeechRateControl from "./SpeechRateControl";

const COPY = {
  zh: {
    resultAria: "小测结果",
    quizAria: "故事小测",
    kidsMeta: (ageBand) => `${ageBand} 岁 · 儿童模式`,
    back: "回故事",
    heroText: (count) =>
      `${count} 道题都来自故事内容。答错不扣分，会给你一句提示，可以重新选。`,
    note: "小测结果只保存在这台设备，用来生成学习小结，不上传、不排名。",
    eyebrow: "小测完成",
    perfect: (title) => `《${title}》你听得很仔细，全部答对。`,
    partial: "答对了几题，已经很棒。可以回去再听一遍，也可以看学习小结。",
    none: "没关系，回去再听一遍故事，答案都藏在故事里。",
    summary: "看学习小结",
    backStory: "回故事再听",
    retry: "再做一次",
    count: (index, total) => `第 ${index} 题 / 共 ${total} 题`,
    stop: "停止",
    listen: "听题目",
    listenHint: "不认识字？点「听题目」，或请家长读一遍。",
    optionSpeech: (index, option) => `第 ${index} 个：${option}`,
    speechJoin: "。",
    feedbackHint: (hint) => `再想想：${hint}`,
    feedbackRight: (isLast) =>
      isLast ? "答对了！最后一题也完成了。" : "答对了！继续下一题。",
    result: "看结果",
    next: "下一题",
    backShort: "先回故事",
  },
  en: {
    resultAria: "Quiz result",
    quizAria: "Story quiz",
    kidsMeta: (ageBand) => `${ageBand} · Kids mode`,
    back: "Back to story",
    heroText: (count) =>
      `${count} questions, all from the story. Wrong answers cost nothing — you get a hint and can try again.`,
    note: "Quiz results stay on this device to build your learning summary. They are not uploaded and not ranked.",
    eyebrow: "Quiz complete",
    perfect: (title) => `You listened carefully to “${title}” — all correct.`,
    partial: "You got some right, which is great. Read the story again, or check your learning summary.",
    none: "No worries. Read the story again — the answers are hidden in it.",
    summary: "Learning summary",
    backStory: "Read the story again",
    retry: "Try again",
    count: (index, total) => `Question ${index} of ${total}`,
    stop: "Stop",
    listen: "Hear the question",
    listenHint: "Still learning to read? Tap “Hear the question”, or ask a grown-up to read it.",
    optionSpeech: (index, option) => `Option ${index}: ${option}`,
    speechJoin: ". ",
    feedbackHint: (hint) => `Think again: ${hint}`,
    feedbackRight: (isLast) =>
      isLast ? "Correct! That was the last question." : "Correct! On to the next one.",
    result: "See result",
    next: "Next question",
    backShort: "Back to the story",
  },
};

export default function KidQuiz({ story, learning }) {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const localizedStory = localizeStory(story, locale, localize);
  const quiz = localizeLearning(story.slug, learning, locale, localize).quiz;
  const { speaking, message: listenMessage, speak, stop } = useSpeechPlayback();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [solved, setSolved] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz[index];
  const isLast = index + 1 >= quiz.length;

  useEffect(() => {
    stop();
  }, [index, finished, stop]);

  const readQuestion = () => {
    if (speaking) {
      stop();
      return;
    }
    const options = question.options
      .map((option, optionIndex) => c.optionSpeech(optionIndex + 1, option))
      .join(c.speechJoin);
    speak(`${question.question}${c.speechJoin}${options}`, {
      lang: locale === "en" ? "en" : "zh",
    });
  };

  const choose = (optionIndex) => {
    if (solved) return;
    setPicked(optionIndex);
    if (optionIndex !== question.answer) return;
    setSolved(true);
    setAnswers((prev) => [...prev, optionIndex]);
    setCorrect((prev) => prev + 1);
  };

  const next = () => {
    if (isLast) {
      saveKidQuiz(story.slug, { answers, correct, total: quiz.length });
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setPicked(null);
    setSolved(false);
  };

  const retry = () => {
    setIndex(0);
    setPicked(null);
    setSolved(false);
    setAnswers([]);
    setCorrect(0);
    setFinished(false);
  };

  const renderResult = () => {
    const perfect = correct === quiz.length;
    return (
      <section className="kid-quiz kid-quiz-result" aria-label={c.resultAria}>
        <span className="eyebrow">{c.eyebrow}</span>
        <p className="kid-quiz-score">
          {correct} / {quiz.length}
        </p>
        <p className="kid-quiz-result-text">
          {perfect ? c.perfect(localizedStory.title) : correct > 0 ? c.partial : c.none}
        </p>
        <div className="kid-quiz-actions">
          <Link className="btn btn-primary" href={`/kids/${story.slug}/summary`}>
            {c.summary}
          </Link>
          <Link className="btn btn-ghost" href={`/kids/${story.slug}`}>
            {c.backStory}
          </Link>
          <button type="button" className="btn btn-ghost" onClick={retry}>
            {c.retry}
          </button>
        </div>
      </section>
    );
  };

  return (
    <main className="container kids-page kid-quiz-page">
      <div className="reader-top">
        <Link href={`/kids/${story.slug}`} className="reader-back">
          <span aria-hidden="true">←</span> {c.back}
        </Link>
        <span>{c.kidsMeta(localizedStory.ageBand)}</span>
      </div>

      <section className="kids-hero kid-quiz-hero">
        <span className="eyebrow">{c.quizAria}</span>
        <h1>{localizedStory.title}</h1>
        <p>{c.heroText(quiz.length)}</p>
      </section>

      {finished ? (
        renderResult()
      ) : (
        <section className="kid-quiz" aria-label={c.quizAria}>
          <div className="kid-quiz-progress" aria-hidden="true">
            {quiz.map((item, itemIndex) => (
              <span
                key={item.question}
                className={`kid-quiz-dot ${
                  itemIndex < index ? "is-done" : itemIndex === index ? "is-active" : ""
                }`}
              />
            ))}
          </div>
          <p className="kid-quiz-count">{c.count(index + 1, quiz.length)}</p>
          <h2 className="kid-quiz-question">{question.question}</h2>

          <div className="kid-quiz-read">
            <button type="button" className="kid-quiz-listen" onClick={readQuestion}>
              {speaking ? c.stop : c.listen}
            </button>
            <span>{c.listenHint}</span>
          </div>
          <SpeechRateControl />
          {listenMessage ? <p className="kid-quiz-listen-hint">{listenMessage}</p> : null}

          <div className="kid-quiz-options">
            {question.options.map((option, optionIndex) => {
              const isRight = solved && optionIndex === question.answer;
              const isWrong =
                !solved && picked === optionIndex && optionIndex !== question.answer;
              return (
                <button
                  type="button"
                  key={option}
                  className={`kid-quiz-option ${isRight ? "is-right" : ""} ${
                    isWrong ? "is-wrong" : ""
                  }`}
                  onClick={() => choose(optionIndex)}
                >
                  <span>{option}</span>
                  {isRight ? <span aria-hidden="true">✓</span> : null}
                  {isWrong ? <span aria-hidden="true">×</span> : null}
                </button>
              );
            })}
          </div>

          {picked !== null && !solved ? (
            <p className="kid-quiz-feedback is-hint">{c.feedbackHint(question.hint)}</p>
          ) : null}
          {solved ? (
            <p className="kid-quiz-feedback is-right">{c.feedbackRight(isLast)}</p>
          ) : null}

          <div className="kid-quiz-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={next}
              disabled={!solved}
            >
              {isLast ? c.result : c.next}
            </button>
            <Link className="btn btn-ghost" href={`/kids/${story.slug}`}>
              {c.backShort}
            </Link>
          </div>
        </section>
      )}

      <p className="kids-note">{c.note}</p>
    </main>
  );
}
