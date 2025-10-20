import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import moment from "moment";
import { useRevenueFetch } from "./useRevenueFetch";
import { useRevenueSave } from "./useRevenueSave";
import { useSelector } from "react-redux";

export const useCalendarData = () => {
  const today = new Date();
  const businessId = useSelector((s) => s.business.currentId); // 리덕스 연결

  // 기본 상태
  const [date, setDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expensesByDate, setExpensesByDate] = useState({});
  const [filterMode, setFilterMode] = useState("month");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [expenseSets, setExpenseSets] = useState({
    revenue: [{ id: Date.now(), name: "", amount: "" }],
    expense: [],
    labor: [],
    memo: "",
  });

  // 공통 함수
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const handleTodayClick = useCallback(() => {
    const now = new Date();
    setDate(now);
    setActiveStartDate(now);
  }, []);

  // 데이터 페칭 훅
  const { fetchRevenueData } = useRevenueFetch(businessId, {
    filterMode,
    rangeStart,
    rangeEnd,
    activeStartDate,
    setExpensesByDate,
  });

  useEffect(() => {
    if (businessId) {
        fetchRevenueData();
      }
    }, [fetchRevenueData, businessId]); // 사업장 변경시 재로딩한다

  // 날짜 클릭
  const handleDayClick = useCallback(
    async (clickedDate) => {
      setSelectedDate(clickedDate);
      if (!businessId) return alert("businessId가 없습니다.");

      const key = moment(clickedDate).format("YYYY-MM-DD");
      try {
        const { data, error } = await supabase
          .from("revenue")
          .select("*")
          .eq("business_id", businessId)
          .eq("date", key);

        if (error) throw error;

        if (!data?.length) {
          setExpenseSets({
            revenue: [{ id: Date.now(), name: "", amount: "" }],
            expense: [],
            labor: [],
            memo: "",
          });
        } else {
          const mapData = (filterFn) =>
            data.filter(filterFn).map((x) => ({
              id: x.id,
              name: x.revenue_text,
              amount: x.revenue_amount,
              staff_id: x.staff_id || null,
            }));

          setExpenseSets({
            revenue: mapData((d) => d.isProfit && !d.isMemo),
            expense: mapData((d) => !d.isProfit && !d.staff_id && !d.isMemo),
            labor: mapData((d) => !d.isProfit && d.staff_id && !d.isMemo),
            memo: data.find((d) => d.isMemo)?.revenue_text || "",
          });
        }
        setIsModalOpen(true);
      } catch (err) {
        console.error("handleDayClick 오류:", err);
      }
    },
    [businessId]
  );

  // 저장 훅
  const { saveExpense } = useRevenueSave(
    businessId,
    selectedDate,
    expenseSets,
    setExpensesByDate,
    closeModal
  );

  // 합계 계산
  const getDailySum = useCallback(
    (key) =>
      (expensesByDate[key] || []).reduce(
        (sum, x) => sum + (Number(x.amount) || 0) * (x.isProfit ? 1 : -1),
        0
      ),
    [expensesByDate]
  );

  const monthStart = moment(activeStartDate).startOf("month");
  const monthEnd = moment(activeStartDate).endOf("month");

  const filteredKeys = useMemo(() => {
    const keys = Object.keys(expensesByDate);
    if (!keys.length) return [];
    const inRange = (d, s, e) => moment(d).isBetween(s, e, "day", "[]");
    return keys.filter((k) =>
      filterMode === "month"
        ? inRange(k, monthStart, monthEnd)
        : rangeStart && rangeEnd && inRange(k, rangeStart, rangeEnd)
    );
  }, [expensesByDate, filterMode, monthStart, monthEnd, rangeStart, rangeEnd]);

  const displayedTotal = useMemo(
    () => filteredKeys.reduce((sum, k) => sum + getDailySum(k), 0),
    [filteredKeys, getDailySum]
  );

  // 최종 반환
  return {
    businessId,
    date,
    activeStartDate,
    setActiveStartDate,
    handleDayClick,
    handleTodayClick,
    filterMode,
    setFilterMode,
    rangeStart,
    rangeEnd,
    setRangeStart,
    setRangeEnd,
    displayedTotal,
    isModalOpen,
    closeModal,
    expenseSets,
    setExpenseSets,
    saveExpense,
    selectedDate,
    getDailySum,
  };
};
