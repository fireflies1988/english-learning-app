import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import AccountMenu from "./AccountMenu";
import learnIcon from "../icons/book_32.png";
import focusLearnIcon from "../icons/book_color_32.png";
import dictIcon from "../icons/dict_32.png";
import focusDictIcon2 from "../icons/dict_color_32.png";

const myBlue = "#1cb0f6";
const myGray = "#afafaf";

function Navbar() {
  const location = useLocation();
  const [page, setPage] = useState("learn");

  useEffect(() => {
    if (location.pathname.substring(1) === "") {
      setPage("learn");
    } else {
      setPage(location.pathname.substring(1));
    }
  }, [location]);

  return (
    <>
      <nav>
        <span className="nav-logo">Fakelingo</span>

        <div className="nav-link">
          <Link to="/learn" onClick={() => setPage("learn")}>
            <img src={page === "learn" ? focusLearnIcon : learnIcon} alt="" />
            &nbsp;&nbsp;
            <span style={{ color: page === "learn" ? myBlue : myGray }}>
              Học
            </span>
          </Link>

          <Link to="/dictionary" onClick={() => setPage("dictionary")}>
            <img
              src={page === "dictionary" ? focusDictIcon2 : dictIcon}
              alt=""
            />
            &nbsp;&nbsp;
            <span style={{ color: page === "dictionary" ? myBlue : myGray }}>
              Từ điển
            </span>
          </Link>
        </div>

        <div className="nav-account">
          <AccountMenu />
        </div>
      </nav>

      {/* render the current route selected here */}
      <Outlet />

      <footer class="bottom-nav">
        <Link to="/learn" onClick={() => setPage("learn")}>
          <img src={page === "learn" ? focusLearnIcon : learnIcon} alt="" />
          &nbsp;&nbsp;
          <span style={{ color: page === "learn" ? myBlue : myGray }}>Học</span>
        </Link>

        <Link to="/dictionary" onClick={() => setPage("dictionary")}>
          <img src={page === "dictionary" ? focusDictIcon2 : dictIcon} alt="" />
          &nbsp;&nbsp;
          <span style={{ color: page === "dictionary" ? myBlue : myGray }}>
            Từ điển
          </span>
        </Link>
      </footer>
    </>
  );
}

export default Navbar;
