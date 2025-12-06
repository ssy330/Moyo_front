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
import { useEditPost } from "@/hooks/mutation/post/use-update-post";
import { useCreatePost } from "@/hooks/mutation/post/use-create-post-mutation";
import { useParams } from "react-router-dom";

type Image = {
  file: File | null;
  previewUrl: string;
};

export default function WriteModal() {
  const dispatch = useDispatch();

  // 모달 열려 있는지 여부
  const open = useSelector((state: RootState) => {
    const type = state.modal.currentModal?.type;
    return type === "write" || type === "edit";
  });

  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal,
  );
  const isEditMode = currentModal?.type === "edit";

  // URL 에서 groupId(or id) 가져오기
  const { groupId: routeGroupId, id: routeId } = useParams<{
    groupId?: string;
    id?: string;
  }>();

  // 모달 데이터에 groupId 가 있다면 그걸 우선 사용
  const modalGroupId = currentModal?.data?.groupId;

  const numericGroupId = Number(modalGroupId ?? routeGroupId ?? routeId ?? NaN);

  const [images, setImages] = useState<Image[]>([]);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ 생성 Mutation (createPostWithImages 사용)
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

  // ✏️ 수정 Mutation
  const { mutate: editPost, isPending: isEditPostPending } = useEditPost({
    onSuccess: () => {
      dispatch(closeModal());
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

  // 모달 열릴 때 초기화 + 포커스
  useEffect(() => {
    if (!open) return;

    // 이전 blob URL 정리
    images.forEach((image) => {
      if (image.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(image.previewUrl);
      }
    });

    setText("");
    setImages([]);
    textareaRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 수정 모드일 때 기존 내용/이미지 채워 넣기
  useEffect(() => {
    if (!currentModal) return;

    if (isEditMode && currentModal.data) {
      const { content, image_urls } = currentModal.data;
      setText(content ?? "");

      if (image_urls && image_urls.length > 0) {
        const loadedImages: Image[] = image_urls.map((url: string) => ({
          file: null,
          previewUrl: url,
        }));
        setImages(loadedImages);
      } else {
        setImages([]);
      }
    } else {
      setText("");
      setImages([]);
    }
  }, [currentModal, isEditMode]);

  // 모달 닫기
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

  // 게시 버튼
  const handleSubmit = () => {
    if (text.trim() === "") return;

    if (isEditMode) {
      const data = currentModal?.data as any;
      if (!data?.id) {
        console.error("❌ postId가 없습니다.");
        return;
      }

      // data.groupId or data.group_id 에서 가져오거나,
      // numericGroupId를 그대로 써도 OK (이미 계산된 groupId니까)
      const groupIdForEdit = data.groupId ?? data.group_id ?? numericGroupId;

      editPost({
        id: data.id,
        groupId: groupIdForEdit,
        content: text,
        image_urls: images.map((img) => img.previewUrl),
      });
    } else {
      // ✅ groupId 체크
      if (!numericGroupId || Number.isNaN(numericGroupId)) {
        console.error("❌ groupId 를 찾을 수 없습니다.", {
          modalGroupId,
          routeGroupId,
          routeId,
        });
        toast.error("그룹 정보를 찾을 수 없어서 글을 쓸 수 없어요.");
        return;
      }

      // File 이 아닌 null 제거 (수정 모드에서 넘어온 이미지 방지)
      const files = images
        .map((img) => img.file)
        .filter((f): f is File => f instanceof File);

      // 간단 자동 제목 생성 (앞부분 + ... 형태)
      const autoTitleBase = text.trim() || "게시글";
      const title =
        autoTitleBase.length > 20
          ? `${autoTitleBase.slice(0, 20)}...`
          : autoTitleBase;

      createPost({
        groupId: numericGroupId,
        title,
        content: text,
        images: files,
      });
    }
  };

  // 카메라 아이콘 → 파일 선택
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 사진 선택
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
    if (image.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(image.previewUrl);
    }
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

        {/* 텍스트 입력 */}
        <div className="mt-3">
          <textarea
            ref={textareaRef}
            disabled={isCreatePostPending || isEditPostPending}
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

        {/* 아이콘 + 버튼 */}
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
              disabled={isCreatePostPending || isEditPostPending || isEditMode}
              className={
                !isEditMode
                  ? "transition-transform hover:scale-110 hover:text-neutral-800"
                  : "text-neutral-400"
              }
              title="사진 추가"
            >
              <Camera size={22} strokeWidth={1.8} />
            </button>

            {[Video, Smile, ListChecks].map((Icon, idx) => (
              <button
                key={idx}
                disabled={isCreatePostPending || isEditPostPending}
                className="transition-transform hover:scale-110 hover:text-neutral-800"
              >
                <Icon size={22} strokeWidth={1.8} />
              </button>
            ))}
          </div>

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
