import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "@/features/modalSlice";
import { PlusCircle, Users } from "lucide-react";
import { useMyGroups } from "@/hook/use-my-groups";
import GroupCard from "./GroupCard";
import GroupLoader from "./GroupLoader";
import GroupError from "./GroupError";

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
      {error && <GroupError error={error} />}

      {/* 스켈레톤 */}
      {isLoading && <GroupLoader />}

      {/* 그룹 카드 */}
      {!isLoading && groups && (
        <div
          className={`grid gap-6 ${
            viewMode === "both"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {groups.map((group) => (
            <GroupCard key={group.id} {...group} />
          ))}
        </div>
      )}
    </div>
  );
}
