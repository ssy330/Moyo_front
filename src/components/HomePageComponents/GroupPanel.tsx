import { useNavigate } from "react-router-dom";
import GroupActionButton from "./GroupActionButton";
import GroupCard from "./GroupCard";
import { useDispatch } from "react-redux";
import { openModal } from "@/features/modalSlice";

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
    // e.g. useNavigate(`/groups/${id}`);
    nav("/groups");
  };

  return (
    <>
      <div className="relative m-4 flex min-h-[90vh] flex-1 flex-col overflow-y-auto rounded-2xl border border-green-400 bg-green-50 p-10 pb-16 shadow-sm">
        {/* 만들기, 참여하기 2개 */}
        <div
          className={`grid gap-8 ${
            viewMode === "both"
              ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              : "grid-cols-2 md:grid-cols-2 lg:grid-cols-5"
          }`}
        >
          {/* 만들기 / 참여하기 */}
          <GroupActionButton
            label="만들기"
            onClick={() => nav("/groups/new")}
          />
          <GroupActionButton
            label="참여하기"
            onClick={() => dispatch(openModal("groupJoin"))}
          />

          {/* 그룹 카드들 */}
          {groupMockData.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              title={group.title}
              memberNum={group.memberNum}
              imageUrl={group.imageUrl}
              onClick={handleClickGroup}
            />
          ))}
        </div>
      </div>
    </>
  );
}
