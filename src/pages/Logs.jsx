import React, { useState, useMemo } from "react"; // أضفنا useMemo هنا
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LogDetailModal from "../components/LogDetailModal";
import {
  MagnifyingGlassIcon,
  VideoCameraIcon,
  FireIcon,
  LifebuoyIcon,
  CheckBadgeIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  CpuChipIcon // أيقونة إضافية للـ Model
} from "@heroicons/react/24/outline";

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 1. الداتا الخام الأساسية
  const staticLogs = [
    {
      id: "#INC42",
      type: "Accident",
      method: "AI CAMERA 04",
      location: "Ring Road",
      confidence: 96,
      time: "10:30 PM",
      status: "Unverified"
    },
    {
      id: "#INC41",
      type: "Fire",
      method: "CITIZEN APP",
      location: "Down Town",
      confidence: 45,
      time: "10:28 PM",
      status: "Unverified"
    },
    {
      id: "#INC40",
      type: "Medical",
      method: "MOBILE SENSOR",
      location: "Shorouk City",
      confidence: 94,
      time: "10:25 PM",
      status: "Unverified"
    },
    {
      id: "#INC39",
      type: "Accident",
      method: "AI CAMERA 12",
      location: "Zamalek",
      confidence: 92,
      time: "10:15 PM",
      status: "Unverified"
    },
    {
      id: "#INC38",
      type: "Medical",
      method: "MOBILE SENSOR",
      location: "Maadi",
      confidence: 89,
      time: "10:05 PM",
      status: "Unverified"
    },
    {
      id: "#INC37",
      type: "Fire",
      method: "AI SENSOR 09",
      location: "Nasr City",
      confidence: 78,
      time: "09:50 PM",
      status: "Unverified"
    },
    {
      id: "#INC36",
      type: "Accident",
      method: "CITIZEN APP",
      location: "6 October",
      confidence: 60,
      time: "09:40 PM",
      status: "Unverified"
    },
    {
      id: "#INC35",
      type: "Medical",
      method: "POLICE FEED",
      location: "New Cairo",
      confidence: 91,
      time: "09:10 PM",
      status: "Unverified"
    },
    {
      id: "#INC34",
      type: "Fire",
      method: "THERMAL CAM",
      location: "Giza Pyramids",
      confidence: 85,
      time: "08:55 PM",
      status: "Unverified"
    },
    {
      id: "#INC33",
      type: "Accident",
      method: "AI CAMERA 02",
      location: "Alex Road",
      confidence: 98,
      time: "08:30 PM",
      status: "Unverified"
    }
  ];

  // 2. إدارة الـ State
  const [logsData, setLogsData] = useState(() => {
    const verifiedFromStorage = JSON.parse(
      sessionStorage.getItem("verified_emergencies") || "[]"
    );
    const verifiedIds = verifiedFromStorage.map((v) => v.id);
    return staticLogs.filter((log) => !verifiedIds.includes(log.id));
  });

  // 🔥 حساب عدد الحالات النشطة حالياً
  const activeCount = useMemo(() => logsData.length, [logsData]);

  const getTypeStyles = (type) => {
    if (type === "Accident")
      return {
        icon: <TruckIcon className="w-5 h-5" />,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
      };
    if (type === "Fire")
      return {
        icon: <FireIcon className="w-5 h-5" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
      };
    if (type === "Medical")
      return {
        icon: <LifebuoyIcon className="w-5 h-5" />,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
      };
    return {
      icon: <VideoCameraIcon className="w-5 h-5" />,
      color: "text-gray-400",
      bg: "bg-gray-400/10",
      border: "border-gray-400/20"
    };
  };

  const handleVerify = (id) => {
    const logToVerify = logsData.find((log) => log.id === id);
    if (logToVerify) {
      const existingEmergencies = JSON.parse(
        sessionStorage.getItem("verified_emergencies") || "[]"
      );
      const newEmergency = {
        id: logToVerify.id,
        type: logToVerify.type,
        location: logToVerify.location,
        source: logToVerify.method,
        status: "Pending",
        time: logToVerify.time
      };

      if (!existingEmergencies.find((e) => e.id === id)) {
        const updatedList = [newEmergency, ...existingEmergencies];
        sessionStorage.setItem(
          "verified_emergencies",
          JSON.stringify(updatedList)
        );
      }
      setLogsData((prev) => prev.filter((log) => log.id !== id));
      setShowModal(false);
    }
  };

  const filteredLogs = logsData.filter(
    (log) =>
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <main className="flex-1 overflow-y-auto custom-scroll px-8 pb-10">
          {/* Header Section with Stats */}
          <div className="flex justify-between items-center mb-8 pt-6">
            <div className="bg-white/[0.02] border border-white/10 pl-6 pr-12 py-4 rounded-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <h1 className="text-[32px] font-black tracking-tighter uppercase leading-none text-white/90">
                AI Detection Stream
              </h1>
              <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.3em] mt-2 block italic">
                Sector 01 • Raw Data Feed
              </span>
            </div>

            {/* 🔥 المربعات المطلوبة */}
            <div className="flex gap-4">
              {/* Card 1: Active Signals */}
              <div className="bg-black/40 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] backdrop-blur-md shadow-xl border-l-2 border-l-red-600">
                <span className="text-2xl font-black text-red-500 animate-pulse">
                  {activeCount}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                  Live Signals
                </span>
              </div>

              {/* Card 2: YOLO Status */}
              <div className="bg-black/40 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[150px] backdrop-blur-md shadow-xl border-l-2 border-l-blue-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                  <span className="text-2xl font-black text-white">85%</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 text-center">
                  YOLO Model Status
                </span>
              </div>
            </div>
          </div>

          <div className="relative mb-8 group">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incoming AI signals..."
              className="w-full bg-black/20 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-6 text-sm outline-none focus:border-blue-600/30 transition-all text-white"
            />
          </div>

          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">
                    Signal/Type
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic text-center">
                    Location
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic text-center">
                    Time
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">
                    Confidence
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => {
                  const style = getTypeStyles(log.type);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-white/[0.02] transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl border ${style.bg} ${style.border} ${style.color}`}
                          >
                            {style.icon}
                          </div>
                          <div>
                            <span className="text-red-500 font-mono text-[10px] font-black block tracking-widest">
                              {log.id}
                            </span>
                            <span className="font-black text-lg uppercase tracking-tighter text-white/90">
                              {log.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center text-gray-400 font-bold text-s italic">
                        <div className="flex items-center justify-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-white-500/50" />{" "}
                          {log.location}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center text-gray-400 font-mono text-s font-bold uppercase tracking-widest">
                        <div className="flex items-center justify-center gap-2">
                          <ClockIcon className="w-4 h-4 text-green-500" />{" "}
                          {log.time}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <ConfidenceBar value={log.confidence} />
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setShowModal(true);
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                          >
                            {" "}
                            Analyze{" "}
                          </button>
                          <button
                            onClick={() => handleVerify(log.id)}
                            className="p-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                          >
                            {" "}
                            <CheckBadgeIcon className="w-5 h-5" />{" "}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setShowModal(false)}
          onVerify={handleVerify}
          getTypeIcon={(type) => getTypeStyles(type).icon}
        />
      )}
    </div>
  );
};

const ConfidenceBar = ({ value }) => (
  <div className="w-full max-w-[140px] inline-block">
    <div className="flex justify-between mb-1.5 px-0.5 font-black text-[12px] uppercase tracking-widest italic">
      <span className="text-gray-600">AI Trust</span>
      <span
        className={
          value >= 80
            ? "text-green-500"
            : value >= 50
              ? "text-yellow-500"
              : "text-red-500"
        }
      >
        {value}%
      </span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div
        className={`h-full ${value >= 80 ? "bg-green-600" : value >= 50 ? "bg-yellow-600" : "bg-red-600"} transition-all duration-1000`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default Logs;
