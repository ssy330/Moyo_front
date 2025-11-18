import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import WritePostModal from "@/components/modal/WriteModal";
import AlertModal from "@/components/modal/AlertModal";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal?.type,
  );
  return (
    <>
      {createPortal(
        <>
          {(currentModal === "write" || currentModal === "edit") && (
            <WritePostModal />
          )}
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
