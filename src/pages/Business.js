import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { mapBusinessToRow } from "../utils/dbMap";
import "../styles/business.css";

export default function Business() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [bizForm, setBizForm] = useState({
    comName: "",
    bizCat: "",
    bizOwner: "",
    comAddr: "",
    ceoHp: "",
    comRegion: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }
      setUserId(data.user.id);
    })();
  }, [navigate]);

  const onChangeBizForm = (e) =>
    setBizForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmitBizForm = async (e) => {
    e.preventDefault();
    if (!userId) return;

    // 사업장 등록
    const { data, error } = await supabase
      .from("businesses")
      .insert([mapBusinessToRow(bizForm, userId)])
      .select()
      .single();

    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }

    navigate("/main");
  };

  return (
    <div className="biz-wrap">
      <h2>업체 등록</h2>
      <form onSubmit={handleSubmitBizForm}>
        <input name="comName" placeholder="상호명" onChange={onChangeBizForm} />
        <input name="bizCat" placeholder="업직종" onChange={onChangeBizForm} />
        <input
          name="bizOwner"
          placeholder="사업자명"
          onChange={onChangeBizForm}
        />
        <input
          name="comAddr"
          placeholder="사업장 주소"
          onChange={onChangeBizForm}
        />
        <input name="ceoHp" placeholder="전화번호" onChange={onChangeBizForm} />
        <input name="comRegion" placeholder="지역" onChange={onChangeBizForm} />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}
