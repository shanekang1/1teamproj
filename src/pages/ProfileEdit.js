// src/pages/ProfileEdit.js
import "../styles/landing.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProfileEdit() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // 읽기전용(ID)
  const [userName, setUserName] = useState(""); // = profiles.name
  const [userHp, setUserHp] = useState(""); // = profiles.phone

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // 내 프로필 로딩
  useEffect(() => {
    (async () => {
      setErr("");
      setOk("");
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) {
        navigate("/landing", { replace: true });
        return;
      }

      const { data: row, error } = await supabase
        .from("profiles")
        .select("username, name, phone")
        .eq("id", uid)
        .maybeSingle();

      if (error) {
        setErr(error.message);
      } else if (row) {
        setUsername((row.username || "").trim().toLowerCase());
        setUserName(row.name || "");
        setUserHp(row.phone || "");
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) {
      setErr("세션이 만료되었습니다. 다시 로그인해주세요.");
      return navigate("/landing", { replace: true });
    }

    // 1) profiles 업데이트
    const { error: profErr } = await supabase
      .from("profiles")
      .update({
        name: userName || "",
        phone: userHp ? userHp : null,
      })
      .eq("id", uid);

    if (profErr) {
      setErr(profErr.message);
      return;
    }

    // 2) (선택) Auth 메타데이터도 동기화 → 세션에서 바로 반영
    const { error: authErr } = await supabase.auth.updateUser({
      data: {
        name: userName || "",
        phone: userHp ? userHp : null,
      },
    });
    if (authErr) {
      setErr(authErr.message);
      return;
    }

    setOk("저장되었습니다.");
  };

  if (loading) {
    return (
      <div className="wrap">
        <h2>개인정보 수정</h2>
        <p>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h2>개인정보 수정</h2>

      <form onSubmit={handleSubmit} className="form">
        {/* ID (수정불가) */}
        <label>ID</label>
        <input value={username} readOnly className="input" />

        {/* 이름 */}
        <label>이름</label>
        <input
          className="input"
          placeholder="이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="name"
        />

        {/* 전화번호 */}
        <label>전화번호 (숫자만)</label>
        <input
          className="input"
          placeholder="숫자만 입력"
          value={userHp}
          onChange={(e) => setUserHp(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          autoComplete="tel"
        />

        <button type="submit" className="btn primary" style={{ marginTop: 10 }}>
          저장
        </button>
      </form>

      {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
      {ok && <p style={{ color: "#16a34a", marginTop: 8 }}>{ok}</p>}
    </div>
  );
}
