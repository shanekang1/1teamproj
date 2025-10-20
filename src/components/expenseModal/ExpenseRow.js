import React from "react";

export const ExpenseRow = ({
  cat,
  row,
  handleInputChange,
  handleRemoveSet,
  handleStaffSelect,
  filteredStaffs,
  activeInputId,
  setActiveInputId,
  searchText,
  setSearchText,
}) => {
  const isLabor = cat === "labor";

  return (
    <div className="em-setRow">
      {/* 항목명 입력 */}
      <div className="em-inputWrap">
        <input
          type="text"
          placeholder="항목명"
          value={row.name}
          onFocus={() => {
            if (isLabor) {
              setActiveInputId(row.id);
              setSearchText(row.name);
            }
          }}
          onChange={(e) => {
            handleInputChange(cat, row.id, "name", e.target.value);
            if (isLabor) {
              setActiveInputId(row.id);
              setSearchText(e.target.value);
            }
          }}
        />

        {/* 직원 자동완성 드롭다운 */}
        {isLabor &&
          activeInputId === row.id &&
          filteredStaffs.length > 0 && (
            <ul className="em-dropdown">
              {filteredStaffs.map((s) => (
                <li
                  key={s.id}
                  onMouseDown={() => handleStaffSelect(cat, row.id, s)}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
      </div>

      {/* 금액 입력 */}
      <input
        type="number"
        placeholder={cat === "revenue" ? "금액 (수익)" : "금액 (지출)"}
        value={row.amount}
        onChange={(e) =>
          handleInputChange(cat, row.id, "amount", e.target.value)
        }
      />

      {/* 삭제 버튼 */}
      <button
        type="button"
        className="btn remove"
        onClick={() => handleRemoveSet(cat, row.id)}
      >
        삭제
      </button>
    </div>
  );
};