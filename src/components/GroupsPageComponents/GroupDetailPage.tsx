import { api, RHYMIX_BASE_URL } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GroupDetail {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

export default function GroupDetailPage({ groupId }: { groupId: string }) {
  const numericId = Number(groupId);
  const isValidId = !!groupId && !Number.isNaN(numericId);

  // 훅은 항상 호출 + enabled로 제어
  const {
    data: group,
    isLoading,
    isError,
  } = useQuery<GroupDetail>({
    queryKey: ["group", numericId],
    enabled: isValidId,
    queryFn: async () => {
      const res = await api.get(`/groups/${numericId}`);
      return res.data;
    },
  });

  if (!isValidId) {
    return <div>잘못된 그룹 ID 입니다.</div>;
  }

  if (isLoading) return <div>로딩중...</div>;
  if (isError || !group) return <div>그룹 정보를 불러오지 못했습니다.</div>;

  // Rhymix 게시판 URL을 규칙으로 생성
  const boardPath = `group_${groupId}_board`;

  const boardUrl = `${RHYMIX_BASE_URL}/${boardPath}`;

  return (
    <div className="group-detail-page space-y-4">
      {/* 상단: 그룹 기본 정보 */}
      <section className="flex items-center gap-4">
        {group.image_url && (
          <img
            src={group.image_url}
            alt={group.name}
            className="h-20 w-20 rounded-xl object-cover"
          />
        )}
        <div>
          <h1 className="text-xl font-semibold">{group.name}</h1>
          {group.description && (
            <p className="mt-1 text-sm text-neutral-600">{group.description}</p>
          )}
        </div>
      </section>

      {/* Rhymix 게시판 */}
      <section className="group-board-section mt-4">
        <iframe
          src={boardUrl}
          title={`${group.name} 게시판`}
          style={{
            width: "100%",
            minHeight: "700px",
            border: "none",
          }}
        />
      </section>
    </div>
  );
}
