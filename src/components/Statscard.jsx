import React from "react";
import {
  ExclamationTriangleIcon,
  SignalIcon,
  TruckIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";

const Statscard = () => {
  const cards = [
    {
      title: "Active Emergencies",
      value: "12",
      description: "Ongoing Incidents",
      icon: ExclamationTriangleIcon,
      defaultBg: "bg-red-950/20",
      defaultBorder: "border-red-900/30",
      activeBg: "group-hover:bg-red-600/30",
      activeBorder: "group-hover:border-red-500",
      glow: "group-hover:shadow-[0_0_40px_rgba(220,38,38,0.5),inset_0_0_20px_rgba(220,38,38,0.2)]",
      accent: "text-red-500",
      textGlow:
        "group-hover:text-red-300 group-hover:drop-shadow-[0_0_10px_#dc2626]"
    },
    {
      title: "Traffic Status",
      value: "MEDIUM",
      description: "Congestion",
      icon: SignalIcon,
      defaultBg: "bg-yellow-950/20",
      defaultBorder: "border-yellow-900/30",
      activeBg: "group-hover:bg-yellow-600/30",
      activeBorder: "group-hover:border-yellow-500",
      glow: "group-hover:shadow-[0_0_40px_rgba(234,179,8,0.5),inset_0_0_20px_rgba(234,179,8,0.2)]",
      accent: "text-yellow-500",
      textGlow:
        "group-hover:text-yellow-300 group-hover:drop-shadow-[0_0_10px_#eab308]"
    },
    {
      title: "Available Ambulances",
      value: "8 ACTIVE",
      description: "2 Responding",
      icon: TruckIcon,
      defaultBg: "bg-green-950/20",
      defaultBorder: "border-green-900/30",
      activeBg: "group-hover:bg-green-600/30",
      activeBorder: "group-hover:border-green-500",
      glow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.5),inset_0_0_20px_rgba(34,197,94,0.2)]",
      accent: "text-green-500",
      textGlow:
        "group-hover:text-green-300 group-hover:drop-shadow-[0_0_10px_#22c55e]"
    },
    {
      title: "AI Detection Status",
      value: "YOLO",
      description: "Model: Running",
      icon: CpuChipIcon,
      defaultBg: "bg-purple-950/20",
      defaultBorder: "border-purple-900/30",
      activeBg: "group-hover:bg-purple-600/30",
      activeBorder: "group-hover:border-purple-500",
      glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.2)]",
      accent: "text-purple-500",
      textGlow:
        "group-hover:text-purple-300 group-hover:drop-shadow-[0_0_10px_#a855f7]"
    }
  ];

  return (
    <div className="mt-2 mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group relative flex flex-col justify-between p-5 h-36 
          ${card.defaultBg} border ${card.defaultBorder} rounded-[1.8rem] 
          backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:scale-[1.05] hover:-translate-y-2 cursor-pointer
          ${card.activeBg} ${card.activeBorder} ${card.glow} overflow-hidden`}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div
              className={`p-2 rounded-xl bg-black/40 border border-white/10 ${card.activeBorder} transition-all duration-700`}
            >
              <card.icon
                className={`w-7 h-7 ${card.accent} ${card.textGlow} transition-all duration-700 group-hover:rotate-[360deg]`}
              />
            </div>
            <p
              className={`text-[11px] font-black uppercase tracking-[0.15em] ${card.accent} ${card.textGlow} opacity-80 group-hover:opacity-100 transition-all`}
            >
              {card.title}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 relative z-10">
            <h2
              className={`text-2xl font-black tracking-tighter text-white transition-all duration-700 ${card.textGlow} group-hover:scale-105 origin-left`}
            >
              {card.value}
            </h2>
            <p
              className={`text-[11px] font-bold uppercase tracking-widest ${card.accent} opacity-60 group-hover:opacity-100 transition-all`}
            >
              {card.description}
            </p>
          </div>

          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
      ))}
    </div>
  );
};

export default Statscard;
