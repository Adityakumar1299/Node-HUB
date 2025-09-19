// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Notepad from "./components/Notepad";
import { auth } from "./firebase/firebaseConfig"; // optional, if you use auth

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Dynamic Notepad page for each username */}
        <Route path="/:username" element={<Notepad />} />
      </Routes>
    </Router>
  );
}
