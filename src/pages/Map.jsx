import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LiveMap from "../components/LiveMap";
import api from "../api/axios"; // تأكد من استيراد الأكسيوس

const Map = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // جلب الحوادث الحقيقية
  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/incidents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data || response.data;
      setIncidents(data);

      // إذا لم يكن هناك حادثة مختارة، اختر الأولى
      if (data.length > 0 && !selectedIncident) {
        setSelectedIncident(data[0]);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000); // تحديث تلقائي كل 10 ثواني
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col text-gray-900 dark:text-white overflow-hidden bg-transparent">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        <div className="hidden md:block h-full pl-4">
          <div className="h-full bg-white/80 dark:bg-black/20 backdrop-blur-xs border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden ml-5 shadow-xl dark:shadow-none">
            <Sidebar />
          </div>
        </div>

        <main className="flex-1 overflow-hidden mr-5 h-[95%]">
          <LiveMap
            incidents={incidents}
            activeIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </main>
      </div>
    </div>
  );
};

export default Map;
