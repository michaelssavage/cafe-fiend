import { createFileRoute } from "@tanstack/react-router";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import AutoComplete from "~/components/auto-complete/AutoComplete";
import { ShopMarker } from "~/components/shop-marker/ShopMarker";
import { useCoffeeShops } from "~/hooks/use-coffee.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { Container, Flexbox } from "~/styles/global.styles";
import { FiltersI } from "~/types/global.type";
import {
  RADIUS_OPTIONS,
  RATING_OPTIONS,
  REVIEWS_OPTIONS,
} from "~/utils/constants";

export const Route = createFileRoute("/_authed/")({
  component: Home,
});

function Home() {
  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    radius: 2000,
    reviews: 20,
  });

  const handleFilter = useCallback(
    (key: string, value?: number) =>
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      })),
    []
  );

  const { location, setLocation, getCurrentLocation } = useGeolocation();

  const { data, isLoading } = useCoffeeShops({
    lat: location.lat,
    long: location.lng,
    filters,
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <Container>
      <h1>Cafe Fiend</h1>
      <Flexbox direction="row" align="center" gap="1rem">
        <p>Find your next favourite coffee:</p>

        <Select
          value={REVIEWS_OPTIONS.find(({ value }) => value === filters.reviews)}
          options={REVIEWS_OPTIONS}
          onChange={(r) => handleFilter("reviews", r?.value)}
        />

        <Select
          value={RATING_OPTIONS.find(({ value }) => value === filters.rating)}
          options={RATING_OPTIONS}
          onChange={(r) => handleFilter("rating", r?.value)}
        />

        <Select
          value={RADIUS_OPTIONS.find(({ value }) => value === filters.radius)}
          options={RADIUS_OPTIONS}
          onChange={(r) => handleFilter("radius", r?.value)}
        />
      </Flexbox>
      <div style={{ height: "80vh" }}>
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
            <ShopMarker userLocation={location} shops={data?.results} />
          ) : (
            <></>
          )}
        </GoogleMap>
      </div>
    </Container>
  );
}
