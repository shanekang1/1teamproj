import React from "react";
import moment from "moment";
import { StyledDot, AmountBadge } from "./CalendarStyle";
import { fmt, signColor } from "./CalendarUtils";

export const CalendarTile = ({ date, view, getDailySum }) => {
  // 월 단위 뷰일 때만 표시
  if (view !== "month") return null;

  // 해당 날짜의 합계 계산
  const key = moment(date).format("YYYY-MM-DD");
  const sum = getDailySum(key);
  if (!sum) return null;

  // 양수/음수에 따라 색상 다르게 표시
  const color = signColor(sum);

  return (
    <>
      <StyledDot $color={color} />
      <AmountBadge $color={color}>
        {sum > 0 ? "+" : ""}
        {fmt(sum)}
      </AmountBadge>
    </>
  );
};
