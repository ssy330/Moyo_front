// src/api/image.ts
import { api } from "@/lib/api";

export async function uploadImage({
  file,
}: {
  file: File;
  // filePath는 이제 안 써도 되면 빼도 됨
  filePath?: string;
}) {
  const formData = new FormData();
  formData.append("file", file); // 🔥 백엔드에서 File(..., alias="file") 로 받게 할 거

  const res = await api.post<{ url: string }>("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // 백엔드가 {"url": "/uploads/xxx.png"} 이런 식으로 돌려준다고 가정
  return res.data.url;
}

// 필요 없으면 그냥 제거해도 됨
export async function deleteImagesInPath(_path: string) {
  // 나중에 백엔드에 삭제 API 만들면 여기서 호출
  return;
}
