// 로그인 버튼 기본 스타일 정의
const LoginButtonDefaultStyle =
  "h-12  rounded mb-3 flex items-center justify-center w-full cursor-pointer";
// Prop타입 정의
interface LoginButtonProps {
  icon?: React.ReactNode;
  title: string;
  styles: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
//로그인 버튼
const LoginButton = ({ icon, title, styles, onClick }: LoginButtonProps) => {
  return (
    <button
      className={`${LoginButtonDefaultStyle} ${styles}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </button>
  );
};

export default LoginButton;
