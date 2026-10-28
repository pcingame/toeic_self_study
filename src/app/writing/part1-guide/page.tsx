import Link from "next/link";
import {
  CONNECTOR_GRAMMAR,
  EXAM_INFO,
  EXAM_TIPS,
  GENERAL_WRITING_PROCESS,
  MAX_SCORE_CRITERIA,
  SAMPLE_CORRECTIONS,
  SCORING_RUBRIC,
  SENTENCE_PATTERNS,
  WRITING_STEPS,
} from "@/lib/writingPart1Guide";

export default function WritingPart1GuidePage() {
  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <Link href="/writing" className="link-muted">
          ← Quay lại danh sách Writing
        </Link>
        <h1 className="h1-page mt-2">Part 1 — Hướng dẫn viết câu từ tranh</h1>
        <p className="mt-1 text-sm text-muted">
          Tóm tắt lý thuyết viết câu mô tả tranh: cấu trúc đề, tiêu chí chấm điểm, các mẫu câu cơ bản, quy trình viết
          câu, mẹo làm bài và ngữ pháp liên từ thường gặp.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Cấu trúc đề bài</h2>
        <div className="card space-y-1.5 p-4 text-sm text-muted">
          <p>{EXAM_INFO.questions}</p>
          <p>{EXAM_INFO.wordTypes}</p>
          <p>{EXAM_INFO.time}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Tiêu chí chấm điểm</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-muted">
                <th className="px-4 py-3 font-medium">Điểm</th>
                <th className="px-4 py-3 font-medium">Mô tả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {SCORING_RUBRIC.map((row) => (
                <tr key={row.score}>
                  <td className="px-4 py-3 align-top font-medium">{row.score}</td>
                  <td className="px-4 py-3 align-top text-muted">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card space-y-1.5 p-4">
          <p className="text-sm font-medium text-[var(--color-ink)]">Để đạt điểm tối đa, câu văn cần:</p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
            {MAX_SCORE_CRITERIA.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">5 mẫu câu cơ bản</h2>
        <div className="stagger grid gap-3 sm:grid-cols-2">
          {SENTENCE_PATTERNS.map((p) => (
            <div key={p.pattern} className="card space-y-2 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{p.pattern}</p>
              <ul className="space-y-1 text-sm text-muted">
                {p.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Các bước tư duy viết câu tả tranh</h2>
        <div className="space-y-3">
          {WRITING_STEPS.map((s) => (
            <div key={s.title} className="card space-y-1 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{s.title}</p>
              <p className="text-sm text-muted">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Quy trình đặt câu chung (từ ý tiếng Việt)</h2>
        <ol className="card list-decimal space-y-2 p-4 pl-8 text-sm text-muted marker:font-medium marker:text-[var(--color-ink)]">
          {GENERAL_WRITING_PROCESS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Mẹo làm bài</h2>
        <ul className="card list-disc space-y-2 p-4 pl-8 text-sm text-muted">
          {EXAM_TIPS.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Ngữ pháp liên từ thường gặp</h2>
        <div className="stagger grid gap-3 sm:grid-cols-2">
          {CONNECTOR_GRAMMAR.map((g) => (
            <div key={g.title} className="card space-y-2 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{g.title}</p>
              <p className="text-xs text-muted">{g.note}</p>
              <ul className="space-y-1 text-sm text-muted">
                {g.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Lỗi thường gặp &amp; cách sửa</h2>
        <div className="card divide-y divide-[var(--color-border)]">
          {SAMPLE_CORRECTIONS.map((c) => (
            <div key={c.wordPair} className="space-y-1.5 p-4">
              <p className="text-xs font-medium text-muted">{c.wordPair}</p>
              <p className="text-sm text-error line-through decoration-1">{c.before}</p>
              <p className="text-sm text-success">{c.after}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
