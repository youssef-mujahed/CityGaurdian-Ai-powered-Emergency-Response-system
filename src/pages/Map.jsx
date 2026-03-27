import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex flex-col text-white overflow-hidden selection:bg-red-500/30">
      {/* 1. الناف بار العلوي */}
      <Navbar />

      <div className="flex flex-1 mt-1 relative">
        {/* 2. السايد بار الجانبي */}
        <div className="pl-21 h-full">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
