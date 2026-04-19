import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TruckIcon,
  FireIcon,
  LifebuoyIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

const LiveMap = () => {
  const navigate = useNavigate();
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const mapUrl =
    "https://www.propertyfinder.eg/blog/wp-content/uploads/2017/12/Capture-9.png";

  // 1. جلب البيانات بأمان من الـ Storage
  useEffect(() => {
    const loadData = () => {
      try {
        const rawData = sessionStorage.getItem("verified_emergencies");
        const saved = rawData ? JSON.parse(rawData) : [];

        if (Array.isArray(saved) && saved.length > 0) {
          const latestFour = saved.slice(0, 4);

          // نستخدم setTimeout لتجنب الـ Synchronous State Update جوه الـ Effect
          setTimeout(() => {
            setIncidents(latestFour);
            // تحديد أول حالة تلقائياً
            if (latestFour.length > 0) {
              setSelectedIncidentId(latestFour[0].id);
            }
          }, 0);
        }
      } catch (err) {
        console.error("Failed to load incidents:", err);
      }
    };

    loadData();
  }, []); // مصفوفة فارغة لضمان التنفيذ مرة واحدة فقط عند الـ Mount

  const selectedIncident = incidents.find(
    (inc) => inc.id === selectedIncidentId
  );

  // 2. توزيع النقط عشوائياً بناءً على الـ ID
  const getIncidentLocation = (id) => {
    if (!id) return { top: "50%", left: "50%" };
    const num = parseInt(id.replace(/\D/g, "")) || 50;
    return {
      top: `${((num * 7) % 50) + 25}%`,
      left: `${((num * 13) % 60) + 20}%`
    };
  };

  // 3. دالة الاستايل والأيقونة (تم تصليح الـ props هنا)
  const getTypeStyles = (type) => {
    const iconProps = { className: "w-6 h-6" }; // التعريف الصحيح للـ props

    if (type === "Accident")
      return {
        icon: <TruckIcon {...iconProps} />,
        color: "text-red-500",
        markerBg: "bg-red-600"
      };
    if (type === "Fire")
      return {
        icon: <FireIcon {...iconProps} />,
        color: "text-orange-500",
        markerBg: "bg-orange-600"
      };
    if (type === "Medical")
      return {
        icon: <LifebuoyIcon {...iconProps} />,
        color: "text-blue-500",
        markerBg: "bg-blue-600"
      };

    return {
      icon: <ExclamationCircleIcon {...iconProps} />,
      color: "text-gray-400",
      markerBg: "bg-gray-600"
    };
  };

  // 4. ثيم الأنيميشن للنقطة حسب النوع
  const getMarkerAnimation = (type) => {
    if (type === "Fire")
      return (
        <>
          <div className="absolute -inset-4 rounded-full bg-orange-500/20 animate-pulse duration-700"></div>
          <div className="absolute -inset-8 rounded-full bg-red-600/10 animate-pulse duration-1000"></div>
        </>
      );
    if (type === "Accident")
      return (
        <>
          <div className="absolute -inset-6 rounded-full border border-red-500/40 animate-ping duration-1500"></div>
          <div className="absolute -inset-2 rounded-full bg-red-600/10 animate-pulse"></div>
        </>
      );
    if (type === "Medical")
      return (
        <>
          <div className="absolute -inset-4 rounded-full border border-blue-500/30 animate-pulse duration-2000"></div>
          <div className="absolute -inset-8 rounded-full border border-blue-600/10 animate-pulse"></div>
        </>
      );
    return null;
  };

  const handleSelect = (id) => {
    setSelectedIncidentId(selectedIncidentId === id ? null : id);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden px-4 relative">
      {/* الخريطة */}
      <div className="flex-[3] relative rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${mapUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {selectedIncidentId && selectedIncident && (
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{
              top: getIncidentLocation(selectedIncident.id).top,
              left: getIncidentLocation(selectedIncident.id).left,
              transform: "translate(-50%, -50%)"
            }}
          >
            {getMarkerAnimation(selectedIncident.type)}
            <div
              className={`relative w-12 h-12 rounded-2xl border-2 border-white/40 flex items-center justify-center rotate-45 shadow-2xl ${getTypeStyles(selectedIncident.type).markerBg}`}
            >
              <div className="-rotate-45 text-white">
                {getTypeStyles(selectedIncident.type).icon}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* القائمة الجانبية */}
      <div className="flex-1 min-w-[380px] bg-black/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-full">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-white/5 pb-4">
          Operations Feed
        </h2>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scroll">
          {incidents.map((incident) => {
            const style = getTypeStyles(incident.type);
            const isActive = selectedIncidentId === incident.id;
            return (
              <div
                key={incident.id}
                onClick={() => handleSelect(incident.id)}
                className={`p-6 border transition-all duration-500 cursor-pointer rounded-[2.5rem] relative 
                  ${isActive ? "bg-white/15 border-white/20 scale-[1.02]" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${style.color}`}
                  >
                    {style.icon}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-black uppercase tracking-tighter ${style.color}`}
                    >
                      {incident.type}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono italic">
                      {incident.id}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold truncate w-32">
                    <MapPinIcon className="w-3 h-3" /> {incident.location}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">
                    {incident.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/emergencies")}
          className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            Open Control Center
          </span>
          <ArrowRightIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default LiveMap;
