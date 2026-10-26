import { notFound } from "next/navigation";
import Link from "next/link";
import { getPronunciationListWithItems } from "@/lib/data/pronunciation";
import PronunciationWordCard from "@/components/pronunciation/PronunciationWordCard";

export default async function PronunciationListPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  const result = await getPronunciationListWithItems(listId);
  if (!result) notFound();

  const { list, items } = result;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/pronunciation" className="text-sm text-gray-500 hover:text-blue-600">
            ← Quay lại Phát âm
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">{list.title}</h1>
          <p className="text-sm text-gray-500">{items.length} từ</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PronunciationWordCard key={item.id} word={item.word} />
        ))}
      </div>
    </div>
  );
}
