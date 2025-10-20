import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/staffManager.css";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRow, setNewRow] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  // staff 테이블에 1000명 더미데이터 추가
  const insertDummyStaff = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const businessId =
      localStorage.getItem("businessId") ||
      sessionStorage.getItem("businessId");

    if (!user || !businessId) {
      alert("로그인 및 businessId 확인 필요");
      return;
    }

    const dummyData = Array.from({ length: 1000 }).map((_, i) => ({
      owner_id: user.id,
      business_id: businessId,
      name: `직원${i + 1}`,
      gender: i % 2 === 0 ? "남" : "여",
      age: 20 + (i % 40),
      phone: `010-${String(1000 + i).slice(-4)}-${String(2000 + i).slice(-4)}`,
      pay_type: i % 3 === 0 ? "시급" : "월급",
      wage: 10000 + (i % 100) * 100,
    }));

    const { error } = await supabase.from("staff").insert(dummyData);
    if (error) console.error("❌ 더미데이터 삽입 실패:", error);
    else alert("✅ 더미데이터 1000명 추가 완료!");
  };

  // ✅ business_id 로드
  const [businessId, setBusinessId] = useState(null);
  useEffect(() => {
    const stored =
      localStorage.getItem("businessId") ||
      sessionStorage.getItem("businessId");
    setBusinessId(stored);
  }, []);

  // ✅ 전체 직원 데이터 로드
  const fetchStaff = async () => {
    if (!businessId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("business_id", businessId);

    if (error) {
      console.error("❌ 데이터 불러오기 오류:", error);
      setLoading(false);
      return;
    }

    const sorted = (data || []).sort((a, b) =>
      (a.created_at || "").localeCompare(b.created_at || "")
    );
    setStaffList(sorted);
    setLoading(false);
  };

  useEffect(() => {
    if (businessId) fetchStaff();
  }, [businessId]);

  // ✅ 정렬 기능 (전체 로컬 정렬)
  const handleSort = (field) => {
    let order = sortOrder;
    if (sortField === field) order = sortOrder === "asc" ? "desc" : "asc";
    else order = "asc";

    setSortField(field);
    setSortOrder(order);

    setStaffList((prev) => {
      const sorted = [...prev].sort((a, b) => {
        let valA = a[field] ?? "";
        let valB = b[field] ?? "";

        // 성별 정렬
        if (field === "gender") {
          return order === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }

        // 숫자 정렬
        if (!isNaN(valA) && !isNaN(valB)) {
          return order === "asc" ? valA - valB : valB - valA;
        }

        // 이름 정렬 (ㄱ~ㅎ 순)
        return order === "asc"
          ? String(valA).localeCompare(String(valB), "ko-KR")
          : String(valB).localeCompare(String(valA), "ko-KR");
      });
      return sorted;
    });
  };

  // ✅ 인원 추가 (상단 고정)
  const handleAddRow = () => {
    setEditId(null);
    setNewRow({
      name: "",
      gender: "남",
      age: "",
      phone: "",
      pay_type: "시급",
      wage: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 인원 저장 (RLS 대응)
  const handleSave = async () => {
    if (!newRow.name || !newRow.age || !newRow.phone || !newRow.wage) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 🔒 현재 로그인된 유저 ID 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!businessId) {
      alert("사업체 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const { error } = await supabase.from("staff").insert([
      {
        owner_id: user.id, // ✅ RLS 필수
        business_id: businessId, // ✅ RLS 필수
        name: newRow.name,
        gender: newRow.gender,
        age: parseInt(newRow.age, 10),
        phone: newRow.phone,
        pay_type: newRow.pay_type,
        wage: parseInt(newRow.wage, 10),
      },
    ]);

    if (error) {
      alert("등록 실패 ❌: " + error.message);
    } else {
      alert("등록 완료 ✅");
      setNewRow(null);
      fetchStaff();
    }
  };

  // ✅ 수정
  const handleEdit = (staff) => {
    setNewRow(null);
    setEditId(staff.id);
    setEditData({ ...staff });
  };

  const handleEditSave = async () => {
    const { error } = await supabase
      .from("staff")
      .update({
        name: editData.name,
        gender: editData.gender,
        age: parseInt(editData.age, 10),
        phone: editData.phone,
        pay_type: editData.pay_type,
        wage: parseInt(editData.wage, 10),
      })
      .eq("id", editId);

    if (error) {
      alert("수정 실패 ❌: " + error.message);
    } else {
      alert("수정 완료 ✅");
      setEditId(null);
      fetchStaff();
    }
  };

  // ✅ 삭제
  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" 직원을 삭제하시겠습니까?`)) {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) alert("삭제 실패 ❌: " + error.message);
      else {
        alert("삭제 완료 ✅");
        fetchStaff();
      }
    }
  };

  // ✅ 검색
  const filteredStaff = staffList.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSortBtn = (field) => (
    <button
      className={`sort-btn ${sortField === field ? sortOrder : ""}`}
      onClick={() => handleSort(field)}
    >
      {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
    </button>
  );

  return (
    <div className="main-content">
      <div className="topbar">
        <h1>직원(알바)관리 페이지</h1>
        <button className="register-btn" onClick={handleAddRow}>
          + 인원 추가
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="직원/알바 검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th>이름 {renderSortBtn("name")}</th>
            <th>성별 {renderSortBtn("gender")}</th>
            <th>나이 {renderSortBtn("age")}</th>
            <th>연락처</th>
            <th>근무형태 {renderSortBtn("pay_type")}</th>
            <th>급여 {renderSortBtn("wage")}</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {/* ✅ 신규 입력행: 항상 맨 위 */}
          {newRow && (
            <tr className="edit-row top-row">
              <td>
                <input
                  name="name"
                  value={newRow.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <select
                  name="gender"
                  value={newRow.gender}
                  onChange={handleChange}
                >
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </td>
              <td>
                <input
                  name="age"
                  value={newRow.age}
                  onChange={handleChange}
                  type="number"
                />
              </td>
              <td>
                <input
                  name="phone"
                  value={newRow.phone}
                  onChange={handleChange}
                />
              </td>
              <td>
                <select
                  name="pay_type"
                  value={newRow.pay_type}
                  onChange={handleChange}
                >
                  <option value="시급">시급</option>
                  <option value="월급">월급</option>
                </select>
              </td>
              <td>
                <input
                  name="wage"
                  value={newRow.wage}
                  onChange={handleChange}
                  type="number"
                />
              </td>
              <td>
                <button className="save-btn inline" onClick={handleSave}>
                  저장
                </button>
                <button
                  className="cancel-btn inline"
                  onClick={() => setNewRow(null)}
                >
                  취소
                </button>
              </td>
            </tr>
          )}

          {/* ✅ 직원 목록 */}
          {filteredStaff.length > 0 ? (
            filteredStaff.map((s) =>
              editId === s.id ? (
                <tr key={s.id} className="edit-row">
                  <td>
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editData.gender}
                      onChange={(e) =>
                        setEditData({ ...editData, gender: e.target.value })
                      }
                    >
                      <option value="남">남</option>
                      <option value="여">여</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={editData.age}
                      onChange={(e) =>
                        setEditData({ ...editData, age: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editData.pay_type}
                      onChange={(e) =>
                        setEditData({ ...editData, pay_type: e.target.value })
                      }
                    >
                      <option value="시급">시급</option>
                      <option value="월급">월급</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={editData.wage}
                      onChange={(e) =>
                        setEditData({ ...editData, wage: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="save-btn inline"
                      onClick={handleEditSave}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn inline"
                      onClick={() => setEditId(null)}
                    >
                      취소
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.gender}</td>
                  <td>{s.age}</td>
                  <td>{s.phone}</td>
                  <td>{s.pay_type}</td>
                  <td>{s.wage?.toLocaleString()}원</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(s)}>
                      수정
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(s.id, s.name)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#777" }}>
                등록된 직원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && <p style={{ textAlign: "center" }}>불러오는 중...</p>}
    </div>
  );
};

export default Staff;
