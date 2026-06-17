import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import Swal from "sweetalert2";
import {
  TruckIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

const mockFleet = [
  { id: "AMB-01", type: "Ambulance", status: "Idle", location: "Downtown Station", lastUpdated: "2 mins ago", lat: 30.0444, lng: 31.2357 },
  { id: "AMB-02", type: "Ambulance", status: "En Route", location: "Highway 4", lastUpdated: "Just now", lat: 30.0500, lng: 31.2400 },
  { id: "POL-01", type: "Police", status: "On Scene", location: "Main St. Intersection", lastUpdated: "5 mins ago", lat: 30.0480, lng: 31.2390 },
  { id: "POL-02", type: "Police", status: "Idle", location: "North Precinct", lastUpdated: "10 mins ago", lat: 30.0600, lng: 31.2500 },
  { id: "FIR-01", type: "Fire Truck", status: "Idle", location: "Central Fire Station", lastUpdated: "1 hr ago", lat: 30.0400, lng: 31.2300 },
  { id: "FIR-02", type: "Fire Truck", status: "En Route", location: "Industrial Zone", lastUpdated: "3 mins ago", lat: 30.0700, lng: 31.2600 },
];

const Fleet = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState(mockFleet);
  const [loading, setLoading] = useState(false);
  
  // Assign feature state
  const [verifiedIncidents, setVerifiedIncidents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchVerifiedIncidents();
  }, []);

  const fetchVerifiedIncidents = async () => {
    try {
      const response = await api.get("/api/v1/incidents/");
      const resData = response.data.data || response.data;

      if (Array.isArray(resData)) {
        // Fetch only verified incidents that are not yet assigned/responding
        const verified = resData.filter(inc => inc.status === "verified");
        setVerifiedIncidents(verified);
      }
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  const handleAssignClick = (unit) => {
    setSelectedUnit(unit);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async (incident) => {
    if (!selectedUnit) return;
    setIsAssigning(true);
    
    try {
      // 1. Update the incident status in the backend to "responding"
      await api.put(`/api/v1/incidents/${incident.id}`, { status: "responding" });
      
      // 2. Update local fleet status
      const updatedUnits = units.map((u) => {
        if (u.id === selectedUnit.id) {
          return {
            ...u,
            status: "En Route",
            location: `Heading to Incident #${incident.id}`,
            lastUpdated: "Just now"
          };
        }
        return u;
      });
      setUnits(updatedUnits);

      // 3. Remove from local unassigned verified incidents list
      setVerifiedIncidents(prev => prev.filter(inc => inc.id !== incident.id));
      
      Swal.fire({
        title: "Dispatched!",
        text: `Unit ${selectedUnit.id} assigned to Incident #${incident.id}`,
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
      
      setShowAssignModal(false);
      setSelectedUnit(null);
    } catch (err) {
      console.error("Assign Error:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || err.message || "Failed to dispatch unit.",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: units.length,
      idle: units.filter((u) => u.status === "Idle").length,
      enRoute: units.filter((u) => u.status === "En Route").length,
      onScene: units.filter((u) => u.status === "On Scene").length,
    };
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesFilter = filter === "All" || unit.type === filter || unit.status === filter;
      const matchesSearch = unit.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            unit.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [units, filter, searchTerm]);

  const getCategoryTheme = (type) => {
    const iconClass = "w-6 h-6";
    const themes = {
      "Fire Truck": {
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        accent: "bg-orange-600",
        icon: <TruckIcon className={iconClass} />
      },
      "Police": {
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        accent: "bg-blue-600",
        icon: <ShieldExclamationIcon className={iconClass} />
      },
      "Ambulance": {
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        accent: "bg-green-600",
        icon: <LifebuoyIcon className={iconClass} />
      }
    };
    return themes[type] || themes.Ambulance;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Idle": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "En Route": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "On Scene": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="h-screen w-full flex flex-col text-slate-800 dark:text-white overflow-hidden bg-transparent">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        <div className="hidden md:block h-full pl-4">
          <div className="h-full bg-white/40 dark:bg-black/20 backdrop-blur-xs border border-white/50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl ml-5">
            <Sidebar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto custom-scroll px-6 pb-10">
          <div className="flex justify-between items-center mb-6 pt-4">
            <div className="bg-white/60 dark:bg-white/[0.02] border border-white/50 dark:border-white/10 pl-6 pr-12 py-3 rounded-2xl backdrop-blur-sm relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h1 className="text-[28px] font-black tracking-tighter uppercase leading-none text-slate-800 dark:text-white/90">
                Fleet Management
              </h1>
            </div>
            <div className="flex gap-4">
              <StatCard label="Total Units" value={stats.total} color="text-white" />
              <StatCard label="Idle" value={stats.idle} color="text-green-400" />
              <StatCard label="En Route" value={stats.enRoute} color="text-yellow-400" />
              <StatCard label="On Scene" value={stats.onScene} color="text-red-500" />
            </div>
          </div>

          <div className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-3 rounded-[1.8rem] mb-6 flex flex-wrap items-center gap-4 shadow-sm dark:shadow-none">
            <div className="flex bg-white/60 dark:bg-black/40 p-1.5 rounded-xl border border-white/50 dark:border-white/5 gap-1">
              {["All", "Ambulance", "Police", "Fire Truck"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === opt ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-white/50 dark:hover:bg-white/5"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex bg-white/60 dark:bg-black/40 p-1.5 rounded-xl border border-white/50 dark:border-white/5 gap-1">
              {["Idle", "En Route", "On Scene"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === opt ? "bg-slate-700 text-white shadow-lg" : "text-gray-500 hover:bg-white/50 dark:hover:bg-white/5"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[200px] group">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Unit ID or Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/60 dark:bg-black/20 border border-white/50 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs outline-none text-slate-800 dark:text-white transition-all focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-black/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => {
              const theme = getCategoryTheme(unit.type);
              const statusColors = getStatusColor(unit.status);
              
              return (
                <div key={unit.id} className="bg-white/40 dark:bg-black/20 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2rem] p-6 shadow-xl dark:shadow-none hover:border-white/80 dark:hover:border-white/20 transition-all duration-300 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-full h-1 ${theme.accent} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${theme.bg} ${theme.color} border ${theme.border}`}>
                        {theme.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-wide uppercase">{unit.id}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{unit.type}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border ${statusColors} text-[9px] font-black uppercase tracking-wider`}>
                      {unit.status}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 bg-white/30 dark:bg-white/[0.02] p-4 rounded-2xl border border-white/40 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-500">Current Location</p>
                        <p className="text-xs font-black text-slate-800 dark:text-white/90 truncate">{unit.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Updated: {unit.lastUpdated}
                    </p>
                    
                    {unit.status === "Idle" ? (
                      <button 
                        onClick={() => handleAssignClick(unit)}
                        className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-md`}
                      >
                        Assign Incident
                      </button>
                    ) : (
                      <button className="bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/50 dark:border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all text-slate-800 dark:text-white shadow-sm dark:shadow-none">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredUnits.length === 0 && (
            <div className="text-center py-20 bg-white/40 dark:bg-black/20 rounded-[2.5rem] border border-white/50 dark:border-white/5">
              <TruckIcon className="w-16 h-16 mx-auto text-slate-400 mb-4 opacity-50" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No units found matching your criteria</p>
            </div>
          )}

        </main>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedUnit && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowAssignModal(false)}
          ></div>
          <div className="relative bg-white/80 dark:bg-[#0a0a0a]/90 border border-white/50 dark:border-white/10 w-full max-w-3xl rounded-[2.5rem] p-10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            
            <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-6">
              <div className="p-4 rounded-[2rem] bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <ShieldExclamationIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-blue-500 font-mono text-[10px] font-black tracking-[0.4em] mb-1 block uppercase">
                  Dispatch Unit {selectedUnit.id}
                </span>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic">
                  Select Verified Incident
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll pr-2 mb-6">
              {verifiedIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckBadgeIcon className="w-12 h-12 mx-auto text-slate-500 mb-4 opacity-50" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No verified unassigned incidents currently.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {verifiedIncidents.map(inc => (
                    <div key={inc.id} className="flex justify-between items-center bg-white/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-white/50 dark:border-white/5 hover:border-blue-500/50 transition-all group">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                            {inc.type || "Emergency"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">#{inc.id}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white/90">
                          {inc.description || "Verified incident requiring response"}
                        </p>
                        <p className="text-[9px] text-slate-500 uppercase mt-2 tracking-widest">
                          Location: {inc.latitude}, {inc.longitude}
                        </p>
                      </div>
                      <button
                        onClick={() => handleConfirmAssign(inc)}
                        disabled={isAssigning}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-md flex-shrink-0"
                      >
                        {isAssigning ? "Dispatching..." : "Assign & Dispatch"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-8 py-3 bg-white/5 rounded-xl font-black text-[10px] text-gray-400 hover:text-white hover:bg-white/10 uppercase transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 px-8 py-3 rounded-2xl text-center min-w-[110px]">
    <span className={`block text-2xl font-black ${color}`}>{value}</span>
    <span className="text-[9px] uppercase font-black text-gray-500 italic">
      {label}
    </span>
  </div>
);

export default Fleet;
