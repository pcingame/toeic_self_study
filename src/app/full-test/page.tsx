import Link from "next/link";

export default function FullTestLandingPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="h1-page">Full Test</h1>
        <p className="mt-1 text-sm text-muted">
          Làm liên tục toàn bộ đề theo đúng thời gian của bài thi thật, không được tạm dừng giữa chừng.
        </p>
      </div>
      <div className="stagger grid gap-4 sm:grid-cols-2">
        <Link href="/full-test/writing" className="card-link p-5">
          <h2 className="font-medium">Full Test Writing</h2>
          <p className="mt-1 text-sm text-muted">8 câu · khoảng 60 phút</p>
        </Link>
        <Link href="/full-test/speaking" className="card-link p-5">
          <h2 className="font-medium">Full Test Speaking</h2>
          <p className="mt-1 text-sm text-muted">11 câu · khoảng 20 phút</p>
        </Link>
      </div>
    </div>
  );
}
