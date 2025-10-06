// 로그인 버튼 기본 스타일 정의
const LoginButtonDefaultStyle =
  "h-12  rounded mb-3 flex items-center justify-center w-full cursor-pointer transition-colors duration-200";
// Prop타입 정의 - 아이콘(객체 노드로), 버튼 제목, 버튼 추가 스타일, onClick
interface LoginButtonProps {
  icon?: React.ReactNode;
  title: string;
  styles?: string; //임시
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 임시 선택적 프로퍼티
}
//로그인 버튼
const LoginButton = ({
  icon,
  title,
  styles,
  type,
  onClick,
}: LoginButtonProps) => {
  return (
    <button
      className={`${LoginButtonDefaultStyle} ${styles}`}
      onClick={onClick}
      type={type}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </button>
  );
};

export default LoginButton;
