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
import { useContext, useEffect } from "react";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  useEffect(() => {
    let temp = localStorage.getItem("auth");
    if (temp != null) {
      setAuth(JSON.parse(temp));
    }
  }, [])
  console.log(auth);

  return (
    <Router className="App">
      {!auth.loggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
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
