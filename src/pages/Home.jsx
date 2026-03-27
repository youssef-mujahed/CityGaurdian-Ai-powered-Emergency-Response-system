import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Statscard from "../components/Statscard";
import Mapsection from "../components/Mapsection";
import Table from "../components/Table";

const Home = () => {
  // الحالة اللي بتشيل بيانات الحادثة المختارة بالكامل
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <div className="min-h-screen w-full flex flex-col text-white overflow-hidden selection:bg-red-500/30">
      {/* 1. الناف بار العلوي */}
      <Navbar />

      <div className="flex flex-1 mt-1 relative">
        {/* 2. السايد بار الجانبي */}
        <div className="pl-21 h-full">
          <Sidebar />
        </div>

        {/* 3. المحتوى الأساسي للـ Dashboard */}
        <main className="flex-1 mr-20 ml-2 overflow-y-auto pb-10 scrollbar-none">
          {/* كروت الإحصائيات العلوية */}
          <Statscard />
          
          {/* قسم الخريطة: بياخد الحادثة المختارة عشان يظهر الكارت الجانبي */}
          <Mapsection activeIncident={selectedIncident} />

          {/* قسم الجدول: بيبعت الحادثة للـ Home لما المستخدم يضغط على صف */}
          <Table 
            onSelectIncident={setSelectedIncident} 
            activeId={selectedIncident?.id} 
          />
        </main>
      </div>
    </div>
  );
};

export default Home;