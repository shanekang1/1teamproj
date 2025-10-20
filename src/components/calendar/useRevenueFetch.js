import { useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { getMonthRange, isWithinAllowedRange, groupByDate } from "./utils/dateUtils";

export const useRevenueFetch = (businessId, {
  filterMode,
  rangeStart,
  rangeEnd,
  activeStartDate,
  setExpensesByDate
}) => {
  const fetchRevenueData = useCallback(async () => {
    if (!businessId) return;

    let start, end;

    if (filterMode === "range" && rangeStart && rangeEnd) {
      if (!isWithinAllowedRange(rangeStart, rangeEnd)) {
        alert("조회는 저번 달부터 이번 달까지만 가능합니다.");
        return;
      }
      start = rangeStart;
      end = rangeEnd;
    } else {
      ({ start, end } = getMonthRange(activeStartDate));
    }

    try {
      const { data, error } = await supabase
        .from("revenue")
        .select("*")
        .eq("business_id", businessId)
        .gte("date", start)
        .lte("date", end);

      if (error) throw error;
      setExpensesByDate(groupByDate(data));
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
  }, [businessId, filterMode, rangeStart, rangeEnd, activeStartDate, setExpensesByDate]);

  return { fetchRevenueData };
};
