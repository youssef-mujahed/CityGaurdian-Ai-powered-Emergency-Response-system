import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EmergencyTable from "../components/EmergencyTable";
import {
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  FireIcon,
  TruckIcon,
  LifebuoyIcon
} from "@heroicons/react/24/outline";

const Emergencies = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // 🔥 الحل الجذري: سحب البيانات فوراً عند تعريف الـ State
  const [incidents, setIncidents] = useState(() => {
    try {
      const savedData = sessionStorage.getItem("verified_emergencies");
      return savedData ? JSON.parse(savedData) : [];
    } catch (err) {
      console.error("Error parsing session storage:", err);
      return [];
    }
  });

  // حساب الإحصائيات - سيعمل بشكل صحيح لأن incidents لها قيمة أولية
  const stats = useMemo(() => {
    return {
      active: incidents.filter((i) => i.status !== "Resolved").length,
      resolved: incidents.filter((i) => i.status === "Resolved").length
    };
  }, [incidents]);

  const handleDispatch = (id) => {
    setIsDispatching(true);
    // محاكاة عملية الإرسال (Dispatch)
    setTimeout(() => {
      const updatedIncidents = incidents.map((inc) =>
        inc.id === id ? { ...inc, status: "Responding" } : inc
      );

      setIncidents(updatedIncidents);
      // تحديث الـ Session Storage
      sessionStorage.setItem(
        "verified_emergencies",
        JSON.stringify(updatedIncidents)
      );

      // تحديث الـ selectedIncident عشان الـ Modal يحس بالتغيير فوراً
      setSelectedIncident((prev) => ({ ...prev, status: "Responding" }));

      setIsDispatching(false);
      // اختياري: لو عايز تقفل الـ Modal بعد الإرسال فك الكومنت اللي تحت
      // setShowModal(false);
    }, 1200);
  };

  const getCategoryTheme = (type) => {
    const iconClass = "w-10 h-10";
    const themes = {
      Fire: {
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        accent: "bg-orange-600",
        icon: <FireIcon className={iconClass} />
      },
      Accident: {
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        accent: "bg-red-600",
        icon: <TruckIcon className={iconClass} />
      },
      Medical: {
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        accent: "bg-blue-600",
        icon: <LifebuoyIcon className={iconClass} />
      }
    };
    return themes[type] || themes.Accident;
  };

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

        <main className="flex-1 overflow-y-auto custom-scroll px-6 pb-10">
          <div className="flex justify-between items-center mb-6 pt-4">
            <div className="bg-white/[0.02] border border-white/10 pl-6 pr-12 py-3 rounded-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                  Operations Live
                </span>
              </div>
              <h1 className="text-[28px] font-black tracking-tighter uppercase leading-none text-white/90">
                Emergency Incidents
              </h1>
            </div>
            <div className="flex gap-4">
              <StatCard
                label="Active Cases"
                value={stats.active}
                color="text-red-500"
              />
              <StatCard
                label="Resolved"
                value={stats.resolved}
                color="text-green-400"
              />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-[1.8rem] mb-6 flex items-center gap-4 shadow-xl">
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 gap-1">
              {["All", "Accident", "Fire", "Medical"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase ${filter === opt ? "bg-red-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Incident ID or Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs outline-none focus:border-red-500/30 transition-all font-medium text-white"
              />
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <EmergencyTable
              data={incidents}
              activeFilter={filter}
              searchTerm={searchTerm}
              onViewDetails={(inc) => {
                setSelectedIncident(inc);
                setShowModal(true);
              }}
            />
          </div>
        </main>
      </div>

      {/* Modal Section */}
      {showModal && selectedIncident && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-[#0a0a0a]/90 border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div
              className={`absolute top-0 left-0 w-full h-1 ${getCategoryTheme(selectedIncident.type).accent}`}
            ></div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-10 text-gray-500 hover:text-white text-3xl"
            >
              &times;
            </button>

            <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
              <div
                className={`p-6 rounded-[2rem] shadow-2xl ${getCategoryTheme(selectedIncident.type).bg} ${getCategoryTheme(selectedIncident.type).color}`}
              >
                {getCategoryTheme(selectedIncident.type).icon}
              </div>
              <div>
                <span
                  className={`${getCategoryTheme(selectedIncident.type).color} font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-1 block`}
                >
                  {selectedIncident.id}
                </span>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                  Log Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <DetailBox
                icon={<ShieldCheckIcon />}
                label="System Status"
                value={selectedIncident.status}
                isStatus
                statusType={selectedIncident.status}
              />
              <DetailBox
                icon={<ClockIcon className="text-green-500" />}
                label="Log Time"
                value={selectedIncident.time}
              />
              <DetailBox
                icon={<IdentificationIcon />}
                label="Source"
                value={selectedIncident.source}
              />
              <DetailBox
                icon={<MapPinIcon />}
                label="Location"
                value={selectedIncident.location}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[9px] text-gray-400 uppercase tracking-widest"
              >
                Close
              </button>
              {selectedIncident.status === "Pending" ? (
                <button
                  onClick={() => handleDispatch(selectedIncident.id)}
                  disabled={isDispatching}
                  className={`flex-[2] py-4 ${getCategoryTheme(selectedIncident.type).accent} rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg`}
                >
                  {isDispatching ? "Syncing Units..." : "Initiate Dispatch"}
                </button>
              ) : (
                <div
                  className={`flex-[2] py-4 rounded-xl text-center border flex items-center justify-center ${selectedIncident.status === "Resolved" ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/10"}`}
                >
                  <span
                    className={`font-black text-[9px] uppercase tracking-widest ${selectedIncident.status === "Resolved" ? "text-green-500" : "text-red-500 animate-pulse"}`}
                  >
                    {selectedIncident.status === "Resolved"
                      ? "✓ Incident Cleared"
                      : "🚨 Units In Route"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-black/40 border border-white/10 px-8 py-3 rounded-2xl text-center min-w-[110px] backdrop-blur-sm shadow-xl">
    <span className={`block text-2xl font-black ${color}`}>{value}</span>
    <span className="text-[9px] uppercase tracking-widest font-black text-gray-500 italic">
      {label}
    </span>
  </div>
);

const DetailBox = ({ icon, label, value, isStatus, statusType }) => (
  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
    <div className="flex items-center gap-2 mb-2 text-gray-600">
      {React.cloneElement(icon, {
        className: "w-3.5 h-3.5 group-hover:text-red-500 transition-all"
      })}
      <span className="text-[8px] uppercase font-black tracking-widest">
        {label}
      </span>
    </div>
    <p
      className={`text-lg font-black tracking-tight ${isStatus ? (statusType === "Pending" ? "text-yellow-500" : statusType === "Responding" ? "text-red-600 animate-pulse" : "text-green-400") : "text-white/90"}`}
    >
      {value}
    </p>
  </div>
);

export default Emergencies;
