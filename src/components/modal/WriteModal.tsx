import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Camera, Video, Smile, ListChecks, XIcon } from "lucide-react";
import { toast } from "sonner";
import type { RootState } from "@/store/store";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { closeModal } from "@/features/modalSlice";
import { closeAlert, openAlert } from "@/features/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEditPost } from "@/hook/mutation/post/use-update-post";
import { useCreatePost } from "@/hook/mutation/post/use-create-post-mutation";

type Image = {
  file: File;
  previewUrl: string;
};

export default function WriteModal() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => {
    const type = state.modal.currentModal?.type;
    return type === "write" || type === "edit";
  });

  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal,
  );

  const isEditMode = currentModal?.type === "edit";

  const [images, setImages] = useState<Image[]>([]);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = useSelector((state: RootState) => state.session.session);
  // const userId = session?.id;
  const source = useSelector((state: RootState) => state.session.source);

  const userId = source === "fastapi" ? session?.user_id : session?.id;

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

  // 수정 Mutation
  const { mutate: editPost, isPending: isEditPostPending } = useEditPost({
    onSuccess: () => {
      dispatch(closeModal());
    },
  });

  // 게시글 작성 - textarea 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  // 게시글 작성 - 모달 열릴 때 자동 포커스
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

  // 이미지 가져오기
  useEffect(() => {
    if (!currentModal) return;
    console.log("currentModal.data =", currentModal.data);

    if (isEditMode && currentModal.data) {
      const { content, image_urls } = currentModal.data;
      setText(content ?? "");

      // ✅ 기존 서버 이미지 URL → previewUrl로 변환
      if (image_urls && image_urls.length > 0) {
        const loadedImages = image_urls.map((url) => ({
          file: null as unknown as File,
          previewUrl: url, // 서버 URL 그대로
        }));
        setImages(loadedImages);
      } else {
        setImages([]);
      }
    } else {
      setText("");
      setImages([]);
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
      if (!currentModal?.data?.id) {
        console.error("❌ postId가 없습니다.");
        return;
      }

      editPost({
        id: currentModal.data.id,
        content: text,
        image_urls: images.map((img) => img.previewUrl),
      });
    } else {
      // 📝 새 글 작성
      createPost({
        content: text,
        images: images.map((img) => img.file),
        userId: String(userId),
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
            {isEditMode ? "수정하기" : "글쓰기"}
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

        {open && (isEditMode || images.length > 0) && (
          <Carousel>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="basis-2/5">
                  <div className="relative">
                    <img
                      src={image.previewUrl}
                      alt="preview"
                      className="h-full w-full rounded-sm object-cover"
                    />
                    {/* 삭제 버튼 */}
                    {!isEditMode && (
                      <button
                        onClick={() => handleDeleteImage(image)}
                        className="absolute top-0 right-0 m-1 rounded-full bg-black/30 p-1 hover:bg-black/50"
                      >
                        <XIcon className="h-4 w-4 text-white" />
                      </button>
                    )}
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
              disabled={isEditMode}
              multiple
              className="hidden"
            />

            {/* 카메라 아이콘 */}
            <button
              onClick={handleCameraClick}
              disabled={isCreatePostPending}
              className={
                !isEditMode
                  ? "transition-transform hover:scale-110 hover:text-neutral-800"
                  : "text-neutral-400"
              }
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
            {isEditMode ? "수정" : "게시"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
