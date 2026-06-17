import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Settings = () => {
  return (
    <div className="h-screen w-full flex flex-col text-slate-800 dark:text-white overflow-hidden bg-transparent">
      {/* 1. الناف بار العلوي */}
      <Navbar />

      {/* شيلنا الـ padding من الشمال (px-0 أو pl-0) عشان السايد بار يجي على الحرف بالظبط بمحاذاة الناف بار */}
      <div className="flex flex-1 overflow-hidden pt-2 pr-4 gap-2">
        {/* 2. السايد بار: الآن سيبدأ من أقصى اليسار بمحاذاة الناف بار */}
        <div className="hidden md:block h-full pl-4">
          {" "}
          {/* pl-4 هنا عشان يدي مسافة بسيطة من حرف الشاشة لو الناف بار فيه مسافة */}
          <div className="h-full bg-white/40 dark:bg-black/20 backdrop-blur-xs border border-white/50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl ml-5">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
