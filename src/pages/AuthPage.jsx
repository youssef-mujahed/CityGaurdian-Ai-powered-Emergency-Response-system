import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  IdentificationIcon,
  Cog8ToothIcon
} from "@heroicons/react/24/outline";

const AuthPage = () => {
  const navigate = useNavigate();

  // دالة التعامل مع الدخول/التسجيل
  const handleAuth = (e) => {
    e.preventDefault();
    // التوجيه لصفحة الهوم بعد النجاح
    navigate("/home");
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-transparent font-sans">
      {/* 1. Header - مطابق للصورة */}
      <header className="relative z-10 w-full p-6 pt-10 px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform hover:scale-110 duration-300">
            {/* اللوجو (أيقونة الدماغ أو المستخدم كما في الصورة) */}
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
              Emergency <span className="text-red-600">Response</span> AI
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-2 italic opacity-80">
              AI Powered Emergency & Traffic System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 px-6 py-2 border border-white/5 rounded-full bg-black/40 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]"></span>
            Offline
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Cog8ToothIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. Main Container for Forms */}
      <main className="flex-1 w-full flex items-center justify-center p-6 relative z-0">
        <div className="w-full max-w-[1300px] grid grid-cols-1 lg:grid-cols-2 gap-16 px-4">
          {/* ----- SIGNUP FORM (Left) ----- */}
          <div className="bg-black/40 backdrop-blur-3xl border border-red-600/20 rounded-[3.5rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600/5 blur-[60px]"></div>

            <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-14 text-center">
              SIGNUP
            </h2>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <InputGroup
                  icon={<UserIcon className="w-4 h-4" />}
                  placeholder="First Name"
                />
                <InputGroup
                  icon={<UserIcon className="w-4 h-4" />}
                  placeholder="Last Name"
                />
              </div>

              <InputGroup
                icon={<IdentificationIcon className="w-4 h-4" />}
                placeholder="National ID"
              />
              <InputGroup
                icon={<EnvelopeIcon className="w-4 h-4" />}
                placeholder="E-mail"
              />
              <InputGroup
                icon={<LockClosedIcon className="w-4 h-4" />}
                placeholder="Password"
                type="password"
              />

              <div className="flex items-center px-2 py-2">
                <label className="flex items-center gap-3 cursor-pointer group/agree">
                  <input type="checkbox" className="hidden" />
                  <div className="w-5 h-5 border border-white/20 rounded-md group-hover/agree:border-red-500 transition-all flex items-center justify-center bg-white/5">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    I Agree The{" "}
                    <span className="text-red-600 hover:underline">
                      Terms & Conditions
                    </span>
                  </p>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-red-700/80 hover:bg-red-600 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(185,28,28,0.3)] transition-all active:scale-[0.98] mt-6"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* ----- LOGIN FORM (Right) ----- */}
          <div className="bg-black/40 backdrop-blur-3xl border border-red-600/20 rounded-[3.5rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 blur-[60px]"></div>

            <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-14 text-center">
              LOGIN
            </h2>

            <form
              onSubmit={handleAuth}
              className="space-y-8 flex flex-col h-full"
            >
              <div className="space-y-6">
                <InputGroup
                  icon={<EnvelopeIcon className="w-4 h-4" />}
                  placeholder="E-mail / National ID"
                />
                <InputGroup
                  icon={<LockClosedIcon className="w-4 h-4" />}
                  placeholder="Password"
                  type="password"
                />
              </div>

              <div className="flex flex-col gap-6 px-2">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="text-[10px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors"
                  >
                    Forgot Password ?
                  </button>
                  <label className="flex items-center gap-3 cursor-pointer group/rem">
                    <input type="checkbox" className="hidden" />
                    <div className="w-5 h-5 border border-white/20 rounded-md group-hover/rem:border-red-500 transition-all flex items-center justify-center bg-white/5">
                      <div className="w-2.5 h-2.5 bg-red-600 rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      Remember Me
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-red-700/80 hover:bg-red-600 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(185,28,28,0.3)] transition-all active:scale-[0.98] mt-10"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

// مكون الإدخال (Input Component)
const InputGroup = ({ icon, placeholder, type = "text" }) => (
  <div className="relative group/input">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors duration-300">
      {icon}
    </div>
    <input
      type={type}
      required
      placeholder={placeholder}
      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none focus:border-red-600/30 focus:bg-white/[0.05] transition-all text-white placeholder:text-gray-700 placeholder:text-[10px] placeholder:uppercase placeholder:font-black placeholder:tracking-[0.2em]"
    />
  </div>
);

export default AuthPage;
