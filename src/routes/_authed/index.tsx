import { createFileRoute } from "@tanstack/react-router";
import { Home03 } from "@untitled-ui/icons-react/";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { ShopMarker } from "~/components/shop-marker/ShopMarker";
import { useCoffeeShops } from "~/hooks/use-coffee.hook";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { Container, Flexbox } from "~/styles/global.styles";
import { FiltersI } from "~/types/global.type";

export const Route = createFileRoute("/_authed/")({
  component: Home,
});

function Home() {
  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    radius: 2000,
    reviews: 20,
  });

  const {
    location,
    error: locationError,
    loading,
    getCurrentLocation,
  } = useGeolocation();

  const {
    favorites,
    isFavorite,
    saveFavorite,
    removeFavorite,
    isSaving,
    isRemoving,
  } = useFavorites();

  const handleToggleFavorite = (placeId: string, name: string) => {
    console.log(
      "Toggle favorite - placeId:",
      placeId,
      "name:",
      name,
      "isFavorite:",
      isFavorite(placeId)
    );
    if (isFavorite(placeId)) {
      console.log("Calling removeFavorite");
      removeFavorite(placeId);
    } else {
      console.log("Calling saveFavorite");
      saveFavorite(placeId, name);
    }
  };

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
        <p>Find your next favourite coffee</p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={!!location || loading}
        >
          {loading ? "Loading..." : "Get Location"}
        </button>
      </Flexbox>

      {isLoading && <p>Loading coffee shops...</p>}
      {locationError && <p>Failed to get user location</p>}
      <div style={{ height: "500px" }}>
        <GoogleMap
          mapId="google-maps-id"
          defaultCenter={location}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
        >
          <AdvancedMarker position={location}>
            <Pin
              background={"#2922ff"}
              borderColor={"#2b1ea1"}
              glyphColor={"#0f237a"}
            >
              <Home03 width={14} height={14} color="#ffffff" />
            </Pin>
          </AdvancedMarker>

          {data && data?.results?.length > 0 ? (
            <ShopMarker
              shops={data?.results}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isSaving={isSaving}
              isRemoving={isRemoving}
            />
          ) : (
            <></>
          )}
        </GoogleMap>
      </div>
    </Container>
  );
}
