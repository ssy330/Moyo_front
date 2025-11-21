import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthLinks from "@/components/authComponents/AuthLinks";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignInWithEmail } from "@/hook/mutation/auth/use-login-mutation";
import { checkServerConnection } from "@/lib/server-test";
import { toast } from "sonner";

export default function LoginPage() {
  // 입력 상태 관리
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    checkServerConnection().then((ok) => {
      if (!ok) toast.error("⚠️ 백엔드 서버에 연결할 수 없습니다!");
    });
  }, []);

  const navigate = useNavigate();

  const { mutateAsync: signInWithEmail, isPending: isSignInWithEmailPending } =
    useSignInWithEmail();

  // 입력 값 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 성공하면 환영합니다. 메시지
  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await signInWithEmail({
        email: form.email,
        password: form.password,
      });

      const me = data.me;

      toast.success(`${me.name}님 환영합니다!`);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 실패:", err);
      //toast.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="-mt-4 flex flex-1 cursor-pointer items-center justify-center p-8 md:-mt-15">
        <MoyoLogo type="main" />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 로그인 폼 */}
          <form onSubmit={handleSignInWithEmail}>
            {/* 입력 + 버튼 묶음 */}
            <div className="mb-4 flex flex-col gap-3">
              <AuthInput
                name="email"
                autoComplete="username"
                placeholder="이메일을 입력하세요"
                value={form.email}
                onChange={handleChange}
                validateOnChange={false}
              />

              <AuthInput
                name="password"
                autoComplete="current-password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
                validateOnChange={false}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={isSignInWithEmailPending}
              >
                로그인
              </Button>

              {/* 카카오 로그인 버튼 */}
              <Button
                type="button"
                variant="secondary"
                className="h-12 w-full bg-[#FEE500] text-black hover:bg-[#F4DC00]"
                onClick={() => alert("카카오 로그인 준비 중")}
              >
                <span className="mr-2">
                  <KakaoTalkIcon />
                </span>
                카카오계정으로 시작하기
              </Button>
            </div>

            <hr className="my-6" />

            {/* 하단 링크 */}
            <div className="space-x-2 text-center text-sm text-gray-500">
              <AuthLinks text="회원가입" />
              <span>|</span>
              <AuthLinks text="비밀번호 찾기" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
