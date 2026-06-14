import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import {
  UserIcon,
  LockClosedIcon,
  Cog8ToothIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

const AuthPage = () => {
  const navigate = useNavigate();

  // بيانات الدخول فقط (بناءً على طلبك بحذف التسجيل)
  const [loginData, setLoginData] = useState({
    mobile: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/auth/login", loginData);

      // التأكد من نجاح العملية ووجود التوكن
      if (response.data.access_token || response.data.token) {
        const token = response.data.access_token || response.data.token;
        localStorage.setItem("token", token);

        Swal.fire({
          title: "Welcome Back!",
          text: "Authorized Access Granted. Loading Dashboard...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1a1a1a",
          color: "#fff"
        });

        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      Swal.fire({
        title: "Access Denied",
        text:
          error.response?.data?.message ||
          "Invalid credentials or unauthorized account.",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#dc2626"
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-transparent font-sans">
      {/* 1. Header */}
      <header className="relative z-10 w-full p-6 pt-10 px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
              Emergency <span className="text-red-600">Response</span> AI
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-2 italic opacity-80">
              Authorized Personnel Only
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 px-6 py-2 border border-white/5 rounded-full bg-black/40 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]"></span>
            System Secured
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Cog8ToothIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. Main Login Container */}
      <main className="flex-1 w-full flex items-center justify-center p-6 relative z-0">
        <div className="w-full max-w-[550px]">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            {/* Ambient Light Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[80px] group-hover:bg-red-600/20 transition-all duration-700"></div>

            <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-14 text-center">
              Internal <span className="text-red-600">Login</span>
            </h2>

            <form
              onSubmit={handleLogin}
              className="space-y-8 flex flex-col h-full"
            >
              <div className="space-y-6">
                <InputGroup
                  icon={<PhoneIcon className="w-4 h-4" />}
                  placeholder="Official Mobile Number"
                  value={loginData.mobile}
                  onChange={(e) =>
                    setLoginData({ ...loginData, mobile: e.target.value })
                  }
                />

                <InputGroup
                  icon={<LockClosedIcon className="w-4 h-4" />}
                  placeholder="System Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>

              <div className="py-2">
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-[0.2em] leading-relaxed italic">
                  Notice: Unauthorized access attempts are monitored and logged.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-red-700/80 hover:bg-red-600 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(185,28,28,0.3)] transition-all active:scale-95"
              >
                Sign In to Dashboard
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

// مكون الإدخال الذكي (مع زر إظهار/إخفاء الباسورد)
const InputGroup = ({ icon, placeholder, type = "text", value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  // التحكم في نوع الحقل ديناميكياً
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative group/input">
      {/* الأيقونة اليسرى */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors duration-300">
        {icon}
      </div>

      <input
        type={inputType}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-14 text-sm outline-none focus:border-red-600/30 focus:bg-white/[0.05] transition-all text-white placeholder:text-gray-700 placeholder:text-[10px] placeholder:uppercase placeholder:font-black placeholder:tracking-[0.2em]"
      />

      {/* زر العين للحقول من نوع باسوورد فقط */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 transition-colors duration-300 outline-none"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default AuthPage;
