import { createFileRoute } from "@tanstack/react-router";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const position = { lat: 41.38879, lng: 2.15899 };

function HomeComponent() {
  return (
    <APIProvider apiKey={key}>
      <h1>Cafe Fiend</h1>
      <p>Find your next favourite coffee</p>

      <div style={{ height: "400px", width: "50vw" }}>
        <GoogleMap
          defaultCenter={position}
          defaultZoom={13}
          mapId="google-maps-id"
        >
          <AdvancedMarker position={position} />
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
