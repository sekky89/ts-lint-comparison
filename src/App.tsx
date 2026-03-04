import { Link, Route, Routes } from 'react-router';

import About from './pages/About';
import Home from './pages/Home';
import './App.css';

const App = () => (
  <>
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </>
);

export default App;
