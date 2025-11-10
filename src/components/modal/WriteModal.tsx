import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Video, Smile, ListChecks, XIcon } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";
import { useCreatePost } from "@/hook/mutation/use-create-post-mutation";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { closeAlert, openAlert } from "@/features/alertSlice";
import { useEditPost } from "@/hook/mutation/use-update-post-mutation";

type Image = {
  file: File;
  previewUrl: string;
};

export default function WriteModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal?.type === "write",
  );

  // 수정모드 일 때.
  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal,
  );
  const isEditMode = currentModal?.type === "edit";

  const { mutate: editPost, isPending: isEditPostPending } = useEditPost({
    onSuccess: () => {
      dispatch(closeModal());
    },
  });

  const [images, setImages] = useState<Image[]>([]);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = useSelector((state: RootState) => state.session.session);
  const userId = session?.user?.id;

  // ✅ API Mutation
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      dispatch(closeModal());
      toast.success("포스트가 성공적으로 등록되었습니다!", {
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("포스트 생성에 실패했습니다.", { position: "top-center" });
    },
  });

  // textarea 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  // 모달 열릴 때 자동 포커스
  useEffect(() => {
    // 메모리 누수를 막기위한 코드
    images.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });
    if (!open) return;
    textareaRef.current?.focus();
    setText("");
    setImages([]);
  }, [open]);

  useEffect(() => {
    if (!currentModal) return;

    if (isEditMode && currentModal.data) {
      const { content, imageUrls } = currentModal.data;
      setText(content ?? "");

      if (imageUrls && imageUrls.length > 0) {
        const loadedImages = imageUrls.map((url) => ({
          file: null as unknown as File, // 수정 시 실제 File은 없음
          previewUrl: url,
        }));
        setImages(loadedImages);
      }
    } else {
      setText("");
      setImages([]);
    }

    if (currentModal.type === "write" || currentModal.type === "edit") {
      textareaRef.current?.focus();
    }
  }, [currentModal]);

  // 모달 닫기 버튼
  const handleCloseModal = () => {
    if (text !== "" || images.length !== 0) {
      dispatch(
        openAlert({
          title: "삭제하시겠어요?",
          description: "이 작업은 되돌릴 수 없습니다.",
          onPositive: () => {
            dispatch(closeModal());
            dispatch(closeAlert());
          },
        }),
      );
      return;
    }

    dispatch(closeModal());
  };

  // 게시 버튼 클릭
  const handleSubmit = () => {
    if (text.trim() === "") return;

    if (isEditMode) {
      // ✏️ 수정 API 호출
      editPost({
        postId: currentModal?.data?.postId!,
        content: text,
        images: images.map((img) => img.file).filter(Boolean),
      });
    } else {
      // 📝 새 글 작성
      createPost({
        content: text,
        images: images.map((img) => img.file),
        userId: userId!,
      });
    }
  };

  // 카메라 아이콘 클릭 → 파일 선택
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 사진 선택 핸들러.
  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        setImages((prev) => [
          ...prev,
          { file, previewUrl: URL.createObjectURL(file) },
        ]);
      });
    }

    e.target.value = "";
  };

  const handleDeleteImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.previewUrl !== image.previewUrl),
    );
    // x 버튼 누른 이미지 삭제
    URL.revokeObjectURL(image.previewUrl);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-neutral-900">
            글쓰기
          </DialogTitle>
        </DialogHeader>

        {/* ✅ 텍스트 입력 폼 */}
        <div className="mt-3">
          <textarea
            ref={textareaRef}
            disabled={isCreatePostPending}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="그룹 내 인원들과 나의 일상을 공유해보세요!"
            className="max-h-125 w-full resize-none rounded-lg px-3 py-3 text-[15px] leading-relaxed text-neutral-800 focus:outline-none"
          />
        </div>

        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.previewUrl} className="basis-2/5">
                  <div className="relative">
                    <img
                      src={image.previewUrl}
                      className="h-full w-full rounded-sm object-cover"
                    />
                    <div
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* ✅ 아이콘 + 버튼 영역 */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-neutral-500">
            {/* 숨겨진 파일 input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSelectImages}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* 카메라 아이콘 */}
            <button
              onClick={handleCameraClick}
              disabled={isCreatePostPending}
              className="transition-transform hover:scale-110 hover:text-neutral-800"
              title="사진 추가"
            >
              <Camera size={22} strokeWidth={1.8} />
            </button>

            {/* 다른 아이콘들 */}
            {[Video, Smile, ListChecks].map((Icon, idx) => (
              <button
                key={idx}
                disabled={isCreatePostPending}
                className="transition-transform hover:scale-110 hover:text-neutral-800"
              >
                <Icon size={22} strokeWidth={1.8} />
              </button>
            ))}
          </div>

          {/* 게시 버튼 */}
          <Button
            onClick={handleSubmit}
            disabled={
              (images.length === 0 && text.trim() === "") ||
              isCreatePostPending ||
              isEditPostPending
            }
            className="rounded-lg px-5 py-2 font-medium text-white"
          >
            {isEditMode ? "수정 완료" : "게시"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
