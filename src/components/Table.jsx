import React, { useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import {
  ExclamationCircleIcon,
  MapPinIcon,
  UserCircleIcon,
  EyeIcon,
  FireIcon,
  TruckIcon,
  LifebuoyIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

const Table = ({ incidents = [], onSelectIncident, activeId, onRefresh }) => {
  const [viewedIncident, setViewedIncident] = useState(null);

  // دالة تحديث الحالة وربطها بباك إيند مجاهد
  const handleStatusUpdate = async (e, id, newStatus) => {
    e.stopPropagation(); // منع اختيار الصف عند الضغط على الزرار
    try {
      const token = localStorage.getItem("token");

      // نداء الـ PUT endpoint اللي مجاهد محدده
      await api.put(
        `/api/v1/incidents/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // تحديث البيانات في الصفحة الرئيسية فوراً
      onRefresh();

      Swal.fire({
        title: "Status Updated",
        text: `Incident is now ${newStatus.toUpperCase()}`,
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#dc2626",
        timer: 2000
      });
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || "Could not update status",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff"
      });
    }
  };

  // دالة اختيار الأيقونة المناسبة لنوع الحادثة
  const getIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("fire")) return <FireIcon className="w-5 h-5" />;
    if (t.includes("accident") || t.includes("car"))
      return <TruckIcon className="w-5 h-5" />;
    if (t.includes("medical") || t.includes("help"))
      return <LifebuoyIcon className="w-5 h-5" />;
    return <ExclamationCircleIcon className="w-5 h-5" />;
  };

  return (
    <div className="p-7 relative overflow-hidden w-full">
      {/* Table Header */}
      <div className="grid grid-cols-7 px-6 mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/50 dark:border-white/5 pb-4">
          <div className="col-span-1">ID & Type</div>
          <div className="text-center">Source</div>
          <div className="text-center">Location</div>
          <div className="text-center">Confidence</div>
          <div className="text-center">Status</div>
          <div className="text-center">Created At</div>
          <div className="text-right pr-4">Quick Actions</div>
        </div>

        {/* Table Body */}
        <div className="space-y-3 overflow-y-auto max-h-[400px] pl-2 pr-2 custom-scroll">
          {incidents.length === 0 ? (
            <div className="text-center py-10 text-gray-600 font-black uppercase tracking-widest text-xs">
              No Active Incidents Detected
            </div>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`grid grid-cols-7 items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  activeId === incident.id
                    ? "bg-red-600/15 border-red-500/50 shadow-[0_0_25px_rgba(220,38,38,0.15)] scale-[1.01]"
                    : "bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-white/80 dark:hover:border-white/20"
                }`}
              >
                {/* Type & ID */}
                <div className="col-span-1 flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      activeId === incident.id
                        ? "bg-red-600 text-white"
                        : "bg-red-600/10 text-red-500"
                    }`}
                  >
                    {getIcon(incident.type)}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-800 dark:text-white font-black leading-tight uppercase">
                      {incident.type}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold tracking-tighter mt-0.5">
                      #{incident.id?.toString().substring(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Source Badge */}
                <div className="flex justify-center items-center">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border tracking-widest uppercase text-center flex items-center justify-center min-w-[100px] ${
                    (incident.source && incident.source.toLowerCase().includes('citizen')) || !incident.ai_confidence
                      ? "bg-purple-600/10 text-purple-400 border-purple-500/20"
                      : "bg-cyan-600/10 text-cyan-400 border-cyan-500/20"
                  }`}>
                    {(incident.source && incident.source.toLowerCase().includes('citizen')) || !incident.ai_confidence
                      ? "Citizen Report"
                      : "AI Camera"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-gray-500/60" />
                  {incident.latitude?.toFixed(4)},{" "}
                  {incident.longitude?.toFixed(4)}
                </div>

                {/* AI Confidence */}
                <div className="text-center">
                  <span className="text-[10px] font-black text-gray-500 dark:text-white/50 tracking-widest">
                    {incident.ai_confidence
                      ? `${(incident.ai_confidence * 100).toFixed(0)}%`
                      : "N/A"}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="text-center">
                  <span
                    className={`text-[9px] font-black px-4 py-1.5 rounded-full border tracking-widest uppercase ${
                      incident.status === "reported"
                        ? "bg-yellow-600/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                        : incident.status === "verified"
                          ? "bg-blue-600/10 text-blue-400 border-blue-500/20"
                          : "bg-green-600/10 text-green-400 border-green-500/20"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                {/* Time */}
                <div className="text-center text-[10px] font-black text-gray-400 dark:text-white/40 tracking-tighter italic">
                  {incident.created_at
                    ? new Date(incident.created_at).toLocaleTimeString()
                    : "Just now"}
                </div>

                {/* Actions */}
                <div className="text-right flex justify-end gap-2 pr-2">
                  {/* زرار الـ Verify يظهر فقط لو الحالة reported */}
                  {incident.status === "reported" && (
                    <button
                      onClick={(e) =>
                        handleStatusUpdate(e, incident.id, "verified")
                      }
                      className="p-2.5 bg-green-600/20 text-green-500 rounded-xl border border-green-500/30 hover:bg-green-600 hover:text-white transition-all active:scale-90"
                      title="Verify Incident"
                    >
                      <CheckBadgeIcon className="w-4 h-4" />
                    </button>
                  )}

                  {/* زرار الـ Resolve يظهر لو الحالة verified */}
                  {incident.status === "verified" && (
                    <button
                      onClick={(e) =>
                        handleStatusUpdate(e, incident.id, "resolved")
                      }
                      className="p-2.5 bg-blue-600/20 text-blue-500 rounded-xl border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                      title="Mark as Resolved"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewedIncident(incident);
                    }}
                    className="p-2.5 bg-white/40 dark:bg-white/5 rounded-xl border border-white/50 dark:border-white/10 hover:bg-red-600 hover:border-red-500 transition-all text-slate-600 dark:text-white hover:text-white group"
                    title="View Incident Image"
                  >
                    <EyeIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      {/* Image View Modal */}
      {viewedIncident && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-white/80 backdrop-blur-3xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 rounded-3xl flex flex-col w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Header */}
            <div className="flex-none flex items-center justify-between p-4 sm:px-6 border-b border-white/50 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewedIncident(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all text-slate-800 dark:text-white border border-white/50 dark:border-white/10 group"
                >
                  <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-xs font-black tracking-widest uppercase">Back</span>
                </button>
                <div className="h-8 w-px bg-gray-300 dark:bg-white/10 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 text-red-500 rounded-lg hidden sm:block">
                    <EyeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 dark:text-white font-black text-lg sm:text-xl tracking-widest uppercase leading-tight">
                      Spectator View
                    </h3>
                    <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                      ID: #{viewedIncident.id?.toString().substring(0, 8)}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewedIncident(null)}
                className="p-2 bg-white/5 hover:bg-red-600 rounded-xl transition-all text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-1 min-h-0 bg-black/80 relative flex items-center justify-center overflow-hidden">
              <img 
                src={`${api.defaults.baseURL}/api/v1/image/${viewedIncident.id}`} 
                alt="Incident Frame" 
                className="max-w-full max-h-full object-contain mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center gap-4 text-gray-600 font-black uppercase tracking-[0.2em] text-sm w-full h-full">
                <ExclamationCircleIcon className="w-16 h-16 opacity-50" />
                <span>No visual feed available</span>
              </div>
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                <span className="text-white text-[10px] font-black tracking-widest uppercase">REC</span>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg hidden sm:block">
                <span className="text-white/80 text-[10px] font-mono tracking-widest">
                  COORD: {viewedIncident.latitude?.toFixed(4)}, {viewedIncident.longitude?.toFixed(4)}
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                <span className="text-white/80 text-[10px] font-mono tracking-widest">
                  {new Date(viewedIncident.created_at || Date.now()).toISOString().replace('T', ' ').substring(0, 19)}
                </span>
              </div>
            </div>

            {/* Footer Details */}
            <div className="flex-none grid grid-cols-3 divide-x divide-white/50 dark:divide-white/5 bg-white/40 dark:bg-white/[0.02] border-t border-white/50 dark:border-white/5">
              <div className="p-4 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Type</p>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-white font-black uppercase tracking-wider">{viewedIncident.type}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">AI Confidence</p>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-white font-black uppercase tracking-wider">
                  {viewedIncident.ai_confidence ? `${(viewedIncident.ai_confidence * 100).toFixed(0)}%` : "N/A"}
                </p>
              </div>
              <div className="p-4 text-center flex flex-col items-center justify-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                <span className={`text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  viewedIncident.status === "reported"
                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    : viewedIncident.status === "verified"
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : "bg-green-500/10 text-green-500 border border-green-500/20"
                }`}>
                  {viewedIncident.status}
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

export default Table;
