import axios from "axios";
import { API_BASE } from "./api";

export async function checkServerConnection() {
  try {
    // FastAPI에 맞게 /api/v1/health 로 요청
    const res = await axios.get(`${API_BASE}/health`, {
      timeout: 3000,
    });
    console.log("✅ 서버 연결 성공:", res.data);
    return true;
  } catch (err) {
    console.error("❌ 서버 연결 실패:", err);
    return false;
  }
}
