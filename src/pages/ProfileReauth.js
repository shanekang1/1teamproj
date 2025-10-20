// src/pages/ProfileReauth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// 내부 전용 이메일(ID→이메일 포맷) — Landing.js와 동일 규칙
const toAuthEmail = (id) => `${id}@example.com`;

export default function ProfileReauth() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // 표시용(읽기 전용)
  const [userPw, setUserPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // 1) 세션 확인 + 현재 사용자 ID(username) 확보
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        // 로그인 안 된 상태 → 로그인 페이지로
        navigate("/landing", { replace: true });
        return;
      }

      // 1순위: user_metadata.username (회원가입 시 options.data에 넣었던 값)
      let uname = user.user_metadata?.username;

      // 2순위: profiles 테이블에서 조회
      if (!uname) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        uname = prof?.username || "";
      }

      setUsername((uname || "").trim().toLowerCase());
      setLoading(false);
    })();
  }, [navigate]);

  // 2) PW만 재확인
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!username) {
      setErr("사용자 정보를 불러오지 못했습니다. 다시 로그인해 주세요.");
      return navigate("/landing", { replace: true });
    }
    if (!userPw) {
      setErr("비밀번호를 입력하세요.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: toAuthEmail(username), // Landing.js와 동일 포맷
      password: userPw,
    });

    if (error) {
      setErr("비밀번호가 올바르지 않습니다.");
      return;
    }

    // 재인증 성공 → 프로필 수정 페이지로
    navigate("/profile/edit", { replace: true });
  };

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h2>개인정보 수정 - 재인증</h2>
        <p>로딩 중…</p>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: 16 }}>
      <h2>개인정보 수정 - 재인증</h2>

      <form onSubmit={onSubmit} className="form">
        {/* ID는 재인증 안내용으로만 표시 (수정 불가) */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12, color: "#6b7280" }}>
            ID
          </label>
          <input value={username} readOnly className="input" />
        </div>

        <label style={{ display: "block", fontSize: 12, color: "#6b7280" }}>
          PW
        </label>
        <input
          placeholder="PW"
          type="password"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
          autoComplete="current-password"
          className="input"
        />

        <button type="submit" className="btn primary" style={{ marginTop: 12 }}>
          확인
        </button>
      </form>

      {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
    </div>
  );
}
