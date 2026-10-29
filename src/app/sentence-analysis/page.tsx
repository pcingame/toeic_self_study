import Link from "next/link";
import { getSentenceAnalyses } from "@/lib/data/sentenceAnalyses";
import SentenceAnalysisComposer from "@/components/sentence-analysis/SentenceAnalysisComposer";
import DeleteAnalysisButton from "@/components/sentence-analysis/DeleteAnalysisButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

export default async function SentenceAnalysisPage() {
  const analyses = await getSentenceAnalyses();

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="h1-page">Phân tích câu</h1>
        <p className="mt-1 text-sm text-muted">
          Dán một câu tiếng Anh, AI sẽ phân tích phiên âm, dịch nghĩa, từ loại từng từ và cấu trúc ngữ pháp.
        </p>
      </div>

      <SentenceAnalysisComposer />

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Câu đã phân tích</h2>
        {analyses.length === 0 ? (
          <p className="text-sm text-muted">Chưa có câu nào được phân tích.</p>
        ) : (
          <div className="card divide-y divide-[var(--color-border)]">
            {analyses.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <Link href={`/sentence-analysis/${a.id}`} className="min-w-0 text-sm hover:text-[var(--color-primary)]">
                  <span className="font-medium">{a.sentence}</span>
                  <span className="ml-2 text-muted">{formatDate(a.created_at)}</span>
                </Link>
                <DeleteAnalysisButton analysisId={a.id} sentence={a.sentence} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
