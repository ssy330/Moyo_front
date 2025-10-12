import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/Moyo_logo.png";

interface MoyoLogoProps {
  type?: string;
}
const MoyoLogo = ({ type }: MoyoLogoProps) => {
  const nav = useNavigate();

  return (
    <div className="flex items-center justify-center mt-10">
      <img
        className={
          type === "main"
            ? "w-auto h-[200px]  rounded" //메인일 때 스타일
            : "w-28 sm:w-32 h-auto rounded cursor-pointer"
        }
        src={logoImg}
        alt="Moyo Logo"
        onClick={() => nav("/login")}
      />
    </div>
  );
};
export default MoyoLogo;
