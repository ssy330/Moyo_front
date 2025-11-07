import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { UserMinus2, ShieldX } from "lucide-react";

type BlockedUser = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "홍길동",
      username: "hong123",
      avatar: "https://i.pravatar.cc/100?u=hong",
    },
    {
      id: "2",
      name: "김철수",
      username: "chulsoo",
      avatar: "https://i.pravatar.cc/100?u=chulsoo",
    },
    {
      id: "3",
      name: "이영희",
      username: "younghee",
      avatar: "https://i.pravatar.cc/100?u=younghee",
    },
  ]);

  const handleUnblock = (id: string) => {
    if (confirm("이 사용자를 차단 해제하시겠습니까?")) {
      setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
      // 🔥 실제로는 FastAPI 또는 Supabase RPC 요청으로 차단 해제 API 호출
      console.log("차단 해제됨:", id);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <ShieldX className="h-6 w-6" />
        차단한 사용자 관리
      </h2>

      {blockedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
          <UserMinus2 className="mb-3 h-10 w-10 opacity-60" />
          <p className="font-medium">차단한 사용자가 없습니다.</p>
          <p className="text-sm text-neutral-400">
            불쾌한 사용자는 언제든 차단할 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {blockedUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 hover:bg-neutral-100"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-neutral-800">{user.name}</p>
                  <p className="text-sm text-neutral-500">@{user.username}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnblock(user.id)}
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                차단 해제
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Separator className="my-8" />

      <p className="text-sm text-neutral-500">
        ⚠️ 차단된 사용자는 나에게 메시지를 보내거나 내 게시물에 접근할 수
        없습니다.
      </p>
    </div>
  );
}
