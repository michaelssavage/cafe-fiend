import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

interface ClickableMarkerProps {
  position: google.maps.LatLngLiteral;
  setLocation: (position: google.maps.LatLngLiteral) => void;
}

export const ClickableMarker = ({ position, setLocation }: ClickableMarkerProps) => {
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
      try {
        rootRef.current.unmount();
      } catch (error) {
        console.warn("Root unmount error:", error);
      }
      rootRef.current = null;
    }
    containerRef.current = null;
  }, []);

  const createMarker = useCallback(
    (markerPosition: google.maps.LatLngLiteral) => {
      if (!map || !markerLibrary) {
        console.log("Map or markerLibrary not available");
        return false;
      }

      try {
        if (markerRef.current) {
          markerRef.current.map = null;
          markerRef.current = null;
        }
        if (rootRef.current) {
          try {
            rootRef.current.unmount();
          } catch (error) {
            console.warn("Root unmount error during marker creation:", error);
          }
          rootRef.current = null;
        }

        const container = document.createElement("div");
        containerRef.current = container;

        const root = createRoot(container);
        rootRef.current = root;

        root.render(
          <div className="bg-blue-500 border-2 border-blue-800 rounded-full w-8 h-8 grid place-content-center shadow-lg">
            <House size={14} className="text-white" />
          </div>,
        );

        const marker = new markerLibrary.AdvancedMarkerElement({
          map,
          position: { lat: markerPosition.lat, lng: markerPosition.lng },
          gmpDraggable: false,
          content: container,
        });

        markerRef.current = marker;
        console.log("Marker created successfully at:", markerPosition);
        return true;
      } catch (error) {
        console.error("Failed to create marker:", error);
        return false;
      }
    },
    [map, markerLibrary],
  );

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const clickedPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        console.log("Map clicked at:", clickedPosition);
        setLocation(clickedPosition);

        setTimeout(() => {
          createMarker(clickedPosition);
        }, 50); // Small delay to ensure state updates
      }
    };

    // Remove existing listener if any
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
    }

    clickListenerRef.current = map.addListener("click", handleMapClick);

    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [map, setLocation, createMarker]);

  useEffect(() => {
    if (!position || !map || !markerLibrary) return;

    console.log("Position changed to:", position);

    // If we already have a marker, just update its position
    if (markerRef.current) {
      markerRef.current.position = position;
      map.panTo(position);
      console.log("Updated existing marker position");
    } else {
      createMarker(position);
    }
  }, [position, map, markerLibrary, createMarker]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return null;
};
