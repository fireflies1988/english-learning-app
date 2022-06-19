import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import "../styles/Settings.css";

function Settings() {
  const [tab, setTab] = useState("profile");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    let lastSegment = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    if (lastSegment === "" || lastSegment === "settings") {
      setTab("profile");
    } else {
      setTab(lastSegment);
    }
  }, []);

  return (
    <div style={{ margin: "1.5rem" }}>
      <div className="settings-container">
        <div className="vertical-tabs">
          <Link
            to="profile"
            className={`tab${tab === "profile" ? " active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Hồ sơ
          </Link>
          <Link
            to="password"
            className={`tab${tab === "password" ? " active" : ""}`}
            onClick={() => setTab("password")}
          >
            Mật khẩu
          </Link>
          {auth.isAdmin === true && (
            <Link
              to="admin/questions"
              className={`tab${tab === "questions" ? " active" : ""}`}
              onClick={() => setTab("questions")}
            >
              Quản trị đề thi
            </Link>
          )}
          <Link
            to=""
            className={`tab${tab === "deleteAccount" ? " active" : ""}`}
            onClick={() => setTab("deleteAccount")}
          >
            Xóa tài khoản
          </Link>
        </div>
        <div className="tab-content" style={{ marginBottom: "70px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Settings;
