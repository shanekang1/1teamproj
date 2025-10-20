import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/business.css";

export default function BusinessSwitch() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [bizList, setBizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
        .select("id, name")
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
      setLoading(false);
    })();
  }, [navigate]);

  const handleSwitchBusiness = (id) => {
    // 선택된 사업장으로 이동
    navigate(`/main/${id}`);
  };

  if (loading) {
    return (
      <div className="biz-wrap">
        <h2>업체 전환</h2>
        <p>불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="biz-wrap">
      <h2>업체 전환</h2>

      {/* 사업장 목록 */}
      <div>
        {bizList.map((b) => (
          <div key={b.id} className="business-item">
            <button onClick={() => handleSwitchBusiness(b.id)}>{b.name}</button>
          </div>
        ))}
      </div>

      {msg && <p style={{ color: "red", marginTop: "10px" }}>{msg}</p>}
    </div>
  );
}
