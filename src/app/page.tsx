import Link from "next/link";
import { getDashboardStats } from "@/lib/data/stats";
import AnimatedNumber from "@/components/AnimatedNumber";
import { PenIcon, MicIcon, PhoneticIcon, StopwatchIcon, HistoryIcon } from "@/components/icons";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

const SECTIONS = [
  { href: "/writing", title: "Luyện Writing", desc: "8 câu theo đúng format & thời gian thi thật", Icon: PenIcon },
  { href: "/speaking", title: "Luyện Speaking", desc: "11 câu, ghi âm và nghe lại bài làm", Icon: MicIcon },
  { href: "/pronunciation", title: "Phát âm", desc: "Dán từ, câu, hay đoạn văn — tra phiên âm & mẹo phát âm", Icon: PhoneticIcon },
  { href: "/full-test", title: "Full Test", desc: "Làm liên tục toàn bộ đề theo đúng thời gian thi", Icon: StopwatchIcon },
  { href: "/history", title: "Lịch sử", desc: "Xem lại bài viết và bài ghi âm đã làm", Icon: HistoryIcon },
];

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="animate-fade-up space-y-10">
      <div>
        <h1 className="h1-page">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted">Chọn phần bạn muốn luyện tập hôm nay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Writing</p>
          <p className="mt-1 font-display text-3xl font-semibold">
            <AnimatedNumber value={stats.writingQuestionsCovered} />/{stats.writingQuestionsTotal}{" "}
            <span className="text-sm font-sans font-normal text-muted">câu đã luyện</span>
          </p>
          <p className="mt-1 text-xs text-muted">{stats.writingAttemptsCount} lượt làm bài</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Speaking</p>
          <p className="mt-1 font-display text-3xl font-semibold">
            <AnimatedNumber value={stats.speakingQuestionsCovered} />/{stats.speakingQuestionsTotal}{" "}
            <span className="text-sm font-sans font-normal text-muted">câu đã luyện</span>
          </p>
          <p className="mt-1 text-xs text-muted">{stats.speakingAttemptsCount} lượt làm bài</p>
        </div>
      </div>

      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, title, desc, Icon }) => (
          <Link key={href} href={href} className="card-link group p-5">
            <Icon className="h-6 w-6 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:text-[var(--color-accent)]" />
            <h2 className="mt-3 font-medium">{title}</h2>
            <p className="mt-1 text-sm text-muted">{desc}</p>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Hoạt động gần đây</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-muted">Chưa có bài luyện tập nào.</p>
        ) : (
          <div className="card divide-y divide-[var(--color-border)]">
            {stats.recentActivity.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <span>{item.label}</span>
                <span className="text-muted">{formatDate(item.startedAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
