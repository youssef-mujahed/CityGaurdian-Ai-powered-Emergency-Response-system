import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = {
  lat: 30.0444,
  lng: 31.2357
};

const Mapsection = ({ incidents = [], activeIncident }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDI8UpdULdepmmKmmdW_oLxcaRa2cgQ68A"
  });

  const [map, setMap] = useState(null);
  const [localActiveId, setLocalActiveId] = useState(null);

  useEffect(() => {
    if (activeIncident) {
      setLocalActiveId(activeIncident.id);
    }
  }, [activeIncident]);

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

  return (
    <div className="relative w-full h-[500px] bg-gray-100 dark:bg-black/20 z-0">
      {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {incidents.map((incident) => {
              const isPopupOpen = localActiveId === incident.id;
              return (
                <MarkerF
                  key={incident.id}
                  position={{ lat: incident.latitude, lng: incident.longitude }}
                  onClick={() => setLocalActiveId(incident.id)}
                  icon={{
                    url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    scaledSize: window.google ? new window.google.maps.Size(25, 41) : null
                  }}
                >
                  {isPopupOpen && (
                    <InfoWindowF
                      position={{ lat: incident.latitude, lng: incident.longitude }}
                      onCloseClick={() => setLocalActiveId(null)}
                      options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                    >
                      <div className="p-2 min-w-[180px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg">
                        <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                          <h3 className="font-black text-gray-900 dark:text-white uppercase text-[12px]">
                            {incident.type}
                          </h3>
                        </div>
                        <div className="space-y-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                          <p className="flex justify-between">
                            <span>STATUS:</span>
                            <span className="text-red-600 uppercase">
                              {incident.status}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>AI CONFIDENCE:</span>
                            <span className="text-blue-700">
                              {(incident.ai_confidence * 100).toFixed(0)}%
                            </span>
                          </p>
                          <div className="mt-3 pt-2 border-t border-dashed border-gray-200 text-[9px] text-gray-400">
                            GPS: {incident.latitude.toFixed(5)},{" "}
                            {incident.longitude.toFixed(5)}
                          </div>
                        </div>
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

        <div className="absolute bottom-6 right-8 z-[1000] pointer-events-none">
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-[10px] font-black text-gray-800 dark:text-white tracking-widest uppercase">
                Satellite Link:{" "}
                <span className="text-blue-600">Established</span>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Mapsection;

