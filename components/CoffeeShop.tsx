import { styles } from "@/styles/app.styled";
import { PlaceResult } from "@/utils/place";
import { getFavourites, removeFavourite, saveFavourite } from "@/utils/storage";
import { CoffeeShopI } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

const R = 6371; // Earth's radius in kilometers

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
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

export const CoffeeShop = ({ item, location }: CoffeeShopI) => {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const checkFavourite = async () => {
      const favs = await getFavourites();
      setIsFavourite(favs.some((shop) => shop.place_id === item.place_id));
    };
    checkFavourite();
  }, [item.place_id]);

  const distance = location
    ? calculateDistance(
        location.latitude,
        location.longitude,
        item.geometry.location.lat,
        item.geometry.location.lng
      )
    : "N/A";

  const handleToggleFavourite = async (shop: PlaceResult) => {
    try {
      if (isFavourite) {
        await removeFavourite(shop.place_id);
        setIsFavourite(false);
      } else {
        await saveFavourite(shop);
        setIsFavourite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  return (
    <View style={styles.shopItem}>
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <TouchableOpacity
          onPress={() => openInMaps(item)}
          accessibilityLabel="Open in Maps"
          style={{ padding: 4 }}
        >
          <Ionicons name="map" size={22} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggleFavourite(item)}
          accessibilityLabel={
            isFavourite ? "Remove from Favourites" : "Add to Favourites"
          }
          style={{ padding: 4 }}
        >
          <Ionicons
            name={isFavourite ? "heart" : "heart-outline"}
            size={22}
            color="#e74c3c"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
