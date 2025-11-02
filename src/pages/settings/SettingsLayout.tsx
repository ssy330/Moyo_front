import { useState } from "react";
import Sidebar from "@/components/settingComponents/Sidebar";
import HelpPage from "@/components/settingComponents/HelpPage";
import AlertSettingPage from "@/components/settingComponents/AlertSettingPage";
import AccountDeletePage from "@/components/settingComponents/AccountDeletePage";

const menuList = [
  "도움말",
  "알림 설정",
  "계정 탈퇴",
  "차단한 유저",
  "비밀번호 변경",
  "결제 정보",
  "업데이트 정보",
  "이용약관",
  "고객센터",
];

export default function SettingsLayout() {
  const [selected, setSelected] = useState("도움말");

  const renderContent = () => {
    switch (selected) {
      case "도움말":
        return <HelpPage />;
      case "알림 설정":
        return <AlertSettingPage />;
      case "계정 탈퇴":
        return <AccountDeletePage />;
      default:
        return <div className="p-8 text-gray-600">준비 중입니다...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar menuList={menuList} selected={selected} onSelect={setSelected} />
      <div className="flex-1 p-10">{renderContent()}</div>
    </div>
  );
}
