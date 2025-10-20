import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { calcDailyTotal } from "./expenseUtils";

export const useExpenseModal = ({ expenseSets, setExpenseSets, businessId }) => {
  // 직원 목록
  const [staffs, setStaffs] = useState([]);

  // 자동완성 검색 상태
  const [searchText, setSearchText] = useState("");
  const [activeInputId, setActiveInputId] = useState(null);

  // 직원 목록 로드
  useEffect(() => {
    if (!businessId) {
      console.warn("businessId가 없습니다. staff 목록을 불러오지 않습니다.");
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, name")
        .eq("business_id", businessId)
        .order("name", { ascending: true });
      if (!error && data) setStaffs(data);
    })();
  }, [businessId]);

  // 직원 검색 결과 필터링
  const filteredStaffs = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    if (!text) return [];
    return staffs.filter((s) => s.name.toLowerCase().includes(text)).slice(0, 5);
  }, [searchText, staffs]);

  // expenseSets 구조 안정화 (방어코드)
  const safeSets = useMemo(() => {
    const v = expenseSets || {};
    if (Array.isArray(v)) return { revenue: v, expense: [], labor: [], memo: "" };
    return {
      revenue: Array.isArray(v.revenue) ? v.revenue : [],
      expense: Array.isArray(v.expense) ? v.expense : [],
      labor: Array.isArray(v.labor) ? v.labor : [],
      memo: typeof v.memo === "string" ? v.memo : "",
    };
  }, [expenseSets]);

  const updateSets = (next) => setExpenseSets(next);

  // 직원 자동완성 선택 시 해당 항목 업데이트
  const handleStaffSelect = (catKey, id, staff) => {
    const updated = safeSets[catKey].map((row) =>
      row.id === id ? { ...row, name: staff.name, staff_id: staff.id } : row
    );
    updateSets({ ...safeSets, [catKey]: updated });
    setSearchText("");
    setActiveInputId(null);
  };

  // 입력값 변경
  const handleInputChange = (catKey, id, field, value) => {
    updateSets({
      ...safeSets,
      [catKey]: safeSets[catKey].map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    });
  };

  // 항목 추가
  const handleAddSet = (catKey) => {
    updateSets({
      ...safeSets,
      [catKey]: [
        ...safeSets[catKey],
        { id: Date.now() + Math.random(), name: "", amount: "" },
      ],
    });
  };

  // 항목 삭제
  const handleRemoveSet = (catKey, id) => {
    updateSets({
      ...safeSets,
      [catKey]: safeSets[catKey].filter((row) => row.id !== id),
    });
  };

  // 메모 변경
  const handleMemoChange = (e) => {
    updateSets({ ...safeSets, memo: e.target.value });
  };

  // 일일 합계 계산
  const dailyTotal = useMemo(() => calcDailyTotal(safeSets), [safeSets]);

  return {
    safeSets,
    handleInputChange,
    handleAddSet,
    handleRemoveSet,
    handleMemoChange,
    handleStaffSelect,
    filteredStaffs,
    activeInputId,
    setActiveInputId,
    searchText,
    setSearchText,
    dailyTotal,
  };
};
