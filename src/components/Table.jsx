import React from "react";
import {
  ExclamationCircleIcon,
  MapPinIcon,
  UserCircleIcon,
  EyeIcon,
  FireIcon, // أيقونة النار
  TruckIcon, // أيقونة الحوادث/المركبات
  LifebuoyIcon, // أيقونة المساعدة الطبية
  NoSymbolIcon // أيقونة الركن المخالف
} from "@heroicons/react/24/outline";

const Table = ({ onSelectIncident, activeId }) => {
  // دالة لاختيار الأيقونة بناءً على نوع الحادثة
  const getIcon = (type) => {
    switch (type) {
      case "Car Accident":
        return <TruckIcon className="w-5 h-5" />;
      case "Fire":
        return <FireIcon className="w-5 h-5" />;
      case "Medical Help":
        return <LifebuoyIcon className="w-5 h-5" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5" />;
    }
  };

  const incidents = [
    {
      id: "#INC42",
      type: "Car Accident",
      location: "Ring Road",
      source: "AI Camera 42",
      status: "Responding",
      time: "2 min ago"
    },
    {
      id: "#INC41",
      type: "Fire",
      location: "Down Town",
      source: "Citizen App",
      status: "Pending",
      time: "5 min ago"
    },
    {
      id: "#INC40",
      type: "Medical Help",
      location: "Shorouk City",
      source: "Manual Report",
      status: "Resolved",
      time: "15 min ago"
    },
    {
      id: "#INC39",
      type: "Car Accident",
      location: "Zamalek",
      source: "AI Sensor 09",
      status: "Pending",
      time: "22 min ago"
    }
  ];

  return (
    <div className="mt-2 px-10 ">
      <div className="bg-black/30 border border-white/10 rounded-[2.5rem] p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-6 px-6 mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5 pb-4">
          <div className="col-span-1">ID & Type</div>
          <div className="text-center">Location</div>
          <div className="text-center">Source</div>
          <div className="text-center pr-4">Time</div>
          <div className="text-center pr-4">Status</div>
          <div className="text-right pr-4">Actions</div>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[250px] pl-2 pr-2 custom-scroll">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident)}
              className={`grid grid-cols-6 items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeId === incident.id
                  ? "bg-red-600/15 border-red-500/50 shadow-[0_0_25px_rgba(220,38,38,0.15)] scale-[1.01]"
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="col-span-1 flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    activeId === incident.id
                      ? "bg-red-600 text-white shadow-[0_0_10px_#dc2626]"
                      : "bg-red-600/10 text-red-500"
                  }`}
                >
                  {/* 👇 هنا بننادي الدالة عشان تطلع الأيقونة الصح */}
                  {getIcon(incident.type)}
                </div>
                <div>
                  <p className="text-[11px] text-white font-black leading-tight">
                    {incident.type}
                  </p>
                  <p className="text-[9px] text-gray-500 font-bold tracking-tighter mt-0.5">
                    {incident.id}
                  </p>
                </div>
              </div>

              {/* باقي الصف كما هو بدون تغيير */}
              <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-gray-300">
                <MapPinIcon className="w-4 h-4 text-gray-500/60" />{" "}
                {incident.location}
              </div>
              <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-gray-300">
                <UserCircleIcon className="w-4 h-4 text-gray-500/60" />{" "}
                {incident.source}
              </div>
              <div className="text-center text-[10px] font-black text-white/50 tracking-widest italic">
                {incident.time}
              </div>
              <div className="text-center">
                <span
                  className={`text-[9px] font-black px-4 py-1.5 rounded-full border tracking-widest ${
                    incident.status === "Responding"
                      ? "bg-red-600/10 text-red-400 border-red-500/20 animate-pulse"
                      : incident.status === "Pending"
                        ? "bg-yellow-600/10 text-yellow-400 border-yellow-500/20"
                        : "bg-green-600/10 text-green-400 border-green-500/20"
                  }`}
                >
                  {incident.status}
                </span>
              </div>
              <div className="text-right pr-2">
                <button className="p-2.5 bg-white/5 cursor-pointer rounded-xl border border-white/10 hover:bg-red-600 hover:border-red-500 transition-all text-white active:scale-90 group">
                  <EyeIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
