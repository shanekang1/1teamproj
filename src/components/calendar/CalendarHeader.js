import React from "react";
import moment from "moment";
import { FilterBar } from "./CalendarStyle";

export const CalendarHeader = ({
  filterMode,
  setFilterMode,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  activeStartDate,
}) => {
  // 현재 달의 시작과 끝 날짜 계산
  const start = moment(activeStartDate).startOf("month").format("YYYY.MM.DD");
  const end = moment(activeStartDate).endOf("month").format("YYYY.MM.DD");

  return (
    <FilterBar>
      {/* 월간 보기 선택 */}
      <label>
        <input
          type="radio"
          name="mode"
          value="month"
          checked={filterMode === "month"}
          onChange={() => setFilterMode("month")}
        />
        해당 월만 보기 ({start} ~ {end})
      </label>

      {/* 기간 선택 보기 */}
      <label>
        <input
          type="radio"
          name="mode"
          value="range"
          checked={filterMode === "range"}
          onChange={() => setFilterMode("range")}
        />
        기간 선택
      </label>

      {/* 기간 입력 필드 */}
      {filterMode === "range" && (
        <>
          <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
          <span>~</span>
          <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
        </>
      )}
    </FilterBar>
  );
};
