import React from "react";
import moment from "moment";
import "./ExpenseModal.css";
import { useExpenseModal } from "./useExpenseModal";
import { ExpenseSection } from "./ExpenseSection";
import { fmt, signPrefix } from "./expenseUtils";

const ExpenseModal = ({
  expenseSets,
  setExpenseSets,
  onSave,
  onClose,
  selectedDate,
  businessId,
}) => {
  // 훅에서 상태 및 로직 가져오기
  const {
    safeSets,
    handleAddSet,
    handleMemoChange,
    dailyTotal,
    ...sectionProps
  } = useExpenseModal({ expenseSets, setExpenseSets, businessId });

  return (
    <div className="em-wrap">
      {/* 상단 버튼 */}
      <div className="em-topBar">
        <div className="btns">
          <button className="btn ghost" onClick={onClose}>닫기</button>
          <button className="btn primary" onClick={onSave}>등록</button>
        </div>
      </div>

      {/* 날짜 헤더 */}
      <h3 className="em-dateHeading">
        {selectedDate
          ? moment(selectedDate).format("YYYY년 MM월 DD일")
          : "날짜 미선택"}
      </h3>

      {/* 수익/지출/인건비 섹션 */}
      <div className="em-sectionGroup">
        {["revenue", "expense", "labor"].map((cat) => (
          <ExpenseSection
            key={cat}
            cat={cat}
            safeSets={safeSets}
            handleAddSet={handleAddSet}
            {...sectionProps}
          />
        ))}
      </div>

      {/* 일일 합계 */}
      <div
        className="em-totalBar"
        style={{
          "--total-color":
            dailyTotal > 0 ? "#166534" : dailyTotal < 0 ? "#991b1b" : "#374151",
        }}
      >
        <span>일일 매출 합계</span>
        <strong>
          {signPrefix(dailyTotal)}
          {fmt(dailyTotal)}원
        </strong>
      </div>

      {/* 메모 입력 */}
      <div className="em-memoBox">
        <label htmlFor="memo">메모</label>
        <textarea
          id="memo"
          placeholder="메모를 입력하세요"
          value={safeSets.memo}
          onChange={handleMemoChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default ExpenseModal;
