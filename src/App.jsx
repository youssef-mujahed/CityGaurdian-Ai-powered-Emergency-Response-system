import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Emergencies from "./pages/Emergencies";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import backgroundImage from "./assets/bg.png";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full selection:bg-red-500/30">
        {/* 1. طبقة الخلفية الثابتة - الـ Brightness والـ Opacity مظبوطين عشان الـ UI يبان */}
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-60 brightness-110"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: "fixed"
          }}
        >
          {/* Overlay لتغميق الخلفية قليلاً وتركيز العين على المحتوى */}
          <div className="absolute inset-0 bg-black/50 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>
        </div>

        {/* 2. محتوى الصفحات */}
        <div className="relative z-10">
          <Routes>
            {/* المسارات (Paths) لازم تكون بسيطة عشان اللينكات تشتغل */}
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/emergencies" element={<Emergencies />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
