export interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  vicinity: string; // Address without country/postal code
  types: Array<string>; // e.g., ["cafe", "food", "point_of_interest", "establishment"]
  rating?: number; // 1.0 to 5.0
  user_ratings_total?: number;
  price_level?: number; // 0 (free) to 4 (very expensive)
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: Array<string>;
  }>;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  reference: string; // Deprecated, use place_id instead
  scope: string;
  icon?: string; // URL to icon
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  business_status?: "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY";
  permanently_closed?: boolean; // Deprecated
}
