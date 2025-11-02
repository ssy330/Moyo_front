import { Settings } from "lucide-react";
import { useState } from "react";
import WritePostModal from "./WriteModal";
import InviteCodeModal from "./InviteCodeModal";

const GroupsLeftPanel = () => {
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [openInviteCode, setOpenInviteCode] = useState(false);

  return (
    <>
      <aside className="space-y-5">
        {/* 커버 */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm">
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-500">
            <span>그룹 커버 이미지</span>
            <button
              aria-label="그룹 설정"
              className="absolute right-3 bottom-3 rounded-full bg-white/80 p-2 text-neutral-700 transition hover:bg-white"
            >
              <Settings size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* 그룹 정보 */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">🌸 MOYO 그룹</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            함께하는 순간을 기록하는 Moyo Group에 오신 것을 환영합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-600">
            <span className="rounded-full bg-neutral-100 px-3 py-1">
              멤버 93,128명
            </span>
            <button
              onClick={() => setOpenInviteCode(true)}
              className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-100"
            >
              초대 코드
            </button>
          </div>
        </div>

        {/* 글쓰기 */}
        <button
          onClick={() => setOpenWriteModal(true)}
          className="w-full rounded-2xl bg-gradient-to-br from-green-100 to-green-50 py-3 font-semibold shadow-md transition hover:opacity-70"
        >
          ✏️ 게시글 작성하기
        </button>

        {/* 카테고리 */}
        <div className="rounded-2xl bg-white p-5 text-sm text-neutral-600 shadow-sm">
          카테고리 / 게시판 분류 영역
        </div>
      </aside>

      {/* 모달 */}
      <WritePostModal
        isOpen={openWriteModal}
        onClose={() => setOpenWriteModal(false)}
      />
      <InviteCodeModal
        isOpen={openInviteCode}
        onClose={() => setOpenInviteCode(false)}
      />
    </>
  );
};

export default GroupsLeftPanel;
