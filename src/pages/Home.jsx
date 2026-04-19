import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Statscard from "../components/Statscard";
import Mapsection from "../components/Mapsection";
import Table from "../components/Table";

const Home = () => {
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

        {/* 3. المحتوى الأساسي: ملموم وقريب من السايد بار */}
        <main className="flex-1 overflow-y-auto custom-scroll pr-1">
          <div className="max-w-[1500px] mx-auto space-y-4">
            <div className="transform scale-[0.99] origin-top">
              <Statscard />
            </div>

            <div className="w-full bg-black/30 backdrop-blur-xs rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <Mapsection activeIncident={selectedIncident} />
            </div>

            <div className="w-full bg-black/30 backdrop-blur-xs rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <Table
                onSelectIncident={setSelectedIncident}
                activeId={selectedIncident?.id}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
