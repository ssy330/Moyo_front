import { useNavigate } from "react-router-dom";
import GroupActionButton from "./GroupActionButton";
import GroupCard from "./GroupCard";

type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

const groupMockData = [
  { id: 1, title: "MOTIV", memberNum: 22, imageUrl: "/images/motiv.jpg" },
  { id: 2, title: "AUNAE", memberNum: 32, imageUrl: "/images/aunae.jpg" },
  { id: 3, title: "KIS", memberNum: 12, imageUrl: "/images/kis.jpg" },
];

const GroupPanel = ({ viewMode }: GroupPanelProps) => {
  const nav = useNavigate();

  const handleClickGroup = (id: number) => {
    console.log(`Navigate to group detail: ${id}`);
    // e.g. useNavigate(`/groups/${id}`);
    nav("/groups");
  };

  return (
    <>
      <div
        className="relative flex-1 rounded-2xl border border-rose-400 bg-rose-50 shadow-sm
                     m-4 p-10 flex flex-col pb-16 overflow-y-auto min-h-[90vh]"
      >
        {/* 만들기, 참여하기 2개 */}
        <div
          className={`grid gap-8 ${
            viewMode === "both" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-5"
          }`}
        >
          {/* 만들기 / 참여하기 */}
          <GroupActionButton label="만들기" />
          <GroupActionButton label="참여하기" />

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
};

export default GroupPanel;
