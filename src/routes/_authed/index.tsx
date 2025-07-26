import { createFileRoute } from "@tanstack/react-router";
import { Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import AutoComplete from "~/components/AutoComplete";
import { DraggableAdvancedMarker } from "~/components/DraggableMarker";
import { Filters } from "~/components/Filters";
import { CafeMarker } from "~/components/Marker";
import { useCafeFinder } from "~/hooks/use-cafe-finder.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { FiltersI } from "~/types/global.type";

export const Route = createFileRoute("/_authed/")({
  component: Home,
});

function Home() {
  const map = useMap();

  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    radius: 2000,
    reviews: 20,
    options: new Set(["nearby"]),
  });

  const { location, setLocation, getCurrentLocation } = useGeolocation();

  const { data, isLoading } = useCafeFinder({
    lat: location?.lat,
    long: location?.lng,
    filters,
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (map && location) map.panTo(location);
  }, [map, location]);

  return (
    <div className="max-w-[900px] mx-auto px-2 pb-3">
      <h1 className="py-4">Cafe Fiend</h1>
      <p className="pb-2 text-lg">Find your next favourite coffee</p>

      <Filters filters={filters} setFilters={setFilters} />

      <div style={{ height: "80vh" }}>
        {location ? (
          <GoogleMap
            mapId="google-maps-id"
            defaultCenter={location}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI
          >
            <AutoComplete onPlaceSelect={setLocation} isLoading={isLoading} />

            <DraggableAdvancedMarker position={location} setLocation={setLocation} />

            <CafeMarker userLocation={location} shops={data} />
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            Loading map...
          </div>
        )}
      </div>
    </div>
  );
}
