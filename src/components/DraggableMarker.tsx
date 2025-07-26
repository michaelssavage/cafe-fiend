import { useMap } from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

interface DraggableAdvancedMarkerProps {
  position: google.maps.LatLngLiteral;
  onDragEnd: (position: google.maps.LatLngLiteral) => void;
}

export const DraggableAdvancedMarker = ({ position, onDragEnd }: DraggableAdvancedMarkerProps) => {
  const map = useMap();

  const initializationAttempts = useRef(0);
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
    if (!map || !position || markerRef.current) return false;

    // Check if AdvancedMarkerElement is available
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
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

      const marker = new google.maps.marker.AdvancedMarkerElement({
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
  }, [map, position, cleanup]);

  // Main effect for creating the marker
  useEffect(() => {
    if (!map || !position) return;

    // Clean up existing marker
    if (markerRef.current) {
      cleanup();
    }

    // Try to create marker immediately
    if (createMarker()) {
      initializationAttempts.current = 0;
      return;
    }

    // If immediate creation fails, try with delays
    const maxAttempts = 5;
    let attemptCount = 0;

    const tryCreateMarker = () => {
      attemptCount++;

      if (createMarker()) {
        initializationAttempts.current = 0;
        return;
      }

      if (attemptCount < maxAttempts) {
        setTimeout(tryCreateMarker, 100 * attemptCount); // Increasing delays
      } else {
        console.warn("Failed to create marker after", maxAttempts, "attempts");
      }
    };

    // Start retry attempts
    const timeout = setTimeout(tryCreateMarker, 100);

    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, [map, position, createMarker, cleanup]);

  // Update marker position when position changes
  useEffect(() => {
    if (markerRef.current && position) {
      const currentPos = markerRef.current.position as google.maps.LatLngLiteral;
      if (!currentPos || currentPos.lat !== position.lat || currentPos.lng !== position.lng) {
        markerRef.current.position = { lat: position.lat, lng: position.lng };
      }
    }
  }, [position]);

  return null;
};
