import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import AccountMenu from "./AccountMenu";
import learnIcon from "../icons/book_32.png";
import focusLearnIcon from "../icons/book_color_32.png";
import dictIcon from "../icons/dict_32.png";
import focusDictIcon2 from "../icons/dict_color_32.png";

const myBlue = "#1cb0f6";
const myGray = "#afafaf";

function Navbar() {
  const [page, setPage] = useState("learn");

  useEffect(() => {
    setPage(window.location.pathname.substring(1));
  }, []);
  
  return (
    <nav>
      <span className="nav-logo">Fakelingo</span>

      <div className="nav-link">
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
      </div>

      <div className="nav-account">
        <AccountMenu />
      </div>
    </nav>
  );
}

export default Navbar;
