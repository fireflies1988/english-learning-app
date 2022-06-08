import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Settings.css";

function Settings() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ margin: "1.5rem" }}>
      <div className="settings-container">
        <div className="vertical-tabs">
          <Link
            to="profile"
            className={`tab${tab === 0 ? " active" : ""}`}
            onClick={() => setTab(0)}
          >
            Hồ sơ
          </Link>
          <Link
            to="password"
            className={`tab${tab === 1 ? " active" : ""}`}
            onClick={() => setTab(1)}
          >
            Mật khẩu
          </Link>
          <Link
            to=""
            className={`tab${tab === 2 ? " active" : ""}`}
            onClick={() => setTab(2)}
          >
            Xóa tài khoản
          </Link>
        </div>
        <div class="tab-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Settings;
