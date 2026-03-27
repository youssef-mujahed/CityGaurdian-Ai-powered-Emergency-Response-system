import React from "react";
import {
  ExclamationTriangleIcon,
  VideoCameraIcon,
  TruckIcon,
  FireIcon,
  LifebuoyIcon,
  NoSymbolIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Mapsection = ({ activeIncident }) => {
  const getIncidentIcon = (type) => {
    switch (type) {
      case "Car Accident":
        return TruckIcon;
      case "Fire":
        return FireIcon;
      case "Medical Help":
        return LifebuoyIcon;
      case "Illegal Parking":
        return NoSymbolIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const markers = [
    {
      id: "#INC42",
      type: "Car Accident",
      top: "45%",
      left: "55%",
      color: "text-red-600"
    },
    {
      id: "#INC41",
      type: "Fire",
      top: "30%",
      left: "35%",
      color: "text-orange-500"
    },
    {
      id: "#INC40",
      type: "Medical Help",
      top: "65%",
      left: "45%",
      color: "text-green-500"
    },
    {
      id: "#INC39",
      type: "Illegal Parking",
      top: "50%",
      left: "22%",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="px-10 mt-2 relative">
      <div className="relative w-full h-[380px] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl bg-black">
        {/* 🗺️ صورة الخريطة الحقيقية (خلفية مؤقتة) */}
        <Link to={"/map"}>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.8] contrast-[1.2]"
            style={{
              backgroundImage: `url('https://www.propertyfinder.eg/blog/wp-content/uploads/2017/12/Capture-9.png')`
            }}
          ></div>

          {/* طبقة سواد متدرج عشان الداتا تبان */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

          {/* تأثير الـ Grid التقني (اختياري) */}
          <div className="absolute inset-0 bg-[length:30px_30px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
        </Link>
        {/* رسم الأيقونات التفاعلية */}
        {markers.map((marker) => {
          const IconComponent = getIncidentIcon(marker.type);
          return (
            <div
              key={marker.id}
              style={{ top: marker.top, left: marker.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                activeIncident?.id === marker.id
                  ? "scale-[1.8] z-30 opacity-100"
                  : "scale-100 opacity-60 hover:opacity-100"
              }`}
            >
              <IconComponent
                className={`w-9 h-9 ${marker.color} drop-shadow-[0_0_15px_currentColor]`}
              />
              {activeIncident?.id === marker.id && (
                <div className="absolute -inset-4 bg-current opacity-20 rounded-full animate-ping"></div>
              )}
            </div>
          );
        })}

        {/* 🛡️ الكارت الجانبي */}
        {activeIncident && (
          <div className="absolute top-6 right-8 w-80 bg-black/90 backdrop-blur-md border border-red-500/40 rounded-[2.2rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300 z-50">
            <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
              <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_#dc2626]">
                {React.createElement(getIncidentIcon(activeIncident.type), {
                  className: "w-6 h-6 text-white"
                })}
              </div>
              <div>
                <h4 className="text-white font-black text-sm tracking-tight">
                  {activeIncident.type}
                </h4>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">
                  {activeIncident.location}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6 font-bold text-[11px] uppercase tracking-tighter">
              <div className="flex justify-between font-black">
                <span className="text-gray-500 tracking-widest">Source:</span>
                <span className="text-white">{activeIncident.source}</span>
              </div>
              <div className="flex justify-between font-black">
                <span className="text-gray-500 tracking-widest">Status:</span>
                <span className="text-red-500 animate-pulse">
                  {activeIncident.status}
                </span>
              </div>
            </div>

            <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] cursor-pointer font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/30">
              Dispatch Emergency
            </button>
          </div>
        )}

        <div className="absolute bottom-6 left-10 font-mono text-[9px] text-white/40 tracking-[0.3em]">
          LIVE FEED: CAIRO_SECTOR_01
        </div>
      </div>
    </div>
  );
};

export default Mapsection;
