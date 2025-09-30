// 하단 링크들 스타일 정의
const linkButtonClass = "hover:underline focus:outline-none cursor-pointer";

interface AuthLinksProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthLinks = ({ text, onClick }: AuthLinksProps) => {
  return (
    <button className={linkButtonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default AuthLinks;
