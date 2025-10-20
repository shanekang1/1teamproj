import React from "react";
import "./SideDrawer.css"; // 스타일 분리
import { useNavigate } from "react-router-dom";

const SideDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      <aside
        className={`side-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-head">
          <strong>메뉴</strong>
          <button className="close-btn" aria-label="메뉴 닫기" onClick={onClose}>
            ×
          </button>
        </div>

        <ul className="nav-list">
          <li>
            <a onClick={() => go("/calendar")}>캘린더</a>
          </li>
          <li>
            <a onClick={() => go("/analysis")}>분석</a>
          </li>
          <li>
            <a onClick={() => go("/staff")}>직원 관리</a>
          </li>

        </ul>
      </aside>

      {open && <div className="backdrop" onClick={onClose} />}
    </>
  );
};

export default SideDrawer;
