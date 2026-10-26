import Link from "next/link";

export default function FullTestLandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Full Test</h1>
        <p className="text-sm text-gray-500">
          Làm liên tục toàn bộ đề theo đúng thời gian của bài thi thật, không được tạm dừng giữa chừng.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/full-test/writing"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm"
        >
          <h2 className="font-medium">Full Test Writing</h2>
          <p className="mt-1 text-sm text-gray-500">8 câu · khoảng 60 phút</p>
        </Link>
        <Link
          href="/full-test/speaking"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm"
        >
          <h2 className="font-medium">Full Test Speaking</h2>
          <p className="mt-1 text-sm text-gray-500">11 câu · khoảng 20 phút</p>
        </Link>
      </div>
    </div>
  );
}
