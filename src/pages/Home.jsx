import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Statscard from "../components/Statscard";
import Mapsection from "../components/Mapsection";
import Table from "../components/Table";
import api from "../api/axios";

const Home = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  // استخدمنا useCallback عشان الدالة متتكررش في الريندر وتسبب مشاكل مع الـ useEffect
  const fetchIncidents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/api/v1/incidents/active", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Response Data:", response.data);

      // التعامل مع نظام Laravel Resources (data.data) أو المصفوفة العادية
      const incomingData = response.data.data || response.data;

      setIncidents(Array.isArray(incomingData) ? incomingData : []);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // نداء الدالة أول ما الصفحة تفتح
    fetchIncidents();

    // تحديث تلقائي كل 10 ثواني لضمان متابعة الحوادث لحظة بلحظة
    const interval = setInterval(() => {
      fetchIncidents();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchIncidents]);

  return (
    <div className="h-screen w-full flex flex-col text-slate-800 dark:text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        {/* Side Navigation */}
        <div className="hidden md:block h-full pl-4">
          <div className="h-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl ml-5">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scroll pr-1">
          {loading && incidents.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">
                  Connecting to Emergency Grid...
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-[1500px] mx-auto space-y-4 pb-10">
              {/* 1. Statistics Overview */}
              <div className="transform scale-[0.99] origin-top">
                <Statscard incidents={incidents} />
              </div>

              {/* 2. Tactical Map View */}
              <div className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
                <Mapsection
                  incidents={incidents}
                  activeIncident={selectedIncident}
                />
              </div>

              {/* 3. Detailed Incidents Table */}
              <div className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
                <Table
                  incidents={incidents}
                  onSelectIncident={setSelectedIncident}
                  activeId={selectedIncident?.id}
                  onRefresh={fetchIncidents}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
