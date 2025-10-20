import React from "react";
import moment from "moment";
import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledDate,
  TotalFloat,
} from "./CalendarStyle";
import Modal from "../Modal";
import ExpenseModal from "../expenseModal/ExpenseModal";
import { useCalendarData } from "./useCalendarData";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarTile } from "./CalendarTile";
import { fmt, signColor } from "./CalendarUtils";

const OwnCalendar = () => {
  // 커스텀 훅에서 모든 상태와 핸들러를 가져옴
  const {
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
    businessId,
    getDailySum,
  } = useCalendarData();

  return (
    <StyledCalendarWrapper>
      {/* 상단 기간 필터 영역 */}
      <CalendarHeader
        {...{
          filterMode,
          setFilterMode,
          rangeStart,
          rangeEnd,
          setRangeStart,
          setRangeEnd,
          activeStartDate,
        }}
      />

      {/* 캘린더 UI */}
      <StyledCalendar
        value={date}
        onClickDay={handleDayClick} // 날짜 클릭 시 데이터 불러오기
        formatDay={(_, d) => moment(d).format("D")}
        formatMonthYear={(_, d) => moment(d).format("YYYY. MM")}
        formatShortWeekday={(_, d) => moment(d).format("ddd")}
        calendarType="gregory"
        showNeighboringMonth
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        tileContent={({ date, view }) => (
          <CalendarTile view={view} date={date} getDailySum={getDailySum} />
        )}
      />

      {/* 오늘 날짜로 이동 */}
      <StyledDate onClick={handleTodayClick}>Today</StyledDate>

      {/* 선택된 기간의 총합 표시 */}
      <TotalFloat $color={signColor(displayedTotal)}>
        총계 {displayedTotal > 0 ? "+" : ""}
        {fmt(displayedTotal)}원
      </TotalFloat>

      {/* 수익/지출 입력 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedDate
            ? moment(selectedDate).format("YYYY년 MM월 DD일")
            : "지출/수익 입력"
        }
      >
        <ExpenseModal
          {...{
            businessId,
            expenseSets,
            setExpenseSets,
            onSave: saveExpense,
            onClose: closeModal,
            selectedDate,
          }}
        />
      </Modal>
    </StyledCalendarWrapper>
  );
};

export default OwnCalendar;