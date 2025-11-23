// MoyoLogo.tsx
import { useNavigate } from "react-router-dom";
import "./MoyoLogo.css";

interface MoyoLogoProps {
  type?: "main" | "small";
}

const MoyoLogo = ({ type = "main" }: MoyoLogoProps) => {
  const nav = useNavigate();

  const sizeClass =
    type === "main" ? "h-[200px] w-auto" : "h-16 w-auto sm:h-20";

  return (
    <div className="mt-10 flex items-center justify-center">
      <svg
        onClick={() => nav("/login")}
        className={`moyo-svg cursor-pointer ${sizeClass}`}
        viewBox="0 -20 300 140"
      >
        {/* 전체 로고를 왼쪽으로 조금 이동 */}
        <g transform="translate(-20, 0)">
          {/* 말풍선 + 얼굴 */}
          <g className="moyo-face">
            <ellipse cx="120" cy="26" rx="46" ry="42" fill="#BFE0B0" />

            {/* 말풍선 꼬리 - 왼쪽 아래로 뾰족 */}
            <path
              d="M92 58 L104 65 Q 95 74 82 82 Q 84 73 92 58 Z"
              fill="#BFE0B0"
            />

            {/* 안쪽 얼굴 배경 */}
            <ellipse cx="120" cy="26" rx="38" ry="34" fill="#FFFDED" />

            <ellipse cx="108" cy="18" rx="4" ry="6" className="eye eye-left" />
            <ellipse cx="132" cy="18" rx="4" ry="6" className="eye eye-right" />
            <path
              className="mouth"
              d="M103 36 Q122 50 137 36"
              fill="none"
              stroke="#BFE0B0"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* 텍스트 (moyo) */}
          <g className="moyo-text" fontWeight="700" fontSize="74">
            <text className="letter letter-1" x="100" y="96">
              m
            </text>
            <text className="letter letter-2" x="157" y="96">
              o
            </text>
            <text className="letter letter-3" x="195" y="96">
              y
            </text>
            <text className="letter letter-4" x="230" y="96">
              o
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default MoyoLogo;
