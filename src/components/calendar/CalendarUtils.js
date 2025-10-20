// 숫자를 천 단위 콤마로 변환
export const fmt = (n) => new Intl.NumberFormat("ko-KR").format(n);

// 금액 부호에 따라 색상 결정
export const signColor = (n) =>
  n > 0 ? "#16a34a" : n < 0 ? "#ef4444" : "#6b7280";
