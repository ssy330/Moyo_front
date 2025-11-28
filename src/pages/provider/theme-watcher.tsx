import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function ThemeWatcher() {
  const current = useSelector((state: RootState) => state.theme.current);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.appTheme = current;
  }, [current]);

  return null;
}
