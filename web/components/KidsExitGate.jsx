"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useLocale } from "./LocaleProvider";

const QUESTION = { left: 6, right: 7, answer: 13 };

const COPY = {
  zh: {
    done: "已确认，回到成人模式",
    prompt: (left, right) => `这一步请家长完成：${left} + ${right} = ?`,
    label: "答案",
    submit: "确认并回成人模式",
    wrong: "答案不对，请家长再试一次。",
  },
  en: {
    done: "Confirmed — back to grown-up mode",
    prompt: (left, right) => `Grown-ups only: ${left} + ${right} = ?`,
    label: "Answer",
    submit: "Confirm and go back",
    wrong: "That is not right. Please ask a grown-up to try again.",
  },
};

export default function KidsExitGate() {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();

  if (unlocked) {
    return (
      <Link className="btn btn-primary" href="/">
        {c.done} <span aria-hidden="true">→</span>
      </Link>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    if (answer.trim() !== String(QUESTION.answer)) {
      setError(c.wrong);
      return;
    }
    setError("");
    setUnlocked(true);
  };

  return (
    <form className="kids-exit-gate" id="exit" onSubmit={submit}>
      <p className="kids-exit-question">{c.prompt(QUESTION.left, QUESTION.right)}</p>
      <div className="kids-exit-row">
        <label htmlFor={inputId}>{c.label}</label>
        <input
          id={inputId}
          inputMode="numeric"
          autoComplete="off"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError("");
          }}
        />
        <button type="submit" className="btn btn-primary">
          {c.submit}
        </button>
      </div>
      {error ? <p className="kids-exit-error">{error}</p> : null}
    </form>
  );
}
