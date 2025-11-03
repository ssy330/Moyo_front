import logo from "@/assets/Moyo_logo.png";

export default function GlobalLoader() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white">
      {/* 로고 + 텍스트 */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={logo}
          alt="모요 로고"
          className="w-28 animate-pulse drop-shadow-sm"
        />
        <p className="animate-fade-in text-base font-medium tracking-wide text-gray-600">
          잠시만 기다려주세요 🌿
        </p>
      </div>

      {/* 진행바 */}
      <div className="mt-10 h-1.5 w-44 overflow-hidden rounded-full bg-emerald-200">
        <div className="h-full w-full animate-[loading_1.8s_ease-in-out_infinite] rounded-full bg-emerald-500/80" />
      </div>

      {/* keyframes */}
      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(6px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}
