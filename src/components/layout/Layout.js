import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideDrawer from "./SideDrawer";

export default function Layout({ onMenuOpen, menuOpen, onClose }) {
  return (
    <div>
      <TopBar onMenuOpen={onMenuOpen} />
      <SideDrawer open={menuOpen} onClose={onClose} />
      <main style={{ paddingTop: "60px" }}>
        <Outlet /> {/* 여기에 각 페이지 렌더링 */}
      </main>
    </div>
  );
}