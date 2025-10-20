import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import moment from "moment";

export const useExpenseAnalysis = (businessId) => {
  const [data, setData] = useState({
    byCategory: [],
    byDate: [],
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cleanId = String(businessId || "").trim();
    if (!cleanId) {
      console.warn("businessId가 없습니다. 데이터 조회 중단");
      return;
    }

    const fetchExpenseData = async () => {
      setLoading(true);
      try {
        const start = moment().startOf("month").format("YYYY-MM-DD");
        const end = moment().endOf("month").format("YYYY-MM-DD");

        const { data, error } = await supabase
          .from("revenue")
          .select("date, revenue_text, revenue_amount")
          .eq("business_id", cleanId) // 현재 사업체만 조회
          .eq("isProfit", false)
          .eq("isMemo", false)
          .gte("date", start)
          .lte("date", end);

        if (error) throw error;

        const categoryMap = {};
        const dateMap = {};

        data.forEach((row) => {
          const name = row.revenue_text || "기타";
          const dateKey = row.date;
          const amt = Number(row.revenue_amount) || 0;
          categoryMap[name] = (categoryMap[name] || 0) + amt;
          dateMap[dateKey] = (dateMap[dateKey] || 0) + amt;
        });

        const byCategory = Object.entries(categoryMap).map(([name, amount]) => ({
          name,
          amount,
        }));

        const daysInMonth = moment().daysInMonth();
        const byDate = Array.from({ length: daysInMonth }, (_, i) => {
          const date = moment().startOf("month").add(i, "day");
          const key = date.format("YYYY-MM-DD");
          return { date: date.format("M/D"), amount: dateMap[key] || 0 };
        });

        const totalExpense = byCategory.reduce(
          (sum, x) => sum + x.amount,
          0
        );

        setData({ byCategory, byDate, totalExpense });
      } catch (err) {
        console.error("지출 분석 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [businessId]);

  return { data, loading };
};
