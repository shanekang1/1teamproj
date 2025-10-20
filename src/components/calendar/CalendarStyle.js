import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css";

/*******
캘린더 스타일 지정해주는 문서입니다.
 *******/

export const StyledCalendarWrapper = styled.div`
  /* 반응형 폭: 최소 340px ~ 최대 960px */
  width: clamp(340px, 60vw, 960px);
  /* 높이는 컨텐츠에 맡기고, 타일 min-height로 간격 확보 */
  height: auto;

  /* 레이아웃 변수 (반응형) */
  --tile-min-h: clamp(68px, 9vh, 112px);
  --tile-pad: clamp(10px, 1.2vw, 18px);
  --radius: 12px;
  --today-size: clamp(24px, 3.2vw, 34px);
  --dot-size: clamp(7px, 0.8vw, 10px);
  --date-fs: clamp(14px, 1.2vw, 18px);
  --weekday-fs: clamp(11px, 1vw, 13px);
  --badge-fs: clamp(10px, 1vw, 12px);
  --shell-pad: clamp(12px, 2vw, 24px);

  display: flex;
  justify-content: center;
  position: relative;
  margin: 50px auto 0;

  .react-calendar {
    /* 래퍼에 맞춰 100% */
    width: 100%;
    border: 1px solid #c4c4c4;
    border-radius: var(--radius);
    padding: var(--shell-pad);
    background-color: white;
  }

  /* 타일(날짜칸) 공통 */
  .react-calendar__tile {
    pointer-events: auto;
    position: relative;
    background-color: transparent !important;
    padding: var(--tile-pad);
    min-height: var(--tile-min-h); /* 간격 핵심 */
  }

  /* 호버 단색 제거 */
  .react-calendar__tile:hover {
    background-color: inherit;
    cursor: default;
  }

  /* 네비게이션 */
  .react-calendar__navigation {
    border-bottom: 1px solid #dfdfdf;
    margin-bottom: 8px;
  }

  .react-calendar__navigation__label__labelText {
    color: #3f3f3f;
  }

  .react-calendar__navigation__arrow {
    background-color: transparent;
    color: #7c97fe;
  }

  .react-calendar__navigation button {
    font-weight: 600;
    font-size: 1rem;
  }

  .react-calendar__navigation button:hover {
    background-color: transparent;
    color: #7c97fe;
  }

  .react-calendar__navigation__label__labelText:hover {
    color: #3f3f3f;
  }

  .react-calendar__navigation__label {
    pointer-events: none;
  }

  .react-calendar__navigation button:active {
    background-color: transparent;
  }

  .react-calendar__navigation button:focus {
    background-color: transparent;
    outline: none;
  }

  /* 년/월 라벨 폭 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 요일 헤더 */
  .react-calendar__month-view__weekdays {
    margin-bottom: 4px;
  }

  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 700;
    font-size: var(--weekday-fs);
  }

  /* 요일 색 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: #ff0000;
  }
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="토요일"] {
    color: #2e7af2;
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    color: #424242;
  }
  .react-calendar__month-view__days__day--weekend:nth-child(7n) abbr {
    color: #2e7af2;
  }
  .react-calendar__month-view__days__day:nth-child abbr {
    color: #424242;
  }

  /* 이웃 달 날짜: 전체 타일을 약간 흐리게 */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.5;
  }
  .react-calendar__month-view__days__day--neighboringMonth abbr {
    color: #bdbdbd !important;
  }

  .react-calendar__tile--active {
    background: none;
    color: #424242;
  }

  /* 오늘 날짜 원형 */
  .react-calendar__tile--now {
    background: none;
    position: relative;
    z-index: 1;
    abbr {
      color: white;
      position: relative;
      z-index: 2;
      font-weight: 700;
    }
  }
  .react-calendar__tile--now::after {
    content: "";
    position: absolute;
    top: 28px;
    left: 50%;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: #69696963;
    transform: translateX(-50%);
  }

  /* 네비게이션 월 스타일 */
  .react-calendar__year-view__months__month {
    border-radius: 0.8rem;
    background-color: white;
    padding: 0;
  }

  /* 날짜 숫자 크기 */
  .react-calendar__tile abbr {
    font-size: var(--date-fs);
    font-weight: 600;
  }

  /* 모바일 최적화 */
  @media (max-width: 480px) {
    --tile-min-h: 60px;
    --tile-pad: 10px;
    --today-size: 26px;
  }
`;

export const StyledCalendar = styled(Calendar)``;

/* 오늘 버튼 */
export const StyledDate = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  background-color: #7c97fe;
  color: white;
  width: 90px;
  text-align: center;
  line-height: 1.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 1;
`;

/* 날짜의 수익/손해 점 */
export const StyledDot = styled.div`
  background-color: ${(props) => props.$color || "#ff4949"};
  border-radius: 50%;
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
`;

/* 날짜칸 하단 합계 배지 */
export const AmountBadge = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--badge-fs);
  line-height: 1;
  font-weight: 700;
  color: ${(props) => props.$color || "#424242"};
  pointer-events: none;
`;

/* 달력 위 필터 바 */
export const FilterBar = styled.div`
  position: absolute;
  top: -46px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #424242;
  flex-wrap: wrap;

  input,
  select {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 12px;
    background: #fff;
  }

  label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

/* 우측 하단 총계 플로팅 */
export const TotalFloat = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-weight: 800;
  font-size: 14px;
  color: ${(props) => props.$color || "#424242"};
  z-index: 1000;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;
