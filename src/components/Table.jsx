import React from "react";
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
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const Table = ({ incidents = [], onSelectIncident, activeId, onRefresh }) => {
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
    <div className="mt-2 px-10 pb-8">
      <div className="bg-black/30 border border-white/10 rounded-[2.5rem] p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 px-6 mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5 pb-4">
          <div className="col-span-1">ID & Type</div>
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
                className={`grid grid-cols-6 items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  activeId === incident.id
                    ? "bg-red-600/15 border-red-500/50 shadow-[0_0_25px_rgba(220,38,38,0.15)] scale-[1.01]"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
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
                    <p className="text-[11px] text-white font-black leading-tight uppercase">
                      {incident.type}
                    </p>
                    <p className="text-[9px] text-gray-500 font-bold tracking-tighter mt-0.5">
                      #{incident.id?.toString().substring(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-gray-500/60" />
                  {incident.latitude?.toFixed(4)},{" "}
                  {incident.longitude?.toFixed(4)}
                </div>

                {/* AI Confidence */}
                <div className="text-center">
                  <span className="text-[10px] font-black text-white/50 tracking-widest">
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
                <div className="text-center text-[10px] font-black text-white/40 tracking-tighter italic">
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

                  <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-red-600 hover:border-red-500 transition-all text-white group">
                    <EyeIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
