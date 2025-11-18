// GroupDetailPage.tsx

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// env 타입 문제 방지용 캐스팅
const RHYMIX_BASE_URL = import.meta.env.VITE_RHYMIX_BASE_URL as string;

type Group = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  boardPath?: string | null;
};

export default function GroupDetailPage({ groupId }: { groupId: string }) {
  const {
    data: group,
    isLoading,
    error,
  } = useQuery<Group, Error>({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error("잘못된 그룹 ID 입니다.");
      }
      const res = await api.get<Group>(`/groups/${groupId}`);
      return res.data;
    },
    enabled: !!groupId, // groupId 있을 때만 요청
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error || !group) return <div>그룹 정보를 불러오지 못했습니다.</div>;

  // 1번 방식(규칙 기반) + 2번 방식(명시적 매핑) 혼합
  const boardPath = group.boardPath ?? `group_${groupId}_board`;

  const boardUrl = `${RHYMIX_BASE_URL}/${boardPath}`;
  console.log(boardUrl);

  return (
    <div className="group-detail-page">
      {/* 상단: 그룹 기본 정보 */}
      <section className="group-header">
        <img
          src={group.imageUrl ?? "/images/default-group.png"}
          alt={group.name}
        />
        <div>
          <h1>{group.name}</h1>
          <p>{group.description}</p>
        </div>
      </section>

      {/* 중앙: Rhymix 게시판 */}
      <section className="group-board-section">
        <iframe
          src={boardUrl}
          title={`${group.name} 게시판`}
          style={{
            width: "100%",
            minHeight: "900px",
            border: "none",
          }}
        />
      </section>
    </div>
  );
}
