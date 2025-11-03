import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import InviteCodeModal from "@/components/modal/InviteCodeModal";
import WritePostModal from "@/components/modal/WriteModal";
import GroupSettingModal from "@/components/modal/GroupSettingsModal";
import GroupJoinModal from "@/components/modal/GroupJoinModal";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal,
  );

  return (
    <>
      {createPortal(
        <>
          {currentModal === "invite" && <InviteCodeModal />}
          {currentModal === "write" && <WritePostModal />}
          {currentModal === "groupSetting" && <GroupSettingModal />}
          {currentModal === "groupJoin" && <GroupJoinModal />}
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
