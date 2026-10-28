import Link from "next/link";
import {
  LINKING_RULES,
  SAMPLE_READINGS,
  SCORE_3_3_PILLARS,
  SCORING_RUBRIC,
  SELF_STUDY_STEPS,
  STRESSED_WORD_TYPES,
  STRESS_EXCEPTIONS,
  STRESS_HOW_TO,
  STRESS_WORD_EXAMPLES,
  UNSTRESSED_WORD_TYPES,
} from "@/lib/speakingPart1Guide";

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") ? (
      <strong key={i} className="text-[var(--color-ink)]">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  );
}

export default function SpeakingPart1GuidePage() {
  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <Link href="/speaking" className="link-muted">
          ← Quay lại danh sách Speaking
        </Link>
        <h1 className="h1-page mt-2">Part 1 — Hướng dẫn phát âm & trọng âm</h1>
        <p className="mt-1 text-sm text-muted">
          Tóm tắt lý thuyết đọc to đoạn văn (Read a text aloud): tiêu chí chấm điểm, cách nhấn trọng âm, quy tắc nối
          âm và quy trình tự luyện tập chủ động.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Tiêu chí chấm điểm</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-muted">
                <th className="px-4 py-3 font-medium">Điểm</th>
                <th className="px-4 py-3 font-medium">Phát âm</th>
                <th className="px-4 py-3 font-medium">Ngữ điệu, ngắt nghỉ và nhấn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {SCORING_RUBRIC.map((row) => (
                <tr key={row.score}>
                  <td className="px-4 py-3 align-top font-medium">{row.score}</td>
                  <td className="px-4 py-3 align-top text-muted">{row.pronunciation}</td>
                  <td className="px-4 py-3 align-top text-muted">{row.prosody}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted">Để đạt 3/3, cần đồng thời:</span>
          {SCORE_3_3_PILLARS.map((p) => (
            <span key={p} className="tip-highlight">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Cách nhấn trọng âm</h2>
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STRESS_HOW_TO.map((s) => (
            <div key={s.factor} className="card p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{s.factor}</p>
              <p className="mt-1 text-sm text-muted">{s.direction}</p>
            </div>
          ))}
        </div>
        <div className="card flex flex-wrap gap-x-6 gap-y-2 p-4 text-sm">
          {STRESS_WORD_EXAMPLES.map((w) => (
            <span key={w.word}>
              <span className="font-medium text-[var(--color-ink)]">{w.word}</span>{" "}
              <span className="text-muted">/{w.ipa}/</span>
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Từ cần nhấn &amp; từ không nhấn</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card space-y-2 p-4">
            <p className="text-sm font-medium text-[var(--color-ink)]">Stressed — nên nhấn</p>
            <ul className="space-y-1.5 text-sm text-muted">
              {STRESSED_WORD_TYPES.map((t) => (
                <li key={t.type}>
                  <span className="text-[var(--color-ink)]/80">{t.type}:</span> {t.detail}
                </li>
              ))}
            </ul>
          </div>
          <div className="card space-y-2 p-4">
            <p className="text-sm font-medium text-[var(--color-ink)]">Unstressed — không nhấn (function words)</p>
            <ul className="space-y-1.5 text-sm text-muted">
              {UNSTRESSED_WORD_TYPES.map((t) => (
                <li key={t.type}>
                  <span className="text-[var(--color-ink)]/80">{t.type}:</span> {t.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card space-y-1.5 p-4">
          <p className="text-sm font-medium text-[var(--color-ink)]">Ngoại lệ với function words</p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
            {STRESS_EXCEPTIONS.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Quy tắc nối âm (Linking sounds)</h2>
        <div className="stagger grid gap-3 sm:grid-cols-2">
          {LINKING_RULES.map((rule) => (
            <div key={rule.title} className="card space-y-2 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{rule.title}</p>
              {rule.note && <p className="text-xs text-muted">{rule.note}</p>}
              <ul className="space-y-1 text-sm">
                {rule.examples.map((ex) => (
                  <li key={ex.text}>
                    <span className="text-[var(--color-ink)]/80">{ex.text}</span>{" "}
                    <span className="text-muted">/{ex.ipa}/</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Các bước tự học chủ động</h2>
        <ol className="card list-decimal space-y-3 p-4 pl-8 text-sm text-muted marker:font-medium marker:text-[var(--color-ink)]">
          {SELF_STUDY_STEPS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p className="text-xs text-muted">
          Từ điển tra phiên âm từng từ: oxfordlearnersdictionaries.com · Tra phiên âm cả câu: tophonetics.com
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Mẫu luyện đọc (đã đánh dấu nhấn)</h2>
        <div className="space-y-3">
          {SAMPLE_READINGS.map((r) => (
            <div key={r.title} className="card space-y-2 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">{r.title}</p>
              <p className="text-sm leading-relaxed text-muted">{renderBold(r.text)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
