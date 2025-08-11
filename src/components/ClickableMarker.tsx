import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

interface ClickableMapProps {
  position: google.maps.LatLngLiteral;
  setLocation: (position: google.maps.LatLngLiteral) => void;
}

export const ClickableMarker = ({ position, setLocation }: ClickableMapProps) => {
  const map = useMap();
  const markerLibrary = useMapsLibrary("marker");

  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const cleanup = useCallback(() => {
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
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

  const createMarker = useCallback(
    (markerPosition: google.maps.LatLngLiteral) => {
      if (!map || !markerLibrary) {
        return false;
      }

      try {
        // Clean up existing marker
        if (markerRef.current) {
          markerRef.current.map = null;
          markerRef.current = null;
        }
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }

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
          position: { lat: markerPosition.lat, lng: markerPosition.lng },
          gmpDraggable: false, // Disable dragging
          content: container,
        });

        markerRef.current = marker;

        console.log("Marker created successfully at:", markerPosition);
        return true;
      } catch (error) {
        console.error("Failed to create marker:", error);
        cleanup();
        return false;
      }
    },
    [map, markerLibrary, cleanup],
  );

  // Handle map clicks
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const clickedPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        setLocation(clickedPosition);
        createMarker(clickedPosition);
      }
    };

    clickListenerRef.current = map.addListener("click", handleMapClick);

    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [map, setLocation, createMarker]);

  // Create initial marker if position exists
  useEffect(() => {
    if (!map || !position || !markerLibrary) return;

    createMarker(position);

    return () => cleanup();
  }, [map, position, markerLibrary, createMarker, cleanup]);

  // Update marker position when position prop changes
  useEffect(() => {
    if (!map || !position || !markerRef.current) return;

    markerRef.current.position = position;
    map.panTo(position);
  }, [position, map]);

  return null;
};
