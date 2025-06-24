import { styles } from "@/styles/app.styled";
import { PlaceResult } from "@/types/place";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const ITEM_HEIGHT = 80;

export default function HomePage() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [coffeeShops, setCoffeeShops] = useState<Array<PlaceResult>>([]);
  const [loading, setLoading] = useState(true);
  const [listHeight, setListHeight] = useState(300);
  const flatListRef = useRef<FlatList>(null);

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
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const findNearbyCoffeeShops = async (latitude: number, longitude: number) => {
    try {
      const radius = 2000;
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
            if (seenPlaceIds.has(place.place_id)) return false;
            seenPlaceIds.add(place.place_id);
            return true;
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
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const openInMaps = async (shop: PlaceResult) => {
    try {
      const nativeUrl = `maps:${shop.geometry.location.lat},${
        shop.geometry.location.lng
      }?q=${encodeURIComponent(shop.name)}`;
      const canOpen = await Linking.canOpenURL(nativeUrl);

      if (canOpen) {
        await Linking.openURL(nativeUrl);
      } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${shop.geometry.location.lat},${shop.geometry.location.lng}&query_place_id=${shop.place_id}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Error opening in maps:", error);
      const fallbackUrl = `https://www.google.com/maps/search/${encodeURIComponent(
        shop.name + " " + shop.vicinity
      )}`;
      Linking.openURL(fallbackUrl);
    }
  };

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

  // Add getItemLayout for FlatList
  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // Add onScrollToIndexFailed handler
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

  const renderCoffeeShop = ({
    item,
    index,
  }: {
    item: PlaceResult;
    index: number;
  }) => {
    const distance = location
      ? calculateDistance(
          location.latitude,
          location.longitude,
          item.geometry.location.lat,
          item.geometry.location.lng
        )
      : "N/A";

    return (
      <TouchableOpacity
        style={styles.shopItem}
        onPress={() => openInMaps(item)}
      >
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.name}</Text>
          <Text style={styles.shopAddress}>{item.vicinity}</Text>
          <View style={styles.shopDetails}>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.rating ? item.rating.toFixed(1) : "N/A"}
              </Text>
            </View>
            <Text style={styles.distance}>{distance} km</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newHeight = Math.max(
        100,
        Math.min(500, listHeight - event.translationY)
      );
      setListHeight(newHeight);
    })
    .onEnd(() => {
      // Snap to either collapsed or expanded state
      const shouldCollapse = listHeight < 200;
      setListHeight(shouldCollapse ? 100 : 300);
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

      {/* Draggable List */}
      <View style={[styles.draggableListContainer, { height: listHeight }]}>
        {/* Drag Handle */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>
        </GestureDetector>

        {/* List */}
        <FlatList
          ref={flatListRef}
          data={coffeeShops}
          renderItem={renderCoffeeShop}
          keyExtractor={(_item, index) => index.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
        />
      </View>
    </GestureHandlerRootView>
  );
}
