import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthLinks from "@/components/authComponents/AuthLinks";
import { Button } from "@/components/ui/button";
import { useResendTimer } from "@/hooks/useResendTimer";
import { MSGS } from "@/utils/messages";
import {
  useSendCode,
  useSignup,
  useVerifyCode,
} from "@/hooks/mutation/auth/use-signup-mutation";
import { toast } from "sonner";
import RegisterStep1Basic from "@/components/authComponents/RegisterPageStep/RegisterStep1Basic";
import RegisterStep2Profile from "@/components/authComponents/RegisterPageStep/RegisterStep2Profile";
import RegisterStep3Email from "@/components/authComponents/RegisterPageStep/RegisterStep3Email";
import RegisterStep4Password from "@/components/authComponents/RegisterPageStep/RegisterStep4Password";
import { RegisterStepIndicator } from "@/components/authComponents/RegisterPageStep/RegisterStepIndicator";
import { setSession } from "@/features/sessionSlice";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";

type Step = 1 | 2 | 3 | 4;

const STEP_META: { id: Step; label: string; desc: string }[] = [
  { id: 1, label: "기본 정보", desc: "이름과 닉네임을 설정해요." },
  { id: 2, label: "프로필", desc: "나를 표현할 프로필 이미지를 선택해요." },
  { id: 3, label: "이메일 인증", desc: "안전한 모요 이용을 위해 인증해요." },
  { id: 4, label: "비밀번호", desc: "마지막으로 비밀번호를 정해요." },
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ========= 기본 폼 상태 =========
  const [name, setNameLocal] = useState("");
  const [nickname, setNicknameLocal] = useState("");
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ========= 프로필 이미지 (STEP 2) =========
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const handleProfileSelected = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("이미지 파일만 업로드할 수 있어요.");
      return;
    }

    if (profilePreview) URL.revokeObjectURL(profilePreview);
    const url = URL.createObjectURL(file);

    setProfileImage(file); // 서버로 보낼 최종 파일
    setProfilePreview(url); // 프리뷰
  };

  // ========= 이메일 인증 관련 =========
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // ========= 유효성 상태 =========
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ========= 재전송 타이머 =========
  const { isRunning, start, formatTime } = useResendTimer(60);
  const [resendKey, setResendKey] = useState(0);

  // ========= 단계 / 애니메이션 방향 =========
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goToStep = (next: Step) => {
    if (next < 1 || next > 4) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // ========= 전체 폼 유효 =========
  const isFormValid = useMemo(
    () =>
      isNameValid === true &&
      isNickValid === true &&
      isEmailVerified === true &&
      isPwValid === true &&
      isPwMatch === true &&
      isCodeValid === true,
    [
      isNameValid,
      isNickValid,
      isEmailVerified,
      isPwValid,
      isPwMatch,
      isCodeValid,
    ],
  );

  // 단계별 유효성 (프로필은 지금은 선택사항)
  // const isStep1Valid = isNameValid === true && isNickValid === true;
  const isStep2Valid = true; // 프로필 필수로 하고 싶으면 !!profileImage
  const isStep3Valid = isEmailVerified === true && isCodeValid === true;
  const isStep4Valid = isPwValid === true && isPwMatch === true;

  // ========= 서버 통신 훅 =========
  const { mutate: sendCode, isPending: loadingSend } = useSendCode();
  const { mutate: verifyCode, isPending: loadingVerify } = useVerifyCode();
  const { mutate: signup, isPending: loadingSignup } = useSignup();

  // ========= 핸들러들 =========
  const handleSendCode = () => {
    if (!email.trim() || isEmailValid === false) {
      toast(MSGS.INVALID_EMAIL);
      return;
    }
    if (isRunning || isCodeValid === true) return;

    sendCode(email, {
      onSuccess: () => {
        setIsCodeSent(true);
        start();
        setResendKey((prev) => prev + 1);
        toast.success(MSGS.CODE_SENT);
      },
      onError: (err) => alert(err.message),
    });
  };

  const handleVerifyCode = () => {
    if (!inputCode.trim()) {
      toast(MSGS.INVALID_OR_EXPIRED_CODE);
      return;
    }
    if (isCodeValid === true) return;

    verifyCode(
      { email, code: inputCode },
      {
        onSuccess: () => {
          setIsCodeValid(true);
          setIsEmailVerified(true);
          setIsEmailValid(true);
          toast.success(MSGS.CODE_VERIFIED);
        },
        onError: (err) => {
          setIsCodeValid(false);
          toast.error(err.message);
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!isFormValid || !isStep4Valid || loadingSignup) return;

    signup(
      { email, nickname, name, password, profileImage },
      {
        onSuccess: (data) => {
          localStorage.setItem("access_token", data.access_token);
          // Redux에 저장
          dispatch(
            setSession({
              user: mapBackendUserToSessionUser(data.user),
              source: "fastapi",
            }),
          );

          toast.success("가입 완료! 이제 모요를 이용할 수 있어요 🙌");
          navigate("/", { replace: true });
        },
        onError: (err) => toast(err.message),
      },
    );
  };

  const handleChangeEmail = (v: string) => {
    setEmailLocal(v);
    //setIsEmailValid(null);
    setIsCodeSent(false);
    setInputCode("");
    setIsCodeValid(null);
    setIsEmailVerified(false);
  };

  // 이전 다음 안가지는 오류
  const canGoNextFromStep1 = () => {
    // 값 비어 있으면 불가
    if (!name.trim() || !nickname.trim()) return false;

    // 명시적으로 "유효하지 않음"으로 판정된 경우만 막기
    if (isNameValid === false || isNickValid === false) return false;

    return true;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 md:flex-row lg:px-8">
        {/* ===== 왼쪽: 큰 인풋 영역 ===== */}
        <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          {/* 상단: 타이틀 + 작은 스텝 인디케이터 */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* ✅ 모바일: 위 / PC: 오른쪽 */}
            <div className="order-1 sm:order-2">
              <RegisterStepIndicator step={step} />
            </div>

            {/* ✅ 모바일: 아래 / PC: 왼쪽 */}
            <div className="order-2 sm:order-1">
              <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl sm:whitespace-nowrap">
                모요 회원가입
              </h2>
              <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
                {STEP_META.find((m) => m.id === step)?.desc}
              </p>
            </div>
          </div>

          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="relative flex flex-1 items-start">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{
                    y: direction === 1 ? 40 : -40,
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    y: direction === 1 ? -40 : 40,
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full"
                >
                  {step === 1 && (
                    <RegisterStep1Basic
                      name={name}
                      nickname={nickname}
                      onChangeName={setNameLocal}
                      onChangeNickname={setNicknameLocal}
                      setIsNameValid={setIsNameValid}
                      setIsNickValid={setIsNickValid}
                    />
                  )}

                  {step === 2 && (
                    <RegisterStep2Profile
                      profilePreview={profilePreview}
                      setProfilePreview={setProfilePreview}
                      isDragging={isDragging}
                      setIsDragging={setIsDragging}
                      onProfileFileSelected={handleProfileSelected}
                    />
                  )}

                  {step === 3 && (
                    <RegisterStep3Email
                      email={email}
                      inputCode={inputCode}
                      isCodeSent={isCodeSent}
                      isCodeValid={isCodeValid}
                      isEmailValid={isEmailValid}
                      loadingSend={loadingSend}
                      loadingVerify={loadingVerify}
                      isRunning={isRunning}
                      resendKey={resendKey}
                      formatTime={formatTime}
                      onChangeEmail={handleChangeEmail}
                      onChangeCode={setInputCode}
                      setIsEmailValid={setIsEmailValid}
                      onClickSendCode={handleSendCode}
                      onClickVerifyCode={handleVerifyCode}
                    />
                  )}

                  {step === 4 && (
                    <RegisterStep4Password
                      password={password}
                      passwordConfirm={passwordConfirm}
                      onChangePassword={setPasswordLocal}
                      onChangePasswordConfirm={setPasswordConfirm}
                      setIsPwValid={setIsPwValid}
                      setIsPwMatch={setIsPwMatch}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ===== 하단 버튼 영역 ===== */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {/* 왼쪽: 이전 단계 */}
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 min-w-[100px] rounded-full border-none bg-transparent text-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-800"
                    onClick={() => goToStep(((step - 1) as Step) || 1)}
                  >
                    이전 단계
                  </Button>
                )}
              </div>

              {/* 오른쪽: 다음 / 완료 */}
              <div className="flex items-center justify-end gap-2">
                {step < 4 && (
                  <Button
                    type="button"
                    onClick={() => {
                      if (step === 1 && !canGoNextFromStep1()) return;
                      if (step === 2 && !isStep2Valid) return;
                      if (step === 3 && !isStep3Valid) return;
                      goToStep(((step + 1) as Step) || 4);
                    }}
                    className="h-11 min-w-[100px]"
                  >
                    다음
                  </Button>
                )}

                {step === 4 && (
                  <Button
                    type="button"
                    disabled={!isFormValid || !isStep4Valid || loadingSignup}
                    onClick={handleSubmit}
                    className="h-11 min-w-[100px]"
                  >
                    {loadingSignup ? "등록 중…" : "완료"}
                  </Button>
                )}
              </div>
            </div>

            {/* 로그인 링크 */}
            <div className="mt-8 flex flex-col items-center justify-center pb-2 text-xs text-neutral-600 sm:flex-row sm:justify-start sm:space-x-2">
              <span>이미 계정이 있으신가요?</span>
              <AuthLinks text="로그인" />
            </div>
          </form>
        </div>

        {/* ===== 오른쪽: Moyo + 단계 설명 영역 ===== */}
        <div className="hidden w-80 flex-col justify-between bg-gradient-to-b from-emerald-50 via-emerald-100 to-emerald-50 px-8 py-10 md:flex lg:w-96">
          <div>
            <div className="mb-8">
              <MoyoLogo />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.25em] text-emerald-500 uppercase">
              MOYO SIGN UP
            </p>
            <h1 className="mt-3 text-2xl leading-snug font-semibold text-emerald-900 lg:text-3xl">
              모요 시작을 위한
              <br />네 가지 단계
            </h1>
            <p className="mt-4 text-xs leading-relaxed text-emerald-900/80 lg:text-sm">
              이름부터 프로필, 이메일 인증, 비밀번호 설정까지
              <br />
              한 번에 끝내는 회원가입 플로우예요.
              <br />각 단계는 필요할 때 언제든 다시 돌아갈 수 있어요.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {STEP_META.map((meta) => (
              <div
                key={meta.id}
                className={`rounded-2xl border bg-white/70 px-4 py-3 text-xs backdrop-blur-sm transition-transform ${
                  step === meta.id
                    ? "translate-y-0 shadow-md"
                    : "translate-y-2 opacity-70"
                }`}
              >
                <p className="text-[10px] font-semibold text-emerald-500">
                  STEP {meta.id}. {meta.label}
                </p>
                <p className="mt-1 text-[11px] text-emerald-900/80">
                  {meta.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
