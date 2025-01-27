import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { useGetSdsSearchQuery } from "../api/authApi";
import { useNavigation } from '@react-navigation/native';

const SdsSearchScreen = () => {
  const { data, isLoading, error, refetch } = useGetSdsSearchQuery();
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    refetch();
  }, []);

  const handleDownload = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.sdsName}>{item.name}</Text>
      <Text style={styles.lastSourcedLabel}>Last Sourced</Text>
      <Text style={styles.lastSourcedDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(item.sds_pdf)}
      >
        <Text style={styles.downloadButtonText}>Download SDS</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.title}>SDS Search</Text>

      {/* SDS List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          !isLoading && <Text style={styles.noData}>No SDS available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light background
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f2bb13",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff", // Card background
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  sdsName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  lastSourcedLabel: {
    fontSize: 14,
    color: "#555",
  },
  lastSourcedDate: {
    fontSize: 14,
    color: "#f2bb13",
    fontWeight: "500",
    marginBottom: 15, // Add space before the button
  },
  downloadButton: {
    backgroundColor: "#f2bb13", // Highlight color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noData: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#555",
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f2bb13",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});

export default SdsSearchScreen;
