import moment from "moment";

// 현재 달의 시작 ~ 끝
export const getMonthRange = (date) => ({
  start: moment(date).startOf("month").format("YYYY-MM-DD"),
  end: moment(date).endOf("month").format("YYYY-MM-DD"),
});

// 허용 가능한 기간 (저번 달 ~ 이번 달)
export const isWithinAllowedRange = (start, end) => {
  const lastMonthStart = moment().subtract(1, "month").startOf("month");
  const thisMonthEnd = moment().endOf("month");
  return (
    !moment(start).isBefore(lastMonthStart, "day") &&
    !moment(end).isAfter(thisMonthEnd, "day")
  );
};

// Supabase 데이터 날짜별 그룹화
export const groupByDate = (data = []) =>
  data.reduce((acc, cur) => {
    const key = cur.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      id: cur.id,
      name: cur.revenue_text,
      amount: cur.revenue_amount,
      isProfit: cur.isProfit,
      isMemo: cur.isMemo,
      staff_id: cur.staff_id,
    });
    return acc;
  }, {});
