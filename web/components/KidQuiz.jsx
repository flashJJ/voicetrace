"use client";

import Link from "next/link";
import { useState } from "react";
import { saveKidQuiz } from "../lib/kid-progress";

export default function KidQuiz({ slug, storyTitle, quiz }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [solved, setSolved] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz[index];
  const isLast = index + 1 >= quiz.length;

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
      saveKidQuiz(slug, { answers, correct, total: quiz.length });
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

  if (finished) {
    const perfect = correct === quiz.length;
    return (
      <section className="kid-quiz kid-quiz-result" aria-label="小测结果">
        <span className="eyebrow">小测完成</span>
        <p className="kid-quiz-score">
          {correct} / {quiz.length}
        </p>
        <p className="kid-quiz-result-text">
          {perfect
            ? `《${storyTitle}》你听得很仔细，全部答对。`
            : correct > 0
              ? "答对了几题，已经很棒。可以回去再听一遍，也可以看学习小结。"
              : "没关系，回去再听一遍故事，答案都藏在故事里。"}
        </p>
        <div className="kid-quiz-actions">
          <Link className="btn btn-primary" href={`/kids/${slug}/summary`}>
            看学习小结
          </Link>
          <Link className="btn btn-ghost" href={`/kids/${slug}`}>
            回故事再听
          </Link>
          <button type="button" className="btn btn-ghost" onClick={retry}>
            再做一次
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="kid-quiz" aria-label="故事小测">
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
      <p className="kid-quiz-count">
        第 {index + 1} 题 / 共 {quiz.length} 题
      </p>
      <h2 className="kid-quiz-question">{question.question}</h2>

      <div className="kid-quiz-options">
        {question.options.map((option, optionIndex) => {
          const isRight = solved && optionIndex === question.answer;
          const isWrong = !solved && picked === optionIndex && optionIndex !== question.answer;
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
        <p className="kid-quiz-feedback is-hint">再想想：{question.hint}</p>
      ) : null}
      {solved ? (
        <p className="kid-quiz-feedback is-right">
          答对了！{isLast ? "最后一题也完成了。" : "继续下一题。"}
        </p>
      ) : null}

      <div className="kid-quiz-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={next}
          disabled={!solved}
        >
          {isLast ? "看结果" : "下一题"}
        </button>
        <Link className="btn btn-ghost" href={`/kids/${slug}`}>
          先回故事
        </Link>
      </div>
    </section>
  );
}
