import { Settings } from "lucide-react";
import { useState } from "react";
import WritePostModal from "./WriteModal";
import InviteCodeModal from "./InviteCodeModal";

const GroupsLeftPanel = () => {
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [openInviteCode, setOpenInviteCode] = useState(false);

  return (
    <>
      {/* 왼쪽 패널 */}
      <aside className="mt-[76px] space-y-4">
        <div className="relative rounded-md bg-neutral-200 p-4">
          {/* 커버사진 영역 */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-neutral-300">
            {/* ⚙️ Settings 아이콘 */}
            <button
              className="absolute right-3 bottom-3 text-neutral-600 opacity-60 transition hover:text-neutral-800 hover:opacity-100"
              aria-label="그룹 관리"
            >
              <Settings size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* 그룹 정보 */}
        <div className="space-y-2 rounded-md bg-white p-4 shadow-sm">
          <div className="text-xl font-extrabold tracking-tight">
            GROUP 이름
          </div>
          <div className="mt-2 text-sm leading-relaxed text-neutral-600">
            여기는 그룹 소개가 들어가는 영역입니다.
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
            <button className="cursor-pointer rounded bg-neutral-100 px-2 py-1">
              멤버: 93,128명
            </button>
            <button
              className="cursor-pointer rounded bg-neutral-100 px-2 py-1"
              onClick={() => setOpenInviteCode(true)}
            >
              초대코드
            </button>
          </div>
        </div>

        {/* 게시판 글 작성 */}
        <div
          className="cursor-pointer rounded-md bg-white p-4 text-center shadow-sm"
          onClick={() => setOpenWriteModal(true)}
        >
          <span className="flex-1 text-xl font-semibold">게시판 글 작성</span>
        </div>

        {/* 카테고리 */}
        <div className="mt-3 rounded bg-neutral-100 p-6 text-center text-sm text-neutral-500">
          게시판 나누기 (카테고리)
        </div>
      </aside>

      {/* 글쓰기 모달 */}
      <WritePostModal
        isOpen={openWriteModal}
        onClose={() => setOpenWriteModal(false)}
      />

      {/* 초대 코드 모델 */}
      <InviteCodeModal
        isOpen={openInviteCode}
        onClose={() => setOpenInviteCode(false)}
      />
    </>
  );
};

export default GroupsLeftPanel;
