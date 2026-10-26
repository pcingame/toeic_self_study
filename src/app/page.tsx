import Link from "next/link";
import { getDashboardStats } from "@/lib/data/stats";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Chọn phần bạn muốn luyện tập hôm nay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Writing</p>
          <p className="mt-1 text-2xl font-semibold">
            {stats.writingQuestionsCovered}/{stats.writingQuestionsTotal}{" "}
            <span className="text-sm font-normal text-gray-400 dark:text-zinc-500">câu đã luyện</span>
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">{stats.writingAttemptsCount} lượt làm bài</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Speaking</p>
          <p className="mt-1 text-2xl font-semibold">
            {stats.speakingQuestionsCovered}/{stats.speakingQuestionsTotal}{" "}
            <span className="text-sm font-normal text-gray-400 dark:text-zinc-500">câu đã luyện</span>
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">{stats.speakingAttemptsCount} lượt làm bài</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/writing"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
        >
          <h2 className="font-medium">Luyện Writing</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">8 câu theo đúng format &amp; thời gian thi thật</p>
        </Link>
        <Link
          href="/speaking"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
        >
          <h2 className="font-medium">Luyện Speaking</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">11 câu, ghi âm và nghe lại bài làm</p>
        </Link>
        <Link
          href="/pronunciation"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
        >
          <h2 className="font-medium">Phát âm</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Dán danh sách từ, tra phiên âm &amp; mẹo phát âm</p>
        </Link>
        <Link
          href="/full-test"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
        >
          <h2 className="font-medium">Full Test</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Làm liên tục toàn bộ đề theo đúng thời gian thi</p>
        </Link>
        <Link
          href="/history"
          className="rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
        >
          <h2 className="font-medium">Lịch sử</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Xem lại bài viết và bài ghi âm đã làm</p>
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium">Hoạt động gần đây</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-zinc-400">Chưa có bài luyện tập nào.</p>
        ) : (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {stats.recentActivity.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{item.label}</span>
                <span className="text-gray-400 dark:text-zinc-500">{formatDate(item.startedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
