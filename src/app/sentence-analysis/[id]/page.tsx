import { notFound } from "next/navigation";
import Link from "next/link";
import { getSentenceAnalysisById } from "@/lib/data/sentenceAnalyses";

export default async function SentenceAnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const analysis = await getSentenceAnalysisById(id);
  if (!analysis) notFound();

  return (
    <div className="animate-fade-up space-y-6">
      <Link href="/sentence-analysis" className="link-muted">
        ← Quay lại Phân tích câu
      </Link>

      <div className="card space-y-2 p-5">
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">&ldquo;{analysis.sentence}&rdquo;</p>
        <p className="text-sm text-muted">có nghĩa là: &ldquo;{analysis.translation}&rdquo;</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-medium">1. Phiên âm và dịch nghĩa</h2>
        <div className="card space-y-1.5 p-4 text-sm">
          <p>
            <span className="font-medium text-[var(--color-ink)]">IPA (Anh-Mỹ):</span> {analysis.ipa_us}
          </p>
          <p>
            <span className="font-medium text-[var(--color-ink)]">IPA (Anh-Anh):</span> {analysis.ipa_uk}
          </p>
          <p>
            <span className="font-medium text-[var(--color-ink)]">Đọc gần giống tiếng Việt:</span>{" "}
            {analysis.vietnamese_approx}
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-medium">2. Phân tích từ loại từng từ</h2>
        <div className="card overflow-x-auto p-4">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-muted">
                <th className="pb-2 pr-3 font-medium">Từ</th>
                <th className="pb-2 pr-3 font-medium">Phiên âm</th>
                <th className="pb-2 pr-3 font-medium">Từ loại</th>
                <th className="pb-2 font-medium">Nghĩa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {analysis.words.map((w, i) => (
                <tr key={i}>
                  <td className="py-2 pr-3 font-medium text-[var(--color-ink)]">{w.word}</td>
                  <td className="py-2 pr-3 text-muted">{w.ipa}</td>
                  <td className="py-2 pr-3 text-muted">{w.partOfSpeech}</td>
                  <td className="py-2 text-[var(--color-ink)]">{w.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {analysis.note && <p className="tip-highlight inline-block">Lưu ý: {analysis.note}</p>}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-medium">3. Phân tích cấu trúc ngữ pháp</h2>
        <div className="stagger space-y-3">
          {analysis.clauses.map((c, i) => (
            <div key={i} className="card space-y-2 p-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {c.type}: <span className="font-normal italic text-muted">{c.text}</span>
              </p>
              <ul className="space-y-1 text-sm">
                {c.parts.map((p, j) => (
                  <li key={j}>
                    <span className="font-medium text-[var(--color-ink)]">{p.role}:</span>{" "}
                    <span className="text-muted">{p.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted">Nghĩa: {c.meaning}</p>
            </div>
          ))}
        </div>

        <div className="card space-y-1.5 p-4 text-sm">
          <p className="font-medium text-[var(--color-ink)]">Cấu trúc tổng quát:</p>
          <p className="font-display text-base text-[var(--color-primary)]">{analysis.structure_pattern}</p>
          <p className="text-muted">{analysis.structure_legend}</p>
        </div>
      </section>
    </div>
  );
}
