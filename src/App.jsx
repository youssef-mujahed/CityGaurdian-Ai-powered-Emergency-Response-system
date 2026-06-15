import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // استيراد صفحة الساين إن
import Home from "./pages/Home";
import Map from "./pages/Map";
import Emergencies from "./pages/Emergencies";
import Logs from "./pages/Logs";
import VerifiedIncidents from "./pages/VerifiedIncidents";
import ResolvedIncidents from "./pages/ResolvedIncidents";
import Settings from "./pages/Settings";
import backgroundImage from "./assets/bg.png";
import lightBackgroundImage from "./assets/light_mode_background.png";
import { useTheme } from "./context/ThemeContext";
import "./App.css";
function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`relative min-h-screen w-full selection:bg-red-500/30 ${theme === 'dark' ? 'dark text-white' : 'text-gray-900 bg-white/20'}`}>
        {/* الخلفية الثابتة */}
        <div
          className={`fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-700 ${
            theme === 'dark' ? 'opacity-60 brightness-180' : 'opacity-100 brightness-100'
          }`}
          style={{
            backgroundImage: `url(${theme === 'dark' ? backgroundImage : lightBackgroundImage})`,
            backgroundAttachment: "fixed"
          }}
        >
          {theme === 'dark' && (
            <div className="absolute inset-0 bg-black/50 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>
          )}
        </div>

        {/* محتوى الصفحات */}
        <div className="relative z-10">
          <Routes>
            {/* 1. صفحة الساين إن هي اللي بتفتح الأول */}
            <Route path="/" element={<AuthPage />} />

            {/* 2. باقي صفحات السيستم */}
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/emergencies" element={<Emergencies />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/verified" element={<VerifiedIncidents />} />
            <Route path="/resolved" element={<ResolvedIncidents />} />
            <Route path="/settings" element={<Settings />} />

            {/* أي لينك غلط يرجعه للساين إن */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
