import { useState } from "react";
import Sidebar from "@/components/settingComponents/Sidebar";
import HelpPage from "@/components/settingComponents/HelpPage";
import AlertSettingPage from "@/components/settingComponents/AlertSettingPage";
import AccountDeletePage from "@/components/settingComponents/AccountDeletePage";
import ChangePasswordPage from "@/components/settingComponents/ChangePasswordPage";
import BlockedUsersPage from "@/components/settingComponents/BlockedUserPage";
import PaymentInfoPage from "@/components/settingComponents/PaymentInfoPage";
import TermsPage from "@/components/settingComponents/TermsPage";
import UpdateInfoPage from "@/components/settingComponents/UpdateInfoPage";
import CustomerSupportPage from "@/components/settingComponents/CustomerSupportPage";
import ThemeSettingPage from "@/components/settingComponents/ThemeSettingPage";

const menuList = [
  "도움말",
  "알림 설정",
  "테마 설정",
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
      case "테마 설정":
        return <ThemeSettingPage />;
      case "계정 탈퇴":
        return <AccountDeletePage />;
      case "비밀번호 변경":
        return <ChangePasswordPage />;
      case "차단한 유저":
        return <BlockedUsersPage />;
      case "결제 정보":
        return <PaymentInfoPage />;
      case "이용약관":
        return <TermsPage />;
      case "업데이트 정보":
        return <UpdateInfoPage />;
      case "고객센터":
        return <CustomerSupportPage />;
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
