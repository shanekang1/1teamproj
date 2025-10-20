import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/login.css";

// 내부 전용 Auth 이메일(노출/저장 안 함)
const toAuthEmail = (userId) => `${userId}@example.com`;
const onlyDigits = (s) => s.replace(/\D/g, "");

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [signupForm, setSignupForm] = useState({
    userId: location.state?.prefillId || "",
    userPw: "",
    userName: "",
    rrnFront: "",
    rrnBack1: "",
    userHp: "",
  });

  const [signupErr, setSignupErr] = useState({});
  const [bannerMsg, setBannerMsg] = useState("");
  const [idCheck, setIdCheck] = useState("idle");

  const showBanner = (msg) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(""), 2500);
  };

  // ====== Validators ======
  const validateId = (v) => {
    const val = (v || "").trim().toLowerCase();
    if (!val) return "ID를 입력하세요.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(val))
      return "ID는 영문+숫자 조합만 가능합니다.";
    return "";
  };
  const validatePw = (v) => {
    if (!v) return "비밀번호를 입력하세요.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v))
      return "비밀번호는 영문+숫자 조합, 8자리 이상입니다.";
    return "";
  };
  const validateRrnFront = (v) =>
    /^\d{6}$/.test(v) ? "" : "주민번호 앞자리는 숫자 6자리여야 합니다.";
  const validateRrnBack1 = (v) =>
    /^\d{1}$/.test(v) ? "" : "주민번호 뒤자리는 숫자 1자리여야 합니다.";
  const validatePhone = (v) =>
    !v || /^\d+$/.test(v) ? "" : "전화번호는 숫자만 입력 가능합니다.";

  // ====== Handlers ======
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "rrnFront" || name === "rrnBack1" || name === "userHp") {
      setSignupForm((s) => ({ ...s, [name]: onlyDigits(value) }));
    } else {
      setSignupForm((s) => ({ ...s, [name]: value }));
    }
    if (name === "userId") setIdCheck("idle");
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    let msg = "";
    if (name === "userId") msg = validateId(value);
    if (name === "userPw") msg = validatePw(value);
    if (name === "rrnFront") msg = validateRrnFront(value);
    if (name === "rrnBack1") msg = validateRrnBack1(value);
    if (name === "userHp") msg = validatePhone(value);
    setSignupErr((s) => ({ ...s, [name]: msg }));
    if (msg) showBanner(msg);
  };

  const handleIdCheck = async () => {
    const msg = validateId(signupForm.userId);
    if (msg) {
      setSignupErr((s) => ({ ...s, userId: msg }));
      setIdCheck("needFormat");
      showBanner(msg);
      return;
    }
    const normalized = signupForm.userId.trim().toLowerCase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalized)
      .limit(1);
    if (error) {
      console.warn("ID check error:", error);
      return setIdCheck("ok");
    }
    setIdCheck(data && data.length ? "dup" : "ok");
  };

  const submit = async (e) => {
    e.preventDefault();

    const errs = {
      userId: validateId(signupForm.userId),
      userPw: validatePw(signupForm.userPw),
      rrnFront: validateRrnFront(signupForm.rrnFront),
      rrnBack1: validateRrnBack1(signupForm.rrnBack1),
      userHp: validatePhone(signupForm.userHp),
    };
    setSignupErr(errs);
    const firstErr = Object.values(errs).find(Boolean);
    if (firstErr) return showBanner(firstErr);

    const normalized = signupForm.userId.trim().toLowerCase();

    // 최종 중복 확인
    const { data: dupe, error: dupeErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalized)
      .limit(1);
    if (!dupeErr && dupe?.length) {
      setIdCheck("dup");
      return showBanner("이미 사용 중인 ID입니다.");
    }

    // 1) Auth 가입
    const authEmail = toAuthEmail(normalized);
    const { data: sign, error: signErr } = await supabase.auth.signUp({
      email: authEmail,
      password: signupForm.userPw,
      options: {
        data: {
          username: normalized,
          name: signupForm.userName || "",
          phone: signupForm.userHp || "",
        },
      },
    });
    if (signErr) return showBanner(`회원가입 오류: ${signErr.message}`);

    // 2) profiles에 행 생성
    const user = sign.user;
    if (!user) return showBanner("이메일 확인이 필요합니다(콘솔 설정 확인).");

    const { error: profErr } = await supabase.from("profiles").insert({
      id: user.id,
      username: normalized,
      name: signupForm.userName || "",
      rrn_front: signupForm.rrnFront || null,
      rrn_tail1: signupForm.rrnBack1 || null,
      phone: signupForm.userHp || null,
    });
    if (profErr) return showBanner(`프로필 저장 오류: ${profErr.message}`);

    // 가입 성공 → 로그인 화면으로 (ID 프리필)
    navigate("/landing", { replace: true, state: { prefillId: normalized } });
  };

  return (
    <div className="wrap">
      <div className={`v-banner ${bannerMsg ? "show" : ""}`}>{bannerMsg}</div>

      <h2>회원가입</h2>
      <form onSubmit={submit} className="form">
        {/* ID + 중복검사 */}
        <div className="row">
          <div className="col">
            <label>ID (영문+숫자 조합)</label>
            <input
              name="userId"
              value={signupForm.userId}
              onChange={onChange}
              onBlur={onBlur}
              className={signupErr.userId ? "input error" : "input"}
              placeholder="예: junhwan98"
              autoComplete="username"
            />
            {signupErr.userId && (
              <small className="help error">{signupErr.userId}</small>
            )}
          </div>
          <div className="col col--idcheck">
            <button type="button" className="btn" onClick={handleIdCheck}>
              ID 중복검사
            </button>
            <div className="idcheck-msg">
              {idCheck === "dup" && (
                <span className="msg msg--bad">ID가 중복입니다.</span>
              )}
              {idCheck === "ok" && (
                <span className="msg msg--good">사용 가능한 ID입니다.</span>
              )}
              {idCheck === "needFormat" && (
                <span className="msg">형식을 먼저 맞춰주세요.</span>
              )}
            </div>
          </div>
        </div>

        {/* PW */}
        <label>비밀번호 (영문+숫자, 최소 8자)</label>
        <input
          name="userPw"
          type="password"
          value={signupForm.userPw}
          onChange={onChange}
          onBlur={onBlur}
          className={signupErr.userPw ? "input error" : "input"}
          placeholder="영문+숫자, 8자 이상"
          autoComplete="new-password"
        />
        {signupErr.userPw && (
          <small className="help error">{signupErr.userPw}</small>
        )}

        {/* 이름 */}
        <label>이름</label>
        <input
          name="userName"
          value={signupForm.userName}
          onChange={onChange}
          className="input"
          placeholder="이름 입력"
          autoComplete="name"
        />

        {/* 주민번호 */}
        <label>주민등록번호</label>
        <div className="row">
          <input
            name="rrnFront"
            value={signupForm.rrnFront}
            onChange={onChange}
            onBlur={onBlur}
            className={signupErr.rrnFront ? "input error" : "input"}
            placeholder="앞자리(숫자 6자리)"
            maxLength={6}
            inputMode="numeric"
          />
          <span className="dash">-</span>
          <input
            name="rrnBack1"
            value={signupForm.rrnBack1}
            onChange={onChange}
            onBlur={onBlur}
            className={signupErr.rrnBack1 ? "input error" : "input"}
            placeholder="뒤 1자리"
            maxLength={1}
            inputMode="numeric"
          />
          <span className="mask">******</span>
        </div>
        {signupErr.rrnFront && (
          <small className="help error">{signupErr.rrnFront}</small>
        )}
        {signupErr.rrnBack1 && (
          <small className="help error">{signupErr.rrnBack1}</small>
        )}

        {/* 전화번호 */}
        <label>전화번호</label>
        <input
          name="userHp"
          value={signupForm.userHp}
          onChange={onChange}
          onBlur={onBlur}
          className={signupErr.userHp ? "input error" : "input"}
          placeholder="전화번호 입력"
          inputMode="numeric"
        />
        {signupErr.userHp && (
          <small className="help error">{signupErr.userHp}</small>
        )}

        <button type="submit" className="btn primary" style={{ marginTop: 8 }}>
          회원가입
        </button>
      </form>
    </div>
  );
}
