import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

interface DraggableAdvancedMarkerProps {
  position: google.maps.LatLngLiteral;
  onDragEnd: (position: google.maps.LatLngLiteral) => void;
}

export const DraggableAdvancedMarker = ({ position, onDragEnd }: DraggableAdvancedMarkerProps) => {
  const map = useMap();
  const markerLibrary = useMapsLibrary("marker");

  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const onDragEndRef = useRef(onDragEnd);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  const cleanup = useCallback(() => {
    if (listenerRef.current) {
      google.maps.event.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }
    if (rootRef.current) {
      setTimeout(() => {
        try {
          rootRef.current?.unmount();
        } catch (error) {
          console.warn("Root unmount error:", error);
        }
        rootRef.current = null;
      }, 0);
    }
    containerRef.current = null;
  }, []);

  const createMarker = useCallback(() => {
    if (!map || !position || !markerLibrary || markerRef.current) {
      return false;
    }

    try {
      const container = document.createElement("div");
      containerRef.current = container;

      const root = createRoot(container);
      rootRef.current = root;

      root.render(
        <div className="bg-blue-600 border-2 border-blue-800 rounded-full w-8 h-8 grid place-content-center shadow-lg">
          <House size={14} className="text-white" />
        </div>,
      );

      const marker = new markerLibrary.AdvancedMarkerElement({
        map,
        position: { lat: position.lat, lng: position.lng },
        gmpDraggable: true,
        content: container,
      });

      const listener = marker.addListener("dragend", () => {
        const pos = marker.position as google.maps.LatLngLiteral;
        if (pos?.lat && pos?.lng) {
          onDragEndRef.current({ lat: pos.lat, lng: pos.lng });
        }
      });

      listenerRef.current = listener;
      markerRef.current = marker;

      console.log("Marker created successfully at:", position);
      return true;
    } catch (error) {
      console.error("Failed to create marker:", error);
      cleanup();
      return false;
    }
  }, [map, position, markerLibrary, cleanup]);

  useEffect(() => {
    if (!map || !position || !markerLibrary) return;

    if (markerRef.current) cleanup();

    createMarker();

    return () => cleanup();
  }, [map, position, markerLibrary, createMarker, cleanup]);

  useEffect(() => {
    if (!map || !position || !markerRef.current) return;

    markerRef.current.position = position;
    map.panTo(position);
  }, [position, map]);

  return null;
};
