import React, { useState, useEffect, useRef } from "react";
import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleBizDropdown,
  closeBizDropdown,
} from "../../store/slices/uiSlice";
import { switchBusiness, fetchMyBusinesses } from "../../store/slices/businessSlice";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const TopBar = ({ onMenuOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const { list, currentId } = useSelector((s) => s.business);
  const { isBizDropdownOpen } = useSelector((s) => s.ui);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const currentName =
    list.find((b) => b.id === currentId)?.name ||
    (user ? "사업장 선택" : "로그인이 필요합니다");

  // 최초 렌더 시 사업장 목록 로드
  useEffect(() => {
    if (user?.id) dispatch(fetchMyBusinesses(user.id));
  }, [user, dispatch]);

  // 브라우저 포커스 시 재로드 (디바운스 300ms)
  useEffect(() => {
    let timer;
    const onFocus = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (user?.id) dispatch(fetchMyBusinesses(user.id));
      }, 300);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user, dispatch]);

  // Esc 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        dispatch(closeBizDropdown());
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="left">
        <button className="hamburger" onClick={onMenuOpen} aria-label="메뉴 열기">
          <span />
          <span />
          <span />
        </button>

        {user && (
          <div className="biz-selector">
            <button
              className="chev"
              onClick={() => dispatch(toggleBizDropdown())}
              aria-expanded={isBizDropdownOpen}
            >
              {currentName}
            </button>

            {isBizDropdownOpen && (
              <div
                className="dropdown biz-dropdown"
                onMouseLeave={() => dispatch(closeBizDropdown())}
              >
                {list.length === 0 && (
                  <div className="empty">
                    등록된 사업장이 없습니다.
                    <div
                      className="link"
                      onClick={() => {
                        dispatch(closeBizDropdown());
                        navigate("/business");
                      }}
                    >
                      + 사업장 등록하기
                    </div>
                  </div>
                )}

                {list.map((b) => (
                  <div
                    key={b.id}
                    className={`item ${b.id === currentId ? "active" : ""}`}
                    onClick={() => {
                      dispatch(switchBusiness(b.id));
                      dispatch(closeBizDropdown());
                    }}
                  >
                    {b.name}
                  </div>
                ))}

                {list.length > 0 && (
                  <>
                    <div className="sep" />
                    <div
                      className="item"
                      onClick={() => {
                        dispatch(closeBizDropdown());
                        navigate("/business");
                      }}
                    >
                      + 새 사업장 등록
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="right" ref={profileRef}>
        {!user ? (
          <button className="btn" onClick={() => navigate("/landing")}>
            로그인
          </button>
        ) : (
          <>
            <button
              className="btn"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              마이페이지
            </button>

            {profileMenuOpen && (
              <ul className="profile-dropdown">
                <li>
                  <a onClick={() => navigate("/profile/edit")}>개인정보 수정</a>
                </li>
                <li>
                  <a onClick={() => navigate("/business/edit")}>업체 수정</a>
                </li>
                <li>
                  <a onClick={() => navigate("/business/switch")}>업체 전환</a>
                </li>
                <li>
                  <a
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate("/landing", { replace: true });
                    }}
                  >
                    로그아웃
                  </a>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
