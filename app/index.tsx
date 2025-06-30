import { CoffeeShop } from "@/components/CoffeeShop";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { styles } from "@/styles/app.styled";
import { PlaceResult } from "@/utils/place";
import { getFavourites } from "@/utils/storage";
import { FiltersType, LocationType } from "@/utils/types";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, View } from "react-native";
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
  const [filters, setFilters] = useState<FiltersType>({
    rating: 4.0,
    distance: 2000,
    reviews: 20,
  });
  const [favouriteIds, setFavouriteIds] = useState<Array<string>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const listHeight = useSharedValue(300);
  const startHeight = useSharedValue(300);
  const animatedStyle = useAnimatedStyle(() => {
    return { height: listHeight.value };
  });

  const addCoffeeShops = useCallback((newResults: Array<PlaceResult>) => {
    setCoffeeShops((prev) => {
      const seen = new Set(prev.map((p) => p.place_id));
      const filtered = newResults.filter((place) => !seen.has(place.place_id));
      return [...prev, ...filtered];
    });
  }, []);

  const findNearbyCoffeeShops = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setCoffeeShops([]); // Clear previous results
        setLoading(true);
        const radius = filters.distance;
        const searches = [
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=cafe&key=${GOOGLE_PLACES_API_KEY}`,
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=coffee&key=${GOOGLE_PLACES_API_KEY}`,
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=espresso&key=${GOOGLE_PLACES_API_KEY}`,
        ];

        const seenPlaceIds = new Set();
        let fetchCount = 0;
        for (const url of searches) {
          fetchCount++;
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "OK") {
                const newResults = data.results.filter((place: PlaceResult) => {
                  if (seenPlaceIds.has(place.place_id)) return false;
                  const hasGoodRating =
                    place.rating && place.rating > filters.rating;
                  const hasEnoughReviews =
                    place.user_ratings_total &&
                    place.user_ratings_total > filters.reviews;
                  if (hasGoodRating && hasEnoughReviews) {
                    seenPlaceIds.add(place.place_id);
                    return true;
                  }
                  return false;
                });
                addCoffeeShops(newResults);
              }
            })
            .catch((error) => {
              console.error("Error fetching coffee shops:", error);
            })
            .finally(() => {
              fetchCount--;
              if (fetchCount === 0) setLoading(false);
            });
        }
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
        Alert.alert("Error", "Failed to fetch coffee shops");
        setLoading(false);
      }
    },
    [filters, addCoffeeShops]
  );

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to find nearby coffee shops"
        );
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });
      findNearbyCoffeeShops(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location");
      setLoading(false);
    }
  }, [findNearbyCoffeeShops]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const syncFavourites = async () => {
      const favs = await getFavourites();
      setFavouriteIds(favs.map((f) => f.place_id));
    };
    syncFavourites();
  }, [coffeeShops]);

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

  const defaultRegion = {
    latitude: 41.38879, // Barcelona
    longitude: 2.15899,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getRegion = () => {
    if (
      location &&
      typeof location.latitude === "number" &&
      typeof location.longitude === "number"
    ) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return defaultRegion;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {sidebarOpen && <Sidebar setSidebarOpen={setSidebarOpen} />}
      {/* Header */}
      <Header
        filters={filters}
        loading={loading}
        location={location}
        setSidebarOpen={setSidebarOpen}
        setFilters={setFilters}
        findNearbyCoffeeShops={findNearbyCoffeeShops}
      />

      {/* Map View */}
      <MapView
        style={[styles.map, { flex: 1 }]}
        initialRegion={getRegion()}
        region={getRegion()}
        showsUserLocation={!!location}
        showsMyLocationButton
      >
        {coffeeShops.map((shop, index) => {
          const pinColor = favouriteIds.includes(shop.place_id)
            ? "#144ba9"
            : "#8B4513";

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: shop.geometry.location.lat,
                longitude: shop.geometry.location.lng,
              }}
              title={shop.name}
              description={shop.vicinity}
              pinColor={pinColor}
              onPress={() => scrollToShop(index)}
            />
          );
        })}
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
