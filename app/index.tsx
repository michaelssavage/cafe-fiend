// App.js
import { styles } from '@/styles/app.styled';
import { PlaceResult } from '@/types/place';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function HomePage() {
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [coffeeShops, setCoffeeShops] = useState<Array<PlaceResult>>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find nearby coffee shops');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({ latitude, longitude });
      await findNearbyCoffeeShops(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location');
      setLoading(false);
    }
  };

  const findNearbyCoffeeShops = async (latitude: number, longitude: number) => {
    try {
      const radius = 2000;
      const searches = [
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=cafe&key=${GOOGLE_PLACES_API_KEY}`,
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=coffee&key=${GOOGLE_PLACES_API_KEY}`,
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=espresso&key=${GOOGLE_PLACES_API_KEY}`
      ];
      
      const allResults = [];
      const seenPlaceIds = new Set();
      
      for (const url of searches) {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK') {
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
      console.error('Error fetching coffee shops:', error);
      Alert.alert('Error', 'Failed to fetch coffee shops');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const openInMaps = (shop: PlaceResult) => {
    const url = `https://www.google.com/maps/place/?q=place_id:${shop.place_id}`;
    Linking.openURL(url);
  };

  const renderCoffeeShop = ({ item }: { item: PlaceResult }) => {
    const distance = location ? 
      calculateDistance(
        location.latitude, 
        location.longitude, 
        item.geometry.location.lat, 
        item.geometry.location.lng
      ) : 'N/A';

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
                {item.rating ? item.rating.toFixed(1) : 'N/A'}
              </Text>
            </View>
            <Text style={styles.distance}>{distance} km</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coffee Shops Near You</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.activeToggle]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={20} color={viewMode === 'map' ? '#fff' : '#8B4513'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#fff' : '#8B4513'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map View */}
      {viewMode === 'map' && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
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
            />
          ))}
        </MapView>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <FlatList
          data={coffeeShops}
          renderItem={renderCoffeeShop}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Coffee shops count */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            Found {coffeeShops.length} coffee shops nearby
          </Text>
        </View> */}
      </View>
  );
}