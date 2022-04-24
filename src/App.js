import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Learn from './pages/Learn';
import Dictionary from './pages/Dictionary';

function App() {
  return (
    <Router className="App">
      <Navbar />
        
      <Routes>
        <Route path='/learn' element={<Learn />} />
        <Route path='/dictionary' element={<Dictionary />} />
      </Routes>
    </Router>
  );
}

export default App;
