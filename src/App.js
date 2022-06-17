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
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Password from "./pages/Password";
import Test from "./pages/Test";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const loggedIn = useMemo(
    () => JSON.parse(localStorage.getItem("auth"))?.loggedIn);

  useEffect(() => {
    let temp = localStorage.getItem("auth");
    if (temp != null) {
      setAuth(JSON.parse(temp));
    }
  }, []);
  console.log(auth);

  return (
    <Router className="App">
      {!loggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="learn/:setId" element={<Test />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<Learn />} />
            <Route path="learn" element={<Learn />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="settings" element={<Settings />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="password" element={<Password />} />
              <Route path="*" element={<Navigate to="profile" />} />
            </Route>
            <Route path="*" element={<Navigate to="learn" />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}

export default App;
