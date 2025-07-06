import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { ShopMarker } from "../components/shop-marker/ShopMarker";
import { useGeolocation } from "../hooks/use-location.hook";
import { findNearbyCoffeeShops } from "../lib/get-nearby-cafes.api";
import { Container } from "../styles/global.styled";
import type { FiltersI } from "../utils/global.types";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function HomeComponent() {
  const { location, error, loading, getCurrentLocation } = useGeolocation();

  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    distance: 2000,
    reviews: 20,
  });

  const { isLoading, data } = useQuery({
    queryKey: ["coffee", filters, location],
    queryFn: () =>
      findNearbyCoffeeShops({
        latitude: location.lat,
        longitude: location.lng,
        filters,
      }),
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  console.log("!!!", data);

  return (
    <APIProvider apiKey={key}>
      <Container>
        <h1>Cafe Fiend</h1>
        <p>Find your next favourite coffee</p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={!!error || loading}
        >
          {loading ? "Loading..." : "Get Location"}
        </button>

        {isLoading && <p>Loading coffee shops...</p>}
        <div style={{ height: "500px" }}>
          <GoogleMap
            defaultCenter={location}
            defaultZoom={13}
            mapId="google-maps-id"
          >
            <AdvancedMarker position={location}>
              <Pin
                background={"#22ccff"}
                borderColor={"#1e89a1"}
                glyphColor={"#0f677a"}
              >
                <FaRegUser />
              </Pin>
            </AdvancedMarker>
            {data ? (
              data.map((shop, index) => {
                return <ShopMarker key={index} shop={shop} index={index} />;
              })
            ) : (
              <></>
            )}
          </GoogleMap>
        </div>
      </Container>
    </APIProvider>
  );
}
