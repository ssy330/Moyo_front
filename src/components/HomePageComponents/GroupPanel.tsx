import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "@/features/modalSlice";
import { PlusCircle, Users } from "lucide-react";
import { useMyGroups } from "@/hook/use-my-groups";

type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

export default function GroupPanel({ viewMode }: GroupPanelProps) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { data: groups, isLoading, error } = useMyGroups();

  const countText = isLoading
    ? "로딩 중..."
    : `${groups?.length ?? 0}개의 그룹이 있습니다`;

  return (
    <div className="flex max-h-[90vh] flex-col overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-8 shadow-md transition duration-200 hover:shadow-lg">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">내 그룹</h2>
        <p className="text-sm text-neutral-500">{countText}</p>
      </div>

      {/* 만들기 / 참여하기 버튼 */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => nav("/groups/new")}
          className="flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
        >
          <PlusCircle className="h-5 w-5" />
          그룹 만들기
        </button>

        <button
          onClick={() => dispatch(openModal({ type: "groupJoin" }))}
          className="flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
        >
          <Users className="h-5 w-5" />
          그룹 참여하기
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}

      {/* 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border bg-neutral-50"
            >
              <div className="aspect-video bg-neutral-200" />
              <div className="p-4">
                <div className="h-4 w-2/3 rounded bg-neutral-200" />
                <div className="mt-2 h-3 w-1/3 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 그룹 카드 */}
      {!isLoading && groups && (
        <div
          className={`grid gap-6 ${
            viewMode === "both"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-5"
          }`}
        >
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => nav(`/groups/${group.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={group.image_url || "/images/placeholder-group.jpg"}
                  alt={group.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-neutral-800">
                  {group.name}
                </h3>
                {typeof group.member_count === "number" && (
                  <p className="mt-1 text-sm text-neutral-500">
                    멤버 {group.member_count}명
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
