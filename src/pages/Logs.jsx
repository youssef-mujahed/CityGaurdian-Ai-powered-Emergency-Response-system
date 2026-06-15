import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LogDetailModal from "../components/LogDetailModal";
import api from "../api/axios";
import Swal from "sweetalert2";
import {
  MagnifyingGlassIcon,
  VideoCameraIcon,
  FireIcon,
  LifebuoyIcon,
  CheckBadgeIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // الـ Slash في الآخر مهمة جداً عشان الـ 405
      const response = await api.get("/api/v1/incidents/");
      const resData = response.data.data || response.data;

      if (Array.isArray(resData)) {
        // بنفلتر عشان نعرض فقط الـ reported اللي لسه متمش تأكيدها
        const unverifiedAIOnly = resData.filter(
          (inc) => 
            (inc.status === "reported" || inc.status === "unverified") &&
            (!inc.source?.toLowerCase().includes('citizen') && inc.ai_confidence)
        );
        setLogsData(unverifiedAIOnly);
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // تحديث كل 15 ثانية لجلب أي بلاغات جديدة من الـ AI
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = useMemo(() => logsData.length, [logsData]);

  // تعديل الـ Verify عشان يسمع في السيرفر ويمسح من اللستة
  const handleVerify = async (id) => {
    try {
      // إرسال طلب التحديث للسيرفر
      await api.put(`/api/v1/incidents/${id}`, { status: "verified" });

      // مسح العنصر من الصفحة فوراً بعد النجاح
      setLogsData((prev) => prev.filter((log) => log.id !== id));

      // قفل المودال لو كان مفتوح
      setShowModal(false);
      setSelectedLog(null);

      Swal.fire({
        title: "Verified!",
        text: "The incident has been verified.",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Verify Error:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Verification failed. Check API connectivity.",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
      });
    }
  };

  const getTypeStyles = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("accident"))
      return {
        icon: <TruckIcon className="w-5 h-5" />,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
      };
    if (t.includes("fire"))
      return {
        icon: <FireIcon className="w-5 h-5" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
      };
    if (t.includes("medical"))
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

  const filteredLogs = logsData.filter(
    (log) =>
      log.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex flex-col text-white overflow-hidden bg-transparent">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        <div className="hidden md:block h-full pl-4">
          <div className="h-full bg-black/20 backdrop-blur-xs border border-white/5 rounded-[2.5rem] overflow-hidden ml-5">
            <Sidebar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto custom-scroll px-8 pb-10">
          <div className="flex justify-between items-center mb-8 pt-6">
            <div className="bg-white/[0.02] border border-white/10 pl-6 pr-12 py-4 rounded-2xl backdrop-blur-sm relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <h1 className="text-[32px] font-black tracking-tighter uppercase text-white/90 leading-none">
                Detection Logs
              </h1>
              <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.3em] mt-2 block">
                Live Sensor Data
              </span>
            </div>
            <div className="bg-black/40 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center shadow-xl border-l-2 border-l-red-600">
              <span className="text-2xl font-black text-red-500 animate-pulse">
                {loading ? "..." : activeCount}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 text-center">
                Pending
              </span>
            </div>
          </div>

          <div className="relative mb-8 group">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter incoming signals..."
              className="w-full bg-black/20 border border-white/10 rounded-[1.5rem] py-5 pl-16 text-white outline-none focus:border-blue-600/30 transition-all"
            />
          </div>

          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
                  <th className="px-10 py-6 italic">Signal/Type</th>
                  <th className="px-8 py-6 text-center italic">Source</th>
                  <th className="px-8 py-6 text-center italic">Location</th>
                  <th className="px-8 py-6 text-center italic">Time</th>
                  <th className="px-8 py-6 italic">Trust Score</th>
                  <th className="px-10 py-6 text-center italic">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && logsData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-20 text-center text-xs uppercase tracking-widest text-gray-500 animate-pulse italic"
                    >
                      Scanning Network Assets...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-20 text-center text-xs uppercase tracking-widest text-gray-400 italic"
                    >
                      No Active Signals Detected
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
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
                                #{log.id?.toString().slice(-4)}
                              </span>
                              <span className="font-black text-lg uppercase text-white/90 tracking-tighter">
                                {log.type || "UNKNOWN"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                          <div className="flex justify-center items-center">
                            <span className="text-[9px] font-black px-3 py-1.5 rounded-full border tracking-widest uppercase text-center flex items-center justify-center min-w-[100px] bg-cyan-600/10 text-cyan-400 border-cyan-500/20">
                              AI Camera
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center text-gray-400 font-bold italic">
                          <div className="flex items-center justify-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-white/20" />
                            {log.latitude?.toFixed(2) || "0.00"},{" "}
                            {log.longitude?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center text-gray-400 font-mono text-sm">
                          {new Date(
                            log.created_at || Date.now()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="px-8 py-8">
                          <ConfidenceBar
                            value={
                              log.ai_confidence ? log.ai_confidence * 100 : 85
                            }
                          />
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedLog(log);
                                setShowModal(true);
                              }}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                            >
                              Analyze
                            </button>
                            <button
                              onClick={() => handleVerify(log.id)}
                              className="p-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                            >
                              <CheckBadgeIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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
      <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }`}</style>
    </div>
  );
};

const ConfidenceBar = ({ value }) => (
  <div className="w-full max-w-[120px] inline-block">
    <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 px-0.5 tracking-tighter">
      <span className="text-gray-600 italic">AI Confidence</span>
      <span className={value >= 80 ? "text-green-500" : "text-yellow-500"}>
        {Math.round(value)}%
      </span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div
        className={`h-full ${value >= 80 ? "bg-green-600" : "bg-yellow-600"} transition-all duration-1000`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default Logs;
