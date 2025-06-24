import { CoffeeShop } from "@/components/CoffeeShop";
import { styles } from "@/styles/app.styled";
import {
  DISTANCE_FILTERS,
  RATING_FILTERS,
  REVIEWS_FILTERS,
} from "@/utils/constants";
import { PlaceResult } from "@/utils/place";
import { LocationType } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function HomePage() {
  const flatListRef = useRef<FlatList>(null);

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationType>(null);
  const [coffeeShops, setCoffeeShops] = useState<Array<PlaceResult>>([]);
  const [filters, setFilters] = useState({
    rating: 4.0,
    distance: 2000,
    reviews: 20,
  });

  const listHeight = useSharedValue(300);
  const startHeight = useSharedValue(300);
  const animatedStyle = useAnimatedStyle(() => {
    return { height: listHeight.value };
  });

  const findNearbyCoffeeShops = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const radius = filters.distance;
        const searches = [
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=cafe&key=${GOOGLE_PLACES_API_KEY}`,
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=coffee&key=${GOOGLE_PLACES_API_KEY}`,
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=espresso&key=${GOOGLE_PLACES_API_KEY}`,
        ];

        const allResults = [];
        const seenPlaceIds = new Set();

        for (const url of searches) {
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === "OK") {
            const newResults = data.results.filter((place: PlaceResult) => {
              // Check for duplicates
              if (seenPlaceIds.has(place.place_id)) return false;

              const hasGoodRating =
                place.rating && place.rating > filters.rating;
              const hasEnoughReviews =
                place.user_ratings_total &&
                place.user_ratings_total > filters.rating;

              if (hasGoodRating && hasEnoughReviews) {
                seenPlaceIds.add(place.place_id);
                return true;
              }

              return false;
            });
            allResults.push(...newResults);
          }
        }

        setCoffeeShops(allResults);
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
        Alert.alert("Error", "Failed to fetch coffee shops");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const getCurrentLocation = useCallback(async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to find nearby coffee shops"
        );
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({ latitude, longitude });
      await findNearbyCoffeeShops(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location");
      setLoading(false);
    }
  }, [findNearbyCoffeeShops]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const scrollToShop = (shopIndex: number) => {
    if (
      flatListRef.current &&
      shopIndex >= 0 &&
      shopIndex < coffeeShops.length
    ) {
      flatListRef.current.scrollToIndex({
        index: shopIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    // Fallback: scroll to the highest measured frame, then try again
    flatListRef.current?.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: true,
    });

    // Try again after a short delay
    setTimeout(() => {
      if (flatListRef.current && info.index < coffeeShops.length) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, 100);
  };

  const handleFilterChange = ({
    key,
    value,
  }: {
    key: string;
    value: number;
  }) => {
    setFilters((f) => ({ ...f, [key]: value }));
    if (location) findNearbyCoffeeShops(location.latitude, location.longitude);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = listHeight.value;
    })
    .onUpdate((event) => {
      listHeight.value = Math.max(
        100,
        Math.min(500, startHeight.value - event.translationY)
      );
    })
    .onEnd(() => {
      if (listHeight.value < 120) {
        listHeight.value = withSpring(100, {
          damping: 20,
          stiffness: 200,
        });
      } else {
        listHeight.value = withSpring(listHeight.value, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Finding coffee shops near you...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="location-outline" size={48} color="#666" />
        <Text style={styles.errorText}>Unable to get your location</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={getCurrentLocation}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coffee Shops Near You</Text>
        {/* Filter Dropdowns */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 10,
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

      {/* Map View */}
      <MapView
        style={[styles.map, { flex: 1 }]}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {coffeeShops.map((shop, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: shop.geometry.location.lat,
              longitude: shop.geometry.location.lng,
            }}
            title={shop.name}
            description={shop.vicinity}
            pinColor="#8B4513"
            onPress={() => scrollToShop(index)}
          />
        ))}
      </MapView>

      <Animated.View style={[styles.draggableListContainer, animatedStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>
        </GestureDetector>

        {/* List */}
        <FlatList
          ref={flatListRef}
          keyExtractor={(_item, index) => index.toString()}
          data={coffeeShops}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScrollToIndexFailed={onScrollToIndexFailed}
          renderItem={({ item }) => (
            <CoffeeShop item={item} location={location} />
          )}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
}
