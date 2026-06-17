import React from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";

const LogDetailModal = ({ log, onClose, onVerify, getTypeIcon }) => {
  // دالة بسيطة لرندرة الأيقونة بأمان
  const renderIcon = () => {
    if (getTypeIcon && log.type) {
      const icon = getTypeIcon(log.type);
      return React.isValidElement(icon) ? icon : <VideoCameraIcon />;
    }
    return <VideoCameraIcon />;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 text-left">
      {/* الـ Overlay اللي ورا */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* الـ Modal نفسه */}
      <div
        className="relative bg-white/80 dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند الضغط جواه
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

        {/* زرار الـ X */}
        <button
          onClick={onClose}
          className="absolute top-8 right-10 text-gray-500 hover:text-white text-3xl transition-all z-50"
        >
          &times;
        </button>

        <div className="flex items-start gap-6 mb-8 border-b border-white/50 dark:border-white/5 pb-8">
          <div className="p-6 rounded-[2rem] shadow-[0_0_30px_rgba(37,99,235,0.3)] bg-blue-600/10">
            <div className="w-10 h-10 text-white flex items-center justify-center">
              {renderIcon()}
            </div>
          </div>
          <div>
            <span className="text-blue-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">
              {log.id}
            </span>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-1 italic">
              Review Detection
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              {log.type} • AI Analysis Phase
            </p>
          </div>
        </div>

        {/* Feed Preview */}
        <div className="aspect-video bg-white/40 dark:bg-white/5 rounded-3xl mb-8 border border-white/50 dark:border-white/5 flex items-center justify-center relative overflow-hidden group">
          {/* Real Image Feed */}
          <img 
            src={`${api.defaults.baseURL}/api/v1/image/${log.id}`} 
            alt="AI Detection Frame" 
            className="w-full h-full object-contain bg-black/50"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          
          {/* Fallback Placeholder (Hidden by default, shown if image fails) */}
          <div className="hidden flex-col items-center justify-center w-full h-full">
            <ExclamationTriangleIcon className="w-12 h-12 text-slate-300 dark:text-white/5 mb-2" />
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-[0.5em]">
              Waiting for stream...
            </span>
          </div>

          {/* REC Badge */}
          <div className="absolute top-4 left-6 flex items-center gap-2 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            <span className="text-[9px] font-black uppercase text-slate-800 dark:text-white/80 tracking-widest">
              Live Feed Buffer
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-white/50 dark:border-white/5">
            <span className="text-[8px] text-slate-500 uppercase font-black block mb-1 tracking-widest">
              Accuracy
            </span>
            <span className="text-xl font-black text-green-500">
              {log.ai_confidence
                ? Math.round(log.ai_confidence * 100)
                : log.confidence || 85}
              % Confirmed
            </span>
          </div>
          <div className="bg-white/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-white/50 dark:border-white/5">
            <span className="text-[8px] text-slate-500 uppercase font-black block mb-1 tracking-widest">
              Location
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-white uppercase italic">
              {log.latitude
                ? `${log.latitude.toFixed(2)}, ${log.longitude.toFixed(2)}`
                : "Sector 1"}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="flex-1 py-4 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-red-500/10 border border-white/50 dark:border-white/10 rounded-xl font-black text-[9px] text-slate-500 hover:text-slate-800 dark:hover:text-red-500 uppercase tracking-widest transition-all"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("Confirming log ID:", log.id); // للتأكد في الـ Console
              onVerify(log.id);
            }}
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
          >
            Confirm Incident
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogDetailModal;
