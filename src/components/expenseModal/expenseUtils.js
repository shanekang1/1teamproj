// 금액 포맷: 천 단위 콤마
export const fmt = (n) => new Intl.NumberFormat("ko-KR").format(n);

// 금액 부호 표시 (+ / -)
export const signPrefix = (n) => (n > 0 ? "+" : "");

// 일일 합계 계산
export const calcDailyTotal = (sets) => {
  const sumCat = (arr, sign) =>
    (arr || []).reduce((acc, cur) => acc + Number(cur.amount || 0) * sign, 0);
  return (
    sumCat(sets.revenue, 1) + sumCat(sets.expense, -1) + sumCat(sets.labor, -1)
  );
};
