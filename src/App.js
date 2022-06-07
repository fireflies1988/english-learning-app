import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Learn from "./pages/Learn";
import Dictionary from "./pages/Dictionary";
import Login from "./pages/Login";
import AuthContext from "./context/AuthProvider";
import { useContext, useEffect, useMemo } from "react";
import Register from "./pages/Register";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const loggedIn =  useMemo(() => JSON.parse(localStorage.getItem("auth"))?.loggedIn);

  useEffect(() => {
    let temp = localStorage.getItem("auth");
    if (temp != null) {
      setAuth(JSON.parse(temp));
    }
  }, [])
  console.log(auth);

  return (
    <Router className="App">
      {!loggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />}/>
        </Routes>
      ) : (
        <>
          <Navbar />

          <Routes>
            <Route path="/learn" element={<Learn />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="*" element={<Navigate to="/learn" />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
