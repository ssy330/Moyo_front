import { leaveGroup } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ 리액트 쿼리 훅
export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["leave-group"],
    // mutate(groupId)로 사용할 거라 variables로 groupId 받기
    mutationFn: (groupId: number) => leaveGroup(groupId),
    onSuccess: async (_data, groupId) => {
      // 전체 clear() 보다는 관련 쿼리만 갱신하는 게 좋아
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-groups"] }),
        queryClient.invalidateQueries({ queryKey: ["group", groupId] }),
        queryClient.invalidateQueries({
          queryKey: ["group-members", groupId],
        }),
      ]);
    },
  });
}
