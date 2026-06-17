import React from "react";
import {
  MapPinIcon,
  FireIcon,
  TruckIcon,
  LifebuoyIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

const EmergencyTable = ({ data, activeFilter, searchTerm, onViewDetails, onVerify }) => {
  const filteredData = data.filter((inc) => {
    const incType = inc.type ? String(inc.type).toLowerCase() : "";
    const filterType = activeFilter ? String(activeFilter).toLowerCase() : "all";
    const matchesFilter = filterType === "all" || incType === filterType;
    
    const safeId = inc.id != null ? String(inc.id).toLowerCase() : "";
    const safeLocation = inc.location != null ? String(inc.location).toLowerCase() : "";
    const safeSearchTerm = searchTerm ? String(searchTerm).toLowerCase() : "";

    const matchesSearch =
      safeSearchTerm === "" ||
      safeId.includes(safeSearchTerm) ||
      safeLocation.includes(safeSearchTerm);

    return matchesFilter && matchesSearch;
  });

  const getRowStyles = (type) => {
    if (type === "Accident")
      return {
        icon: <TruckIcon className="w-4 h-4" />,
        color: "text-red-500",
        bg: "bg-red-500/10"
      };
    if (type === "Fire")
      return {
        icon: <FireIcon className="w-4 h-4" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
      };
    if (type === "Medical")
      return {
        icon: <LifebuoyIcon className="w-4 h-4" />,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      };
    return {
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    };
  };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/50 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Incident
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center">
              Source
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Location
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Time
            </th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center">
              Status
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/50 dark:divide-white/5">
          {filteredData.length > 0 ? (
            filteredData.map((row) => {
              const style = getRowStyles(row.type);
              return (
                <tr
                  key={row.id}
                  className="hover:bg-white/50 dark:hover:bg-white/[0.03] transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-xl border border-white/50 dark:border-white/5 ${style.bg} ${style.color}`}
                      >
                        {style.icon}
                      </div>
                      <div>
                        <span className="text-red-500 font-mono text-[10px] font-black block tracking-widest">
                          {row.id}
                        </span>
                        <span className="text-slate-800 dark:text-white font-black text-base uppercase tracking-tighter">
                          {row.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center items-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border tracking-widest uppercase text-center flex items-center justify-center min-w-[100px] ${
                        (row.source && row.source.toLowerCase().includes('citizen')) || !row.ai_confidence
                          ? "bg-purple-600/10 text-purple-400 border-purple-500/20"
                          : "bg-cyan-600/10 text-cyan-400 border-cyan-500/20"
                      }`}>
                        {(row.source && row.source.toLowerCase().includes('citizen')) || !row.ai_confidence
                          ? "Citizen Report"
                          : "AI Camera"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-500 dark:text-gray-400 font-bold text-xs italic">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-3.5 h-3.5" /> {row.latitude ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}` : row.location}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 font-mono text-[11px] font-bold">
                      <ClockIcon className="w-3.5 h-3.5 text-green-500 animate-pulse" />{" "}
                      {row.created_at ? new Date(row.created_at).toLocaleTimeString() : row.time}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest 
                      ${
                        row.status === "Responding"
                          ? "text-red-500 bg-red-500/10 border-red-500/20 animate-pulse"
                          : row.status === "Pending"
                            ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                            : "text-green-400 bg-green-400/10 border-green-400/20"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onViewDetails(row)}
                        className="min-w-[120px] bg-white/60 dark:bg-white/5 hover:bg-red-600 dark:hover:bg-red-600 border border-white/50 dark:border-white/10 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all text-slate-800 hover:text-white dark:text-white"
                      >
                        {row.status === "reported" || row.status === "unverified"
                          ? "Review"
                          : "View Details"}
                      </button>
                      {(row.status === "reported" || row.status === "unverified") && onVerify && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerify(row.id);
                          }}
                          className="p-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                          title="Verify Incident"
                        >
                          <CheckBadgeIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                className="py-20 text-center text-gray-600 font-black uppercase tracking-widest italic text-sm"
              >
                No Results Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmergencyTable;
