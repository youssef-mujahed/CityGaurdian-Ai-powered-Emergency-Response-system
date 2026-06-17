import React from "react";
import Map from "../pages/Map";
import { NavLink } from "react-router-dom";
import {
  Squares2X2Icon,
  GlobeAltIcon,
  PlusIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: Squares2X2Icon, path: "/home" },
    { name: "Live Traffic Map", icon: GlobeAltIcon, path: "/map" },
    {
      name: "Emergency Incidents",
      icon: PlusIcon,
      path: "/emergencies"
    },

    {
      name: "AI Detection Logs",
      icon: VideoCameraIcon,
      path: "/logs"
    },
    {
      name: "Verified Incidents",
      icon: CheckBadgeIcon,
      path: "/verified"
    },
    {
      name: "Fleet & Responders",
      icon: TruckIcon,
      path: "/fleet"
    },
    {
      name: "Resolved Incidents",
      icon: CheckCircleIcon,
      path: "/resolved"
    }
  ];

  return (
    <aside className="w-71 flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-xl h-[calc(95vh-100px)] border-r border-white/50 dark:border-white/5 shadow-xl dark:shadow-2xl">
      <nav className="flex-1 flex flex-col gap-3 p-6 pt-10">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500 group
              ${
                isActive
                  ? "bg-red-600/10 border border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                  : "hover:bg-white/40 dark:hover:bg-white/5 border border-transparent"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* الأيقونة الدائرية اللي بتتشقلب وتتغير لونها */}
                <div
                  className={`
                  p-2.5 rounded-full border transition-all duration-700
                  ${
                    isActive
                      ? "bg-red-600 border-red-400 shadow-[0_0_15px_#dc2626] rotate-[360deg]"
                      : "bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/10 group-hover:border-white/80 dark:group-hover:border-white/40 group-hover:rotate-[20deg]"
                  }
                `}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-white"}`}
                  />
                </div>

                {/* اسم الصفحة */}
                <span
                  className={`
                  text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300
                  ${isActive ? "text-red-600 dark:text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)] dark:drop-shadow-[0_0_8px_#dc2626]" : "text-slate-600 dark:text-gray-500 group-hover:text-slate-800 dark:group-hover:text-white"}
                `}
                >
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
