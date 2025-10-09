import { Link } from "react-router-dom";

// 하단 링크들 스타일 정의
const linkButtonClass = "hover:underline focus:outline-none cursor-pointer";

interface AuthLinksProps {
  text: "회원가입" | "아이디 찾기" | "비밀번호 찾기" | "로그인";
}

const linkMap: Record<AuthLinksProps["text"], string> = {
  회원가입: "/register",
  "아이디 찾기": "/login/idInquiry",
  "비밀번호 찾기": "/login/pwInquiry",
  로그인: "/login",
};

const AuthLinks = ({ text }: AuthLinksProps) => {
  return (
    <Link to={linkMap[text]} className={linkButtonClass}>
      {text}
    </Link>
  );
};

export default AuthLinks;
