// src/components/account/DeleteAccountButton.tsx
import { closeAlert, openAlert } from "@/features/alertSlice";
import { closeModal } from "@/features/modalSlice";
import { useDeleteAccount } from "@/hooks/mutation/auth/use-delete-account";
import { useDispatch } from "react-redux";

interface Props {
  confirmed: boolean;
  confirmText: string;
}

export default function DeleteAccountButton({ confirmed, confirmText }: Props) {
  const dispatch = useDispatch();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDelete = () => {
    if (!confirmed) {
      dispatch(
        openAlert({
          title: "탈퇴 동의가 필요합니다",
          description: "계정 탈퇴 안내 내용을 확인하고 동의해 주세요.",
        }),
      );
      return;
    }

    if (confirmText.trim() !== "탈퇴하겠습니다.") {
      dispatch(
        openAlert({
          title: "문구를 정확히 입력해 주세요",
          description: `아래 문구를 정확히 입력해야 탈퇴할 수 있습니다.\n\n"탈퇴하겠습니다."`,
        }),
      );
      return;
    }

    dispatch(
      openAlert({
        title: "정말 탈퇴하시겠어요?",
        description:
          "계정을 삭제하면 모든 데이터가 영구적으로 사라지며 복구할 수 없습니다.",
        onPositive: () => {
          dispatch(closeAlert());
          dispatch(closeModal());
          deleteAccount(); // 🔥 password 안 보냄!
        },
      }),
    );
  };

  return (
    <button
      onClick={handleDelete}
      className="w-full rounded-md bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? "탈퇴 처리 중..." : "회원 탈퇴"}
    </button>
  );
}
