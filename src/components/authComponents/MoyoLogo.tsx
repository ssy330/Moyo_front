import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/Moyo_logo.png";

interface MoyoLogoProps {
  type?: string;
}
const MoyoLogo = ({ type }: MoyoLogoProps) => {
  const nav = useNavigate();

  return (
    <div className="mt-10 flex items-center justify-center">
      <img
        className={
          type === "main"
            ? "h-[200px] w-auto rounded"
            : "h-auto w-28 cursor-pointer rounded sm:w-32"
        }
        src={logoImg}
        alt="Moyo Logo"
        onClick={() => nav("/login")}
      />
    </div>
  );
};
export default MoyoLogo;
