import Link from "next/link";
import { getPronunciationLists } from "@/lib/data/pronunciation";
import { GENERAL_PRONUNCIATION_TIPS } from "@/lib/pronunciationTips";
import PronunciationComposer from "@/components/pronunciation/PronunciationComposer";
import { deletePronunciationList } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

export default async function PronunciationPage() {
  const lists = await getPronunciationLists();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Phát âm</h1>
        <p className="text-sm text-gray-500">
          Dán danh sách từ cần luyện, hệ thống sẽ tra phiên âm, cho nghe audio chuẩn và gợi ý mẹo phát âm.
        </p>
      </div>

      <PronunciationComposer />

      <section className="space-y-3">
        <h2 className="font-medium">Danh sách đã lưu</h2>
        {lists.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có danh sách nào.</p>
        ) : (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {lists.map((list) => (
              <div key={list.id} className="flex items-center justify-between px-4 py-3">
                <Link href={`/pronunciation/${list.id}`} className="text-sm hover:text-blue-600">
                  <span className="font-medium">{list.title}</span>
                  <span className="ml-2 text-gray-400">
                    {list.item_count} từ · {formatDate(list.created_at)}
                  </span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deletePronunciationList(list.id);
                  }}
                >
                  <button type="submit" className="text-xs text-gray-400 hover:text-red-600">
                    Xóa
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Mẹo phát âm chung</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {GENERAL_PRONUNCIATION_TIPS.map((tip) => (
            <div key={tip.title} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-900">{tip.title}</p>
              <p className="mt-1 text-sm text-gray-600">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
