import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { openAlert } from "@/features/alertSlice";
import { useDispatch } from "react-redux";
import { useDeletePost } from "@/hooks/mutation/post/use-delete-post";

export default function DeletePostButton({ id }: { id: number }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onSuccess: () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith(`/post/${id}`)) {
        navigate("/", { replace: true });
      }
    },
    onError: () => {
      toast.error("포스트 삭제에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  const handleDeleteClick = () => {
    dispatch(
      openAlert({
        title: "포스트 삭제",
        description:
          "삭제된 포스트는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
        onPositive: () => {
          deletePost(id);
        },
      }),
    );
  };

  return (
    <Button
      disabled={isDeletePostPending}
      onClick={handleDeleteClick}
      className="cursor-pointer"
      variant={"ghost"}
    >
      삭제
    </Button>
  );
}
