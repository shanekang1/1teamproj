import React from "react";
import "./Modal.css";

/**
 * props
 * - isOpen: boolean
 * - onClose: () => void
 * - title?: string | ReactNode
 * - children: ReactNode
 * - hideDefaultFooter?: boolean  // 기본 닫기 버튼 영역 숨김
 */
const Modal = ({ isOpen, onClose, title, children, hideDefaultFooter = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
