import React, { useState } from "react";
import styled from "styled-components";
import OwnCalendar from "../components/calendar/OwnCalendar";
import TopBar from "../components/layout/TopBar";
import SideDrawer from "../components/layout/SideDrawer";

const Main = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MainBody>
        <OwnCalendar />
      </MainBody>
    </>
  );
};

export default Main;

const MainBody = styled.div`
  padding: 8px 16px;
`;
