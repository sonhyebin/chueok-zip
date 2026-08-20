"use client";

import { useState } from "react";
import { CAPSULE_QUESTIONS } from "@/data/capsuleQuestions";

export default function CapsuleForm({
  initialName,
  nameLabel,
  submitLabel,
  onSubmit,
}: {
  initialName: string;
  nameLabel: string;
  submitLabel: string;
  onSubmit: (name: string, answers: string[]) => void;
}) {
  const [name, setName] = useState(initialName);
  const [answers, setAnswers] = useState<string[]>(
    Array(CAPSULE_QUESTIONS.length).fill(""),
  );

  const filled = answers.filter((a) => a.trim().length > 0).length;
  const ready = name.trim().length > 0 && filled === CAPSULE_QUESTIONS.length;

  function setAnswer(i: number, value: string) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)));
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit(name.trim(), answers.map((a) => a.trim()));
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

      {CAPSULE_QUESTIONS.map((q, i) => (
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
        {filled}/{CAPSULE_QUESTIONS.length} 답변 완료
      </p>

      <button type="submit" className="pixel-btn primary" disabled={!ready}>
        {submitLabel}
      </button>
    </form>
  );
}
