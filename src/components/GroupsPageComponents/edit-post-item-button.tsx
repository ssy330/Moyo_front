// src/components/GroupsPageComponents/edit-post-item-button.tsx

import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { openModal } from "@/features/modalSlice";

// ✅ 이 버튼이 실제로 필요로 하는 필드만 props로 정의
interface EditPostItemButtonProps {
  id: number;
  content: string;
  image_urls?: string[] | null;
}

export default function EditPostItemButton({
  id,
  content,
  image_urls,
}: EditPostItemButtonProps) {
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(
      openModal({
        type: "edit",
        data: {
          id,
          content,
          image_urls,
        },
      }),
    );
  };

  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={handleButtonClick}
    >
      수정
    </Button>
  );
}
