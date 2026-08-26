"use client";

import { useState } from "react";
import {
  CAPSULE_QUESTIONS,
  type CapsuleQuestion,
} from "@/data/capsuleQuestions";

export default function CapsuleForm({
  initialName,
  nameLabel,
  submitLabel,
  questions = CAPSULE_QUESTIONS,
  onSubmit,
}: {
  initialName: string;
  nameLabel: string;
  submitLabel: string;
  questions?: CapsuleQuestion[];
  onSubmit: (name: string, answers: string[]) => void | Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [submitting, setSubmitting] = useState(false);

  const filled = answers.filter((a) => a.trim().length > 0).length;
  const ready = name.trim().length > 0 && filled === questions.length;

  function setAnswer(i: number, value: string) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)));
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!ready || submitting) return;
        setSubmitting(true);
        try {
          await onSubmit(name.trim(), answers.map((a) => a.trim()));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-pixel text-[15px]">{nameLabel}</span>
        <input
          className="pixel-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 혜빈"
          maxLength={12}
          required
        />
      </label>

      {questions.map((q, i) => (
        <label key={q.id} className="flex flex-col gap-1.5">
          <span className="font-pixel text-[15px]">
            {q.emoji} Q{i + 1}. {q.text}
          </span>
          <textarea
            className="pixel-input"
            rows={2}
            value={answers[i]}
            onChange={(e) => setAnswer(i, e.target.value)}
            placeholder={q.placeholder}
            maxLength={200}
          />
        </label>
      ))}

      <p className="text-center text-[13px] text-[#5a6b80] font-pixel">
        {filled}/{questions.length} 답변 완료
      </p>

      <button
        type="submit"
        className="pixel-btn primary"
        disabled={!ready || submitting}
      >
        {submitting ? "저장하는 중..." : submitLabel}
      </button>
    </form>
  );
}
