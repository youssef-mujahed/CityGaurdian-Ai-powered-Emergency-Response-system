import React from "react";
import { Link } from "react-router-dom"; // 👇 استيراد الـ Link أساسي هنا
import logo from "../assets/logo.png";

import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <div className="pt-5 px-10 w-full flex justify-center">
      <header className="w-full max-w-[1750px] bg-[#0a0a0a]/30 backdrop-blur-xl border border-white/5 rounded-sm p-4 shadow-2xl">
        <div className="flex items-center justify-between px-2">
          {/* الجزء الشمال: اللوجو والبراندينج مغلفين بـ Link */}
          <Link to="/" className="flex items-center gap-6 group cursor-pointer">
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
            </div>
            

            <div className="flex flex-col border-r border-white/10 pr-8">
              <h1 className="text-white text-[28px] font-bold tracking-[0.1em] uppercase leading-none transition-colors group-hover:text-red-500">
                Emergency Response AI
              </h1>
              <p className="text-blue-100 text-[11px] mt-2 uppercase tracking-[0.1em] font-semibold opacity-80">
                AI Powered Emergency & Traffic System
              </p>
            </div>
          </Link>

            {/* مؤشر الـ Online */}
            <div className="flex items-center mr-170 gap-2.5 bg-black/40 px-4 py-1.5 border border-green-500/20 rounded-full ml-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-green-500 text-[11px] font-black uppercase tracking-widest leading-none">
                Online
              </span>
            </div>
          

          {/* الجزء اليمين: التنبيهات والأدمن */}
          <div className="flex items-center gap-10">
            <button className="relative group">
              <BellIcon className="w-7 h-7 text-pink-200/60 group-hover:text-white cursor-pointer transition-all" />
              <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
            </button>

            <div className="flex items-center gap-4 pl-8 border-l border-white/10">
              <div className="text-right leading-tight">
                <p className="text-white text-sm font-bold tracking-wider">
                  Admin
                </p>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-tighter opacity-70">
                  Traffic Authority
                </p>
              </div>
              <div className="relative cursor-pointer">
                <UserCircleIcon className="w-10 h-10 text-orange-300/80" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
              </div>
              <button className="cursor-pointer">
                <Cog6ToothIcon className="w-7 h-7 text-gray-500 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
