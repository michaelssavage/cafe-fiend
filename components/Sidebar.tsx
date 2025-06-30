import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SidebarI {
  setSidebarOpen: (val: boolean) => void;
}

export const Sidebar = ({ setSidebarOpen }: SidebarI) => {
  const router = useRouter();
  const translateX = useSharedValue(250);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate in
    translateX.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, translateX]);

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const closeSidebar = () => {
    // Animate out
    translateX.value = withTiming(250, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setSidebarOpen)(false);
    });
  };

  const navigateToFavorites = () => {
    closeSidebar();
    // Navigate after sidebar closes
    setTimeout(() => {
      router.push("/favorites");
    }, 300);
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 100,
          justifyContent: "flex-start",
          alignItems: "flex-end",
        },
        animatedOverlayStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: 250,
            height: "100%",
            backgroundColor: "#fff",
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          },
          animatedSidebarStyle,
        ]}
      >
        {/* Close Icon */}
        <TouchableOpacity
          onPress={closeSidebar}
          style={{ alignSelf: "flex-end", marginBottom: 20 }}
        >
          <Ionicons name="close-outline" size={28} />
        </TouchableOpacity>

        {/* Favorites Navigation */}
        <TouchableOpacity
          onPress={navigateToFavorites}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: "#f5f5f5",
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="heart"
            size={20}
            color="#8B4513"
            style={{ marginRight: 12 }}
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#8B4513" }}>
            Favorites
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
