import { useEffect, useRef, useState } from "react";

type Props = { groupId: number; mode?: "list" | "write" };

export default function GroupBoardEmbed({ groupId, mode = "list" }: Props) {
  const [basePath, setBasePath] = useState<string | null>(null);
  const [height, setHeight] = useState(900);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch(`/api/v1/boards/groups/${groupId}/url`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json(); // { url, mid, exists }
      if (!data.exists || !data.url) return;
      const proxied = data.url.replace(/^https?:\/\/[^/]+(?::\d+)?\//, "/rx/");
      if (mounted) setBasePath(proxied);
    })();
    return () => {
      mounted = false;
    };
  }, [groupId]);

  const src =
    basePath == null
      ? null
      : mode === "list"
        ? `${basePath}?_embedded=1`
        : `${basePath}?act=dispBoardWrite&_embedded=1`;
  console.log("[GroupBoardEmbed] basePath:", basePath);
  console.log("[GroupBoardEmbed] final src:", src);

  // 같은 오리진(/rx/)이므로 내부 문서 접근 가능 → 높이 자동 보정
  useEffect(() => {
    if (!iframeRef.current) return;
    const el = iframeRef.current;

    const adjust = () => {
      try {
        const doc = el.contentWindow?.document;
        if (!doc) return;
        const h = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight,
        );
        if (h && Number.isFinite(h)) setHeight(h + 20);
      } catch {
        // 다른 오리진이면 접근 불가하지만 /rx/면 접근 가능해야 함
      }
    };

    const id = window.setInterval(adjust, 800);
    el.addEventListener("load", adjust);
    return () => {
      window.clearInterval(id);
      el.removeEventListener("load", adjust);
    };
  }, [src]);

  if (!src) return <div className="text-gray-500">게시판을 불러오는 중…</div>;
  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: "100%", height, border: 0 }}
      // Rhymix 내부 스크립트/폼 사용 위해 최소 권한만 허용
      sandbox="allow-same-origin allow-scripts allow-forms"
    />
  );
}
