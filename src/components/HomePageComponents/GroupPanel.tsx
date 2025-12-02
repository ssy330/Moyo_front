import { useNavigate } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import { AuthError, useMyGroups } from "@/hooks/use-my-groups";
import GroupCard from "./GroupCard";
import GroupLoader from "./GroupLoader";
import GroupError from "./GroupError";
import GroupJoinModal from "../modal/GroupJoinModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLeaveGroupWithConfirm } from "@/hooks/mutation/group/use-group-leave-mutation";
import { clearSession } from "@/features/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

export default function GroupPanel({ viewMode }: GroupPanelProps) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [joinOpen, setJoinOpen] = useState(false);

  const { session } = useSelector((state: RootState) => state.session);

  const { data: groups, isLoading, error } = useMyGroups(!!session);

  const [authHandled, setAuthHandled] = useState(false);

  const countText = isLoading
    ? "로딩 중..."
    : `${groups?.length ?? 0}개의 그룹이 있습니다`;

  useEffect(() => {
    if (!error) return;
    if (authHandled) return;

    if (error instanceof AuthError) {
      setAuthHandled(true);
      dispatch(clearSession());
      toast.warning(error.message);
      nav("/login", { replace: true });
      return;
    }

    toast.error("그룹 목록을 불러오지 못했습니다.");
  }, [error, authHandled, dispatch, nav]);

  const { handleLeaveGroup, isPending } = useLeaveGroupWithConfirm();

  return (
    <>
      <div className="border-border bg-card flex max-h-[90vh] flex-col overflow-y-auto rounded-2xl border p-8 shadow-md transition duration-200 hover:shadow-lg">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold">내 그룹</h2>
          <p className="text-muted-foreground text-sm">{countText}</p>
        </div>

        {/* 만들기 / 참여하기 버튼 */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => nav("/groups/new")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex min-w-40 flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-md transition active:scale-[0.98]"
          >
            <PlusCircle className="h-5 w-5" />
            그룹 만들기
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex min-w-40 flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-md transition active:scale-[0.98]"
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
          <div className="border-border bg-muted flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
            <p className="text-foreground mb-2 text-base font-semibold">
              아직 참여 중인 그룹이 없습니다.
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
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

      <GroupJoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
}
