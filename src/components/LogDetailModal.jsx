import React from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";

const LogDetailModal = ({ log, onClose, onVerify, getTypeIcon }) => {
  // تأكيد إننا بنجيب الأيقونة صح، ولو مش موجودة نستخدم ديفولت
  const IconRender = getTypeIcon ? (
    getTypeIcon(log.type)
  ) : (
    <VideoCameraIcon className="w-10 h-10 text-white" />
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

        <button
          onClick={onClose}
          className="absolute top-8 right-10 text-gray-500 hover:text-white text-3xl transition-all"
        >
          &times;
        </button>

        <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
          {/* عرض الأيقونة اللي جاية من الـ props */}
          <div className="p-6  rounded-[2rem] shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            {/* لو الـ getTypeIcon بترجع Component، بنرندره هنا */}
            {React.cloneElement(IconRender, {
              className: "w-10 h-10 text-white"
            })}
          </div>
          <div>
            <span className="text-blue-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">
              {log.id}
            </span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1 italic">
              Review Detection
            </h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              {log.type} • AI Analysis Phase
            </p>
          </div>
        </div>

        {/* Feed Preview */}
        <div className="aspect-video bg-white/5 rounded-3xl mb-8 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
              Live Feed Buffer
            </span>
          </div>
          <ExclamationTriangleIcon className="w-12 h-12 text-white/5 mb-2" />
          <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em]">
            Waiting for stream...
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block mb-1 tracking-widest">
              Accuracy
            </span>
            <span className="text-xl font-black text-green-500">
              {log.confidence}% Confirmed
            </span>
          </div>
          <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block mb-1 tracking-widest">
              Source
            </span>
            <span className="text-xl font-black text-white uppercase italic">
              {log.method}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-xl font-black text-[9px] text-gray-500 hover:text-red-500 uppercase tracking-widest transition-all"
          >
            Discard
          </button>
          <button
            onClick={() => onVerify(log.id)}
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] transition-all shadow-lg"
          >
            Confirm Incident
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
