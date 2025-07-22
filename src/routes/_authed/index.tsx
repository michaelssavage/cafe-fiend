import { createFileRoute } from "@tanstack/react-router";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useEffect, useState } from "react";
import AutoComplete from "~/components/AutoComplete";
import { Filters } from "~/components/Filters";
import { CafeMarker } from "~/components/Marker";
import { useCoffeeShops } from "~/hooks/use-coffee.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { FiltersI } from "~/types/global.type";

export const Route = createFileRoute("/_authed/")({
  component: Home,
});

function Home() {
  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    radius: 2000,
    reviews: 20,
    showFavorites: false,
  });

  const { location, setLocation, getCurrentLocation } = useGeolocation();

  const { data, isLoading } = useCoffeeShops({
    lat: location?.lat,
    long: location?.lng,
    filters,
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <div className="max-w-[900px] mx-auto">
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

            <AdvancedMarker position={location}>
              <Pin
                background={"#2922ff"}
                borderColor={"#2b1ea1"}
                glyphColor={"#0f237a"}
              >
                <House size={14} color="#ffffff" />
              </Pin>
            </AdvancedMarker>

            {data && data?.results?.length > 0 ? (
              <CafeMarker userLocation={location} shops={data?.results} />
            ) : (
              <></>
            )}
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
