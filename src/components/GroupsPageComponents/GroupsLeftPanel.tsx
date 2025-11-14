import { Settings } from "lucide-react";
import { openModal } from "@/features/modalSlice";
import { useMyGroups } from "@/hook/use-my-groups";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function GroupsLeftPanel() {
  const { data: groups } = useMyGroups();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const group = groups?.find((g) => g.id === Number(id));
  console.log(group);

  return (
    <aside className="space-y-5">
      {/* 커버 이미지 */}
      <div className="relative overflow-hidden rounded-2xl shadow-sm">
        {group?.image_url ? (
          <img
            src={group.image_url}
            alt={`${group?.name ?? "그룹"} 커버`}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-neutral-200 text-neutral-500">
            커버 이미지 없음
          </div>
        )}

        <button
          aria-label="그룹 설정"
          className="absolute right-3 bottom-3 rounded-full bg-white/80 p-2 text-neutral-700 transition hover:bg-white"
          onClick={() => dispatch(openModal({ type: "groupSetting" }))}
        >
          <Settings size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* 그룹 정보 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900">
          {group?.name ?? "이름없음"}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {group?.description ?? "그룹 설명이 없습니다."}
        </p>

        {/* 멤버수 + 초대코드 */}
        <div className="mt-10 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
          <button
            onClick={() => alert("멤버 관리닷~")} // ✅ 멤버 관리 모달
            className="rounded-full bg-neutral-100 px-3 py-1 transition hover:bg-neutral-200"
          >
            멤버 {group?.member_count}명
          </button>

          <button
            onClick={() => dispatch(openModal({ type: "invite" }))} // ✅ 초대코드 모달
            className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-100"
          >
            초대 코드
          </button>
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      <button
        onClick={() => dispatch(openModal({ type: "write" }))}
        className="w-full rounded-2xl bg-gradient-to-br from-green-100 to-green-50 py-3 font-semibold shadow-md transition hover:opacity-70"
      >
        ✏️ 게시글 작성하기
      </button>

      {/* 카테고리 / 게시판 */}
      <div className="rounded-2xl bg-white p-5 text-sm text-neutral-600 shadow-sm">
        카테고리 / 게시판 분류 영역
      </div>
    </aside>
  );
}
