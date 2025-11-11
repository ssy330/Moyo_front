import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { openModal } from "@/features/modalSlice";
import type { PostEntity } from "@/types";

export default function EditPostItemButton(props: PostEntity) {
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(
      openModal({
        type: "edit",
        data: {
          id: props.id,
          content: props.content,
          image_urls: props.image_urls,
        },
      }),
    );
  };

  return (
    <Button
      className="cursor-pointer"
      variant={"ghost"}
      onClick={handleButtonClick}
    >
      수정
    </Button>
  );
}
