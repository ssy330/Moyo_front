import { useNavigate } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import { AuthError, useMyGroups } from "@/hook/use-my-groups";
import GroupCard from "./GroupCard";
import GroupLoader from "./GroupLoader";
import GroupError from "./GroupError";
import GroupJoinModal from "../modal/GroupJoinModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLeaveGroupWithConfirm } from "@/hook/mutation/use-group-leave-mutation";

type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

export default function GroupPanel({ viewMode }: GroupPanelProps) {
  const nav = useNavigate();

  const [joinOpen, setJoinOpen] = useState(false);
  const { data: groups, isLoading, error } = useMyGroups();

  console.log(groups);

  // 그룹 개수 텍스트
  const countText = isLoading
    ? "로딩 중..."
    : `${groups?.length ?? 0}개의 그룹이 있습니다`;

  useEffect(() => {
    if (!error) return;
    // 🔹 인증 관련 에러면
    if (error instanceof AuthError) {
      toast.warning(error.message); // "세션이 만료되었습니다. 다시 로그인해 주세요."
      nav("/login", { replace: true }); // 로그인 페이지로 이동
      return;
    }
    // 다른 에러는 그냥 일반 에러 토스트
    toast.error("그룹 목록을 불러오지 못했습니다.");
  }, [error, nav]);

  const { handleLeaveGroup, isPending } = useLeaveGroupWithConfirm();

  return (
    <>
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
            className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
          >
            <PlusCircle className="h-5 w-5" />
            그룹 만들기
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
          >
            <Users className="h-5 w-5" />
            그룹 참여하기
          </button>
        </div>

        {/* 에러 */}
        {error && <GroupError error={error} />}

        {/* 스켈레톤 */}
        {isLoading && <GroupLoader />}

        {/* 그룹이 하나도 없을 때 */}
        {!isLoading && !error && (groups?.length ?? 0) === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 py-10 text-center">
            <p className="mb-2 text-base font-semibold text-neutral-800">
              아직 참여 중인 그룹이 없습니다.
            </p>
            <p className="mb-4 text-sm text-neutral-500">
              새로운 그룹을 만들거나 초대 코드를 입력해 모임에 참여해 보세요.
            </p>
          </div>
        )}

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
              <GroupCard
                key={group.id}
                {...group}
                onLeaveGroup={handleLeaveGroup}
                isLeaving={isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ 여기서 직접 모달 렌더 */}
      <GroupJoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
}
