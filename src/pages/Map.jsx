import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LiveMap from "../components/Livemap";

const Map = () => {
  // 1. تعريف الـ State اللي هتشيل الحادثة المختارة
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <div className="h-screen w-full flex flex-col text-white overflow-hidden bg-transparent">
      {/* 1. الناف بار العلوي */}
      <Navbar />

      {/* شيلنا الـ padding من الشمال (px-0 أو pl-0) عشان السايد بار يجي على الحرف بالظبط بمحاذاة الناف بار */}
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        {/* 2. السايد بار: الآن سيبدأ من أقصى اليسار بمحاذاة الناف بار */}
        <div className="hidden md:block h-full pl-4">
          {" "}
          {/* pl-4 هنا عشان يدي مسافة بسيطة من حرف الشاشة لو الناف بار فيه مسافة */}
          <div className="h-full bg-black/20 backdrop-blur-xs border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl ml-5">
            <Sidebar />
          </div>
        </div>

        {/* 2. نمرر الـ State والـ Function للـ Content */}
        <main className="flex-1 overflow-hidden mr-5">
          <LiveMap
            activeIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </main>
      </div>
    </div>
  );
};

export default Map;
