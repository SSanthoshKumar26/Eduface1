import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ContentGen from "./components/ContentGen.jsx";
import PPTGenerator from "./components/PPTGenerator.jsx";  // Import your PPT generation component

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ContentGen" element={<ContentGen />} />
          <Route path="/PPTGenerator" element={<PPTGenerator />} />  {/* Added PPT route */}
        </Routes>
      </div>
    </Router>
  );
}
