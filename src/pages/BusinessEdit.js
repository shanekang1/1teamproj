// src/pages/BusinessEdit.js
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/business.css";

export default function BusinessEdit() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [bizList, setBizList] = useState([]); // 내 사업장 리스트
  const [selectedId, setSelectedId] = useState(null); // 선택된 사업장 id

  const [bizForm, setBizForm] = useState({
    comName: "",
    bizCat: "",
    bizOwner: "",
    comAddr: "",
    ceoHp: "",
    comRegion: "",
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const rowToForm = (row) => ({
    comName: row?.name || "",
    bizCat: row?.category || "",
    bizOwner: row?.owner_name || "",
    comAddr: row?.address || "",
    ceoHp: row?.phone || "",
    comRegion: row?.region || "",
  });

  const formToRow = (form) => ({
    name: form.comName || "",
    category: form.bizCat || "",
    owner_name: form.bizOwner || "",
    address: form.comAddr || "",
    phone: form.ceoHp || null,
    region: form.comRegion || "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        alert("로그인이 필요합니다.");
        navigate("/landing");
        return;
      }
      setUserId(data.user.id);

      // 내 사업장 목록 불러오기
      const { data: rows, error } = await supabase
        .from("businesses")
        .select("id, brand_name, category, owner_name, address, phone, region")
        .eq("owner_id", data.user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        alert("사업장 목록을 불러오지 못했습니다.");
        return;
      }

      if (!rows || rows.length === 0) {
        alert("등록된 사업장이 없습니다. 먼저 업체를 등록하세요.");
        navigate("/business");
        return;
      }

      setBizList(rows);
      setSelectedId(rows[0].id);
      setBizForm(rowToForm(rows[0]));
      setLoading(false);
    })();
  }, [navigate]);

  const onChangeBizForm = (e) => {
    const { name, value } = e.target;
    // 전화번호만 숫자 유효화
    if (name === "ceoHp") {
      const digits = value.replace(/\D/g, "");
      setBizForm((s) => ({ ...s, [name]: digits }));
    } else {
      setBizForm((s) => ({ ...s, [name]: value }));
    }
  };

  const onChangeSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const row = bizList.find((b) => String(b.id) === String(id));
    setBizForm(rowToForm(row));
    setMsg("");
  };

  const handleSubmitBizForm = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!userId || !selectedId) return;

    if (!bizForm.comName.trim()) {
      setMsg("상호명은 필수입니다.");
      return;
    }

    const payload = formToRow(bizForm);

    const { data, error } = await supabase
      .from("businesses")
      .update(payload)
      .eq("id", selectedId)
      .eq("owner_id", userId)
      .select("id, category, owner_name, address, phone, region")
      .single();

    if (error) {
      alert(`수정 실패: ${error.message}`);
      return;
    }

    // 로컬 리스트도 동기화
    setBizList((prev) => prev.map((b) => (b.id === data.id ? data : b)));
    setMsg("저장되었습니다.");
  };

  if (loading) {
    return (
      <div className="biz-wrap">
        <h2>업체 수정</h2>
        <p>불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="biz-wrap">
      <h2>업체 수정</h2>

      {/* 사업장 선택 */}
      <div style={{ marginBottom: 10 }}>
        <select value={selectedId || ""} onChange={onChangeSelect}>
          {bizList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/business/switch")}
        >
          업체 전환
        </button>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmitBizForm}>
        <input
          name="comName"
          placeholder="상호명"
          value={bizForm.comName}
          onChange={onChangeBizForm}
        />
        <input
          name="bizCat"
          placeholder="업직종"
          value={bizForm.bizCat}
          onChange={onChangeBizForm}
        />
        <input
          name="bizOwner"
          placeholder="사업자명"
          value={bizForm.bizOwner}
          onChange={onChangeBizForm}
        />
        <input
          name="comAddr"
          placeholder="사업장 주소"
          value={bizForm.comAddr}
          onChange={onChangeBizForm}
        />
        <input
          name="ceoHp"
          placeholder="전화번호"
          value={bizForm.ceoHp}
          onChange={onChangeBizForm}
          inputMode="numeric"
        />
        <input
          name="comRegion"
          placeholder="지역"
          value={bizForm.comRegion}
          onChange={onChangeBizForm}
        />
        <button type="submit">저장</button>
      </form>

      {msg && (
        <p
          style={{
            marginTop: 8,
            color: msg.includes("저장") ? "#16a34a" : "crimson",
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
