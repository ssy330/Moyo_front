import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "@/features/modalSlice";
import { PlusCircle, Users } from "lucide-react";

type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

const groupMockData = [
  { id: 1, title: "MOTIV", memberNum: 22, imageUrl: "/images/motiv.jpg" },
  { id: 2, title: "AUNAE", memberNum: 32, imageUrl: "/images/aunae.jpg" },
  { id: 3, title: "KIS", memberNum: 12, imageUrl: "/images/kis.jpg" },
];

export default function GroupPanel({ viewMode }: GroupPanelProps) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleClickGroup = (id: number) => {
    console.log(`Navigate to group detail: ${id}`);
    nav("/groups");
  };

  return (
    <div className="flex min-h-[90vh] flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-md transition duration-200 hover:shadow-lg">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">내 그룹</h2>
        <p className="text-sm text-neutral-500">
          {groupMockData.length}개의 그룹이 있습니다
        </p>
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
          onClick={() => dispatch(openModal("groupJoin"))}
          className="flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
        >
          <Users className="h-5 w-5" />
          그룹 참여하기
        </button>
      </div>

      {/* 그룹 카드 리스트 */}
      <div
        className={`grid gap-6 ${
          viewMode === "both"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-5"
        }`}
      >
        {groupMockData.map((group) => (
          <div
            key={group.id}
            onClick={() => handleClickGroup(group.id)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* 이미지 */}
            <div className="aspect-video overflow-hidden">
              <img
                src={group.imageUrl}
                alt={group.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            {/* 내용 */}
            <div className="flex flex-col items-start p-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                멤버 {group.memberNum}명
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
