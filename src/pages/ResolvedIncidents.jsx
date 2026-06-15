import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EmergencyTable from "../components/EmergencyTable";
import api from "../api/axios";
import {
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  FireIcon,
  TruckIcon,
  LifebuoyIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

const ResolvedIncidents = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات من السيرفر (الحالات المنتهية)
  const fetchResolvedIncidents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/incidents/");
      const resData = response.data.data || response.data;

      if (Array.isArray(resData)) {
        // الفلترة: بنعرض فقط الحالات المغلقة (Resolved)
        const resolvedOnly = resData.filter(
          (inc) => inc.status?.toLowerCase() === "resolved"
        );
        setIncidents(resolvedOnly);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolvedIncidents();
  }, []);

  const stats = useMemo(() => {
    return {
      resolved: incidents.length
    };
  }, [incidents]);

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
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        <div className="hidden md:block h-full pl-4">
          <div className="h-full bg-black/20 backdrop-blur-xs border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl ml-5">
            <Sidebar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto custom-scroll px-6 pb-10">
          <div className="flex justify-between items-center mb-6 pt-4">
            <div className="bg-white/[0.02] border border-white/10 pl-6 pr-12 py-3 rounded-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h1 className="text-[28px] font-black tracking-tighter uppercase leading-none text-white/90">
                Resolved Incidents
              </h1>
            </div>
            <div className="flex gap-4">
              <StatCard
                label="Total Resolved"
                value={stats.resolved}
                color="text-green-400"
              />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-[1.8rem] mb-6 flex items-center gap-4">
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 gap-1">
              {["All", "Accident", "Fire", "Medical"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase ${filter === opt ? "bg-red-600 text-white" : "text-gray-500"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Incident ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 text-xs outline-none"
              />
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-gray-500">
                Loading resolved reports...
              </div>
            ) : (
              <EmergencyTable
                data={incidents}
                activeFilter={filter}
                searchTerm={searchTerm}
                onViewDetails={(inc) => {
                  setSelectedIncident(inc);
                  setShowModal(true);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {showModal && selectedIncident && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-[#0a0a0a]/90 border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl">
            <div
              className={`absolute top-0 left-0 w-full h-1 ${getCategoryTheme(selectedIncident.type).accent}`}
            ></div>
            <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
              <div
                className={`p-6 rounded-[2rem] ${getCategoryTheme(selectedIncident.type).bg} ${getCategoryTheme(selectedIncident.type).color}`}
              >
                {getCategoryTheme(selectedIncident.type).icon}
              </div>
              <div>
                <span
                  className={`${getCategoryTheme(selectedIncident.type).color} font-mono text-[10px] font-black tracking-[0.4em] mb-1 block uppercase`}
                >
                  {selectedIncident.id}
                </span>
                <h2 className="text-4xl font-black text-white uppercase italic">
                  Resolved Incident
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <DetailBox
                icon={<ShieldCheckIcon />}
                label="Current Status"
                value={selectedIncident.status}
                isStatus
                statusType={selectedIncident.status}
              />
              <DetailBox
                icon={<ClockIcon className="text-green-500" />}
                label="Detection Time"
                value={selectedIncident.created_at || selectedIncident.time}
              />
              <DetailBox
                icon={<MapPinIcon />}
                label="Coordinates"
                value={`${selectedIncident.latitude}, ${selectedIncident.longitude}`}
              />
              <DetailBox
                icon={<IdentificationIcon />}
                label="System Source"
                value={
                  (selectedIncident.source && selectedIncident.source.toLowerCase().includes('citizen')) || !selectedIncident.ai_confidence
                    ? "Mobile App (Citizen)"
                    : "AI Visual Sensor"
                }
              />
            </div>

            {selectedIncident.description && (
              <div className="mb-10 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-3 text-gray-500">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="text-[9px] uppercase font-black tracking-widest">
                    Citizen Description
                  </span>
                </div>
                <p className="text-sm font-bold text-white/90 leading-relaxed italic">
                  "{selectedIncident.description}"
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-white/5 rounded-xl font-black text-[9px] text-gray-400 uppercase"
              >
                Close
              </button>
              <div className="flex-[2] py-4 rounded-xl text-center border border-gray-500/20 bg-gray-500/10">
                <span className="font-black text-[10px] uppercase text-gray-400 tracking-widest">
                  ✅ Archived
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-black/40 border border-white/10 px-8 py-3 rounded-2xl text-center min-w-[110px]">
    <span className={`block text-2xl font-black ${color}`}>{value}</span>
    <span className="text-[9px] uppercase font-black text-gray-500 italic">
      {label}
    </span>
  </div>
);

const DetailBox = ({ icon, label, value, isStatus, statusType }) => (
  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
    <div className="flex items-center gap-2 mb-2 text-gray-600">
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      <span className="text-[8px] uppercase font-black tracking-widest">
        {label}
      </span>
    </div>
    <p
      className={`text-lg font-black ${isStatus ? (statusType === "verified" ? "text-yellow-500" : "text-green-400") : "text-white/90"}`}
    >
      {value}
    </p>
  </div>
);

export default ResolvedIncidents;
