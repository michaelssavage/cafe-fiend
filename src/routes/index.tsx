import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { findNearbyCoffeeShops } from "../lib/get-nearby-cafes.api";
import { defaultPosition } from "../utils/constant";
import type { FiltersI } from "../utils/global.types";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function HomeComponent() {
  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    distance: 2000,
    reviews: 20,
  });

  const { isLoading, data, isError } = useQuery({
    queryKey: ["coffee", filters],
    queryFn: () =>
      findNearbyCoffeeShops({
        latitude: defaultPosition.lat,
        longitude: defaultPosition.lng,
        filters,
      }),
  });

  console.log("Coffee shops:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", isError);

  return (
    <APIProvider apiKey={key}>
      <h1>Cafe Fiend</h1>
      <p>Find your next favourite coffee</p>

      {isLoading && <p>Loading coffee shops...</p>}
      <div style={{ height: "400px", width: "50vw" }}>
        <GoogleMap
          defaultCenter={defaultPosition}
          defaultZoom={13}
          mapId="google-maps-id"
        >
          <AdvancedMarker position={defaultPosition} />
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
