import { styles } from "@/styles/app.styled";
import {
  DISTANCE_FILTERS,
  RATING_FILTERS,
  REVIEWS_FILTERS,
} from "@/utils/constants";
import { FiltersType, LocationType } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface HeaderI {
  filters: FiltersType;
  loading: boolean;
  location: LocationType;
  setSidebarOpen: (val: boolean) => void;
  setFilters: (val: FiltersType | ((prev: FiltersType) => FiltersType)) => void;
  findNearbyCoffeeShops: (a: number, b: number) => void;
}

interface FilterChangeI {
  key: keyof FiltersType;
  value: number;
}

export const Header = ({
  filters,
  loading,
  location,
  setSidebarOpen,
  setFilters,
  findNearbyCoffeeShops,
}: HeaderI) => {
  const handleFilterChange = ({ key, value }: FilterChangeI) => {
    setFilters((f) => ({ ...f, [key]: value }));
    if (location) findNearbyCoffeeShops(location.latitude, location.longitude);
  };

  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 6,
          }}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              color="#8B4513"
              style={{ marginTop: 5 }}
            />
          )}
          <Text style={styles.headerTitle}>Coffee Shops Near You</Text>
        </View>

        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu-outline" size={28} />
        </TouchableOpacity>
      </View>
      {/* Filter Dropdowns */}
      <View
        style={{
          ...styles.flexBox,
          marginTop: 10,
        }}
      >
        {/* Rating Filter */}
        <Dropdown
          style={{ flex: 1 }}
          data={RATING_FILTERS}
          labelField="label"
          valueField="value"
          placeholder="Rating"
          value={filters.rating}
          onChange={(v) =>
            handleFilterChange({ key: "rating", value: v.value })
          }
        />
        {/* Distance Filter */}
        <Dropdown
          style={{ flex: 1 }}
          data={DISTANCE_FILTERS}
          labelField="label"
          valueField="value"
          placeholder="Distance"
          value={filters.distance}
          onChange={(v) =>
            handleFilterChange({ key: "distance", value: v.value })
          }
        />
        {/* Reviews Filter */}
        <Dropdown
          style={{ flex: 1 }}
          data={REVIEWS_FILTERS}
          labelField="label"
          valueField="value"
          placeholder="Reviews"
          value={filters.reviews}
          onChange={(v) =>
            handleFilterChange({ key: "reviews", value: v.value })
          }
        />
      </View>
    </View>
  );
};
