"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox library
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox CSS is included

// Your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoibW9oYm9yaW5pIiwiYSI6ImNtMDNzajUyczAxMHYycnM0cTE4cTV4amoifQ.0KnW_JhYY7pcTx9NVVWFXg";

const Map = () => {
  const mapContainer = useRef(null); // Reference to the map container
  const map = useRef(null); // Reference to the map instance
  const markerRef = useRef(null); // Reference to the marker instance
  const [lng, setLng] = useState(35.851079147718266); // Default longitude
  const [lat, setLat] = useState(32.54079165545406); // Default latitude
  const [zoom, setZoom] = useState(15); // Default zoom level for 3D buildings

  useEffect(() => {
    if (map.current) return; // Initialize map only once
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
    // Initialize Mapbox map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // Map style with 3D buildings
      center: [lng, lat], // Center the map based on the coordinates
      zoom: zoom,
      pitch: 60, // Tilt the map for 3D effect
      bearing: -17.6, // Rotate for better 3D view
    });

    // Add 3D buildings using a 'fill-extrusion' layer
    map.current.on("load", () => {
      map.current.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15, // 3D visible at zoom 15+
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
    });

    // Create a marker at the specified coordinates
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([35.851079147718266, 32.54079165545406]) // Your specified location
      .addTo(map.current);

    // Add zoom and rotation controls to the map
    map.current.addControl(new mapboxgl.NavigationControl());
  }, [lng, lat, zoom]);

  return (
    <section className="relative z-10 pt-8 pm-16 md:py-20 lg:py-28 ">
      <div className="container">
        <div className="-mx-4 flex flex-wrap ">
          <div className="w-full px-4">
            <p className="text-center text-blue-light text-4xl sm:text-5xl font-bold  mb-12">
              Find Us On Map
            </p>
            <div
              className="mx-auto max-w-[850px] shadow-xl overflow-hidden rounded-lg"
              data-wow-delay=".15s"
            >
              <div className="relative aspect-[77/40] rounded-lg items-center justify-center border-4 border-blue-light">
                {/* Map container where Mapbox map will render */}
                <div
                  ref={mapContainer}
                  className="w-full h-[450px] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
