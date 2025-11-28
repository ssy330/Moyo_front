import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function ThemeWatcher() {
  const theme = useSelector((state: RootState) => state.theme.current);

  useEffect(() => {
    //document.documentElement.dataset.appTheme = theme;
    document.documentElement.setAttribute("data-app-theme", theme);
    console.log("app theme:", theme);
  }, [theme]);

  return null; // 화면에 아무것도 안 그림
}
