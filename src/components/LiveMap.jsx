import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import {
  TruckIcon,
  FireIcon,
  LifebuoyIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = {
  lat: 30.0444,
  lng: 31.2357
};

const LiveMap = ({ incidents = [], activeIncident, onSelectIncident }) => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDI8UpdULdepmmKmmdW_oLxcaRa2cgQ68A"
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && activeIncident && activeIncident.latitude && activeIncident.longitude) {
      map.panTo({ lat: activeIncident.latitude, lng: activeIncident.longitude });
      map.setZoom(18);
    }
  }, [activeIncident, map]);

  const getTypeStyles = (type) => {
    const t = type?.toLowerCase() || "";
    const iconProps = { className: "w-6 h-6" };
    if (t.includes("accident"))
      return {
        icon: <TruckIcon {...iconProps} />,
        color: "text-red-600",
        bg: "bg-red-50"
      };
    if (t.includes("fire"))
      return {
        icon: <FireIcon {...iconProps} />,
        color: "text-orange-600",
        bg: "bg-orange-50"
      };
    if (t.includes("medical"))
      return {
        icon: <LifebuoyIcon {...iconProps} />,
        color: "text-blue-600",
        bg: "bg-blue-50"
      };
    return {
      icon: <ExclamationCircleIcon {...iconProps} />,
      color: "text-gray-600",
      bg: "bg-gray-50"
    };
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden pb-4">
      {/* الخريطة - Light Mode */}
      <div className="flex-[3] relative rounded-[3rem] border border-gray-200 overflow-hidden shadow-xl bg-white z-0">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {incidents.map((incident) => {
              const isActive = activeIncident && activeIncident.id === incident.id;
              return (
                <MarkerF
                  key={incident.id}
                  position={{ lat: incident.latitude, lng: incident.longitude }}
                  onClick={() => onSelectIncident(incident)}
                  icon={{
                    url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    scaledSize: window.google ? new window.google.maps.Size(25, 41) : null
                  }}
                >
                  {isActive && (
                    <InfoWindowF
                      position={{ lat: incident.latitude, lng: incident.longitude }}
                      options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                      onCloseClick={() => onSelectIncident(null)}
                    >
                      <div className="p-1 min-w-[120px] bg-white text-gray-900 rounded-xl">
                        <p className="font-black text-red-600 uppercase text-[10px]">
                          {incident.type}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold">
                          {incident.status}
                        </p>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              );
            })}
          </GoogleMap>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 font-bold">
            Loading Google Maps...
          </div>
        )}
      </div>

      {/* القائمة الجانبية - بتصميم متناسق مع الهوم */}
      <div className="flex-1 min-w-[400px] bg-black/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-full border-l border-white/20">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
            Operations Feed
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black text-white/60 uppercase">
              Live
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scroll">
          {incidents.map((incident) => {
            const style = getTypeStyles(incident.type);
            const isActive = activeIncident?.id === incident.id;
            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`p-5 transition-all duration-500 cursor-pointer rounded-[2.2rem] border
                  ${
                    isActive
                      ? "bg-white/20 border-white/30 scale-[1.02] shadow-lg"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl bg-black/20 ${style.color} border border-white/5`}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase text-white tracking-tight">
                      {incident.type}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono italic">
                      #{incident.id.toString().substring(0, 8)}
                    </p>
                  </div>
                  <div className="text-right text-[8px] font-black text-gray-500 uppercase tracking-widest">
                    {new Date(incident.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                    <MapPinIcon className="w-3 h-3 text-red-500" />
                    {incident.latitude.toFixed(3)},{" "}
                    {incident.longitude.toFixed(3)}
                  </div>
                  <span
                    className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                      incident.status === "reported"
                        ? "border-yellow-500/50 text-yellow-500"
                        : "border-green-500/50 text-green-500"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/emergencies")}
          className="w-full py-5 bg-white text-black hover:bg-gray-200 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl font-black text-[10px] uppercase tracking-widest"
        >
          Control Center
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LiveMap;
