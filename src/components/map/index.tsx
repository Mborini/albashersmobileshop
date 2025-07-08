"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9oYm9yaW5pIiwiYSI6ImNtMDNzajUyczAxMHYycnM0cTE4cTV4amoifQ.0KnW_JhYY7pcTx9NVVWFXg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [lng] = useState(35.855630070655124);
  const [lat] = useState(32.54490897468007);
  const [zoom] = useState(18);

  useEffect(() => {
    if (map.current) return;

    if (
      !mapboxgl.getRTLTextPluginStatus ||
      mapboxgl.getRTLTextPluginStatus() !== "loaded"
    ) {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        null,
        true
      );
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      pitch: 60,
      bearing: -17.6,
    });

    map.current.on("load", () => {
      // طبقة المباني الثلاثية الأبعاد
      map.current!.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            16,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            16,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.6,
        },
      });

      // إنشاء عنصر HTML كصورة مخصصة للماركر
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundImage = "url('https://albasheermblshop.s3.eu-north-1.amazonaws.com/map/my-marker.png')";
      el.style.width = "150px";
      el.style.height = "150px";
      el.style.backgroundSize = "cover";
      el.style.borderRadius = "50%";
      el.style.border = "4px dotted black";
      el.style.backgroundColor= "rgba(255, 255, 255, 0.5)";

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  }, [lng, lat, zoom]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[450px] rounded-lg shadow-md border border-gray-300"
    />
  );
};

export default Map;
