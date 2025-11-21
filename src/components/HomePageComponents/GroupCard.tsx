import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

type GroupCardProps = {
  id: number;
  name: string;
  image_url?: string | null;
  member_count?: number;
  onLeaveGroup?: (groupId: number) => void; // 탈퇴 액션용
  isLeaving?: boolean;
};

export default function GroupCard({
  id,
  name,
  image_url,
  member_count,
  onLeaveGroup,
  isLeaving,
}: GroupCardProps) {
  const nav = useNavigate();

  // 카드 클릭 → 그룹 상세
  const handleCardClick = () => {
    nav(`/groups/${id}`);
  };

  // 메뉴에서 "그룹 정보"
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 그룹 정보
  };

  // 메뉴에서 "그룹 탈퇴"
  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLeaveGroup) {
      onLeaveGroup(id);
    }
  };

  return (
    <div
      key={id}
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* 🔹 우측 상단 ... 메뉴 */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()} // 카드 클릭 막기
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-600 shadow-sm transition hover:bg-white"
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={4}
            onClick={(e) => e.stopPropagation()} // 메뉴 안에서 클릭해도 카드 클릭 안되게
          >
            <DropdownMenuItem onClick={handleInfoClick}>
              그룹 정보
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLeaveClick}
              className="text-red-500 focus:text-red-500"
              disabled={isLeaving}
            >
              그룹 탈퇴
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 기존 카드 내용 */}
      <div className="aspect-video overflow-hidden">
        <img
          src={image_url || "/images/placeholder-group.jpg"}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-800">{name}</h3>
        {typeof member_count === "number" && (
          <p className="mt-1 text-sm text-neutral-500">멤버 {member_count}명</p>
        )}
      </div>
    </div>
  );
}
