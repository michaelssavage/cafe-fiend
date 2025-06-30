import { CoffeeShop } from "@/components/CoffeeShop";
import { styles } from "@/styles/app.styled";
import { PlaceResult } from "@/utils/place";
import { getFavourites } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Array<PlaceResult>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await getFavourites();
      setFavorites(favs);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          ...styles.header,
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {/* Favorites List */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading favorites...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>No favorites yet</Text>
          <Text style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
            Add some coffee shops to your favorites!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.place_id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <CoffeeShop item={item} location={null} />}
        />
      )}
    </View>
  );
}
