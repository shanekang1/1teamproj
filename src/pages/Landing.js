import "../styles/landing.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const toAuthEmail = (id) => `${id}@example.com`;

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(location.state?.prefillId || "");
  const [userPw, setUserPw] = useState("");
  const [errLogin, setErrLogin] = useState("");

  // 이미 로그인된 세션이면 메인으로
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrLogin("");

    const userKey = (userId || "").trim().toLowerCase();
    if (!userKey || !userPw) {
      setErrLogin("ID와 PW를 입력하세요.");
      return;
    }

    // Supabase 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email: toAuthEmail(userKey),
      password: userPw,
    });

    if (error) {
      // 로그인 실패 → 회원가입 페이지로 유도
      navigate("/login", { state: { prefillId: userKey } });
      return;
    }

    try {
      // 현재 로그인된 사용자 정보 가져오기
      const user = data?.user;
      if (!user) {
        setErrLogin("사용자 정보를 불러올 수 없습니다.");
        return;
      }

      // businesses 테이블에서 이 사용자의 비즈니스 ID 찾기
      const { data: business, error: bizErr } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (bizErr) {
        console.warn("비즈니스 ID 조회 실패:", bizErr.message);
      } else if (business?.id) {
        // 비즈니스 ID 저장
        localStorage.setItem("businessId", business.id);
      }

      // 세션도 저장
      localStorage.setItem("session", JSON.stringify(data.session));

      // 메인 화면으로 이동
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 처리 중 오류:", err);
      setErrLogin("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="wrap">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="PW"
          type="password"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">로그인</button>
      </form>
      {errLogin && <p style={{ color: "crimson" }}>{errLogin}</p>}

      <Link to="/login" state={{ prefillId: userId }}>
        회원가입
      </Link>
    </div>
  );
}
