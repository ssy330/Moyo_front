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
      <aside className="space-y-4 mt-[76px]">
        <div className="rounded-md bg-neutral-200 p-4 relative">
          {/* 커버사진 영역 */}
          <div className="aspect-[4/3] w-full rounded bg-neutral-300 relative overflow-hidden">
            {/* ⚙️ Settings 아이콘 */}
            <button
              className="absolute bottom-3 right-3 text-neutral-600 opacity-60 hover:opacity-100 hover:text-neutral-800 transition"
              aria-label="그룹 관리"
            >
              <Settings size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* 그룹 정보 */}
        <div className="rounded-md bg-white p-4 shadow-sm space-y-2">
          <div className="text-xl font-extrabold tracking-tight">
            GROUP 이름
          </div>
          <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
            여기는 그룹 소개가 들어가는 영역입니다.
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
            <button className="rounded bg-neutral-100 px-2 py-1 cursor-pointer">
              멤버: 93,128명
            </button>
            <button
              className="rounded bg-neutral-100 px-2 py-1 cursor-pointer"
              onClick={() => setOpenInviteCode(true)}
            >
              초대코드
            </button>
          </div>
        </div>

        {/* 게시판 글 작성 */}
        <div
          className="rounded-md bg-white p-4 shadow-sm text-center cursor-pointer"
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
