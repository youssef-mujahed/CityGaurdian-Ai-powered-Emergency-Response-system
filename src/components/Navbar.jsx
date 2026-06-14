import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api/axios"; // استيراد الـ axios اللي عملناه

import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("Loading..."); // حالة لحفظ الاسم
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 1. جلب بيانات المستخدم عند تحميل الناف بار
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // نكلم لينك الـ Me اللي مجاهد بعته
        const response = await api.get("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}` // نبعت التوكن عشان الباك إيند يعرفنا
          }
        });

        const fullName = response.data.full_name; // أو حسب الـ Key اللي مجاهد مرجعه

        // تقطيع الاسم لأول اسمين فقط
        if (fullName) {
          const nameParts = fullName.split(" ");
          const shortName = nameParts.slice(0, 2).join(" ");
          setUserName(shortName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("Guest"); // لو حصل مشكلة يظهر كضيف
      }
    };

    fetchUserData();
  }, []);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // مسح التوكن عند الخروج
    navigate("/");
  };

  return (
    <div className="pt-5 px-10 w-full flex justify-center relative z-[999]">
      <header className="w-full max-w-[1750px] bg-[#0a0a0a]/30 backdrop-blur-xl border border-white/5 rounded-sm p-4 shadow-2xl relative">
        <div className="flex items-center justify-between px-2">
          {/* الجزء الشمال: اللوجو والاسم */}
          <Link
            to="/home"
            className="flex items-center gap-6 group cursor-pointer"
          >
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
          <div className="flex items-center gap-2.5 bg-black/40 px-4 py-1.5 border border-green-500/20 rounded-full">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="text-green-500 text-[11px] font-black uppercase tracking-widest leading-none">
              Online
            </span>
          </div>

          {/* الجزء اليمين: التنبيهات والأدمن */}
          <div className="flex items-center gap-4 pl-8 border-l border-white/10">
            <div className="text-right leading-tight">
              {/* 2. هنا بنعرض الاسم اللي جبناه */}
              <p className="text-white text-sm font-bold tracking-wider capitalize">
                {userName}
              </p>
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-tighter opacity-70">
                Traffic Authority
              </p>
            </div>

            {/* البروفايل مع القائمة المنسدلة */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="relative cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <UserCircleIcon className="w-10 h-10 text-orange-300/80" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-4 w-52 bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 z-[1000] animate-in fade-in zoom-in duration-200 ring-1 ring-white/5">
                  <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                      Session Control
                    </p>
                    <p className="text-white text-[11px] font-bold mt-1">
                      {userName}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-500/10 transition-all text-xs font-black uppercase tracking-widest group/btn"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    Logout From System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
