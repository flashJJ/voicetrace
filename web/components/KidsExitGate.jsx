"use client";

import Link from "next/link";
import { useId, useState } from "react";

const QUESTION = { left: 6, right: 7, answer: 13 };

export default function KidsExitGate() {
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();

  if (unlocked) {
    return (
      <Link className="btn btn-primary" href="/">
        已确认，回到成人模式 <span aria-hidden="true">→</span>
      </Link>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    if (answer.trim() !== String(QUESTION.answer)) {
      setError("答案不对，请家长再试一次。");
      return;
    }
    setError("");
    setUnlocked(true);
  };

  return (
    <form className="kids-exit-gate" id="exit" onSubmit={submit}>
      <p className="kids-exit-question">
        这一步请家长完成：{QUESTION.left} + {QUESTION.right} = ?
      </p>
      <div className="kids-exit-row">
        <label htmlFor={inputId}>答案</label>
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
          确认并回成人模式
        </button>
      </div>
      {error ? <p className="kids-exit-error">{error}</p> : null}
    </form>
  );
}
