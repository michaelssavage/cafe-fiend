import { useMap } from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

interface DraggableAdvancedMarkerProps {
  position: google.maps.LatLngLiteral;
  onDragEnd: (position: google.maps.LatLngLiteral) => void;
}

export const DraggableAdvancedMarker = ({
  position,
  onDragEnd,
}: DraggableAdvancedMarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const onDragEndRef = useRef(onDragEnd);
  const map = useMap();

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;
    if (markerRef.current) return;

    const container = document.createElement("div");
    containerRef.current = container;

    const root = createRoot(container);
    rootRef.current = root;

    root.render(
      <div className="bg-blue-600 border-2 border-blue-800 rounded-full w-8 h-8 grid place-content-center shadow-lg">
        <House size={14} className="text-white" />
      </div>
    );

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      gmpDraggable: true,
      content: container,
    });

    const listener = marker.addListener("dragend", () => {
      const pos = marker.position as google.maps.LatLngLiteral;
      onDragEndRef.current({ lat: pos.lat, lng: pos.lng });
    });

    listenerRef.current = listener;
    markerRef.current = marker;

    return () => {
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      if (marker) {
        marker.map = null;
      }
      if (root) {
        // Defer unmounting to avoid race condition
        setTimeout(() => {
          try {
            root.unmount();
          } catch (error) {
            console.warn("Root unmount error:", error);
          }
        }, 0);
      }
      markerRef.current = null;
      rootRef.current = null;
      containerRef.current = null;
    };
  }, [map, position]);

  useEffect(() => {
    if (markerRef.current && markerRef.current.position !== position) {
      markerRef.current.position = position;
    }
  }, [position]);

  return null;
};
