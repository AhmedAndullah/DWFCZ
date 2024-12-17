// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from 'react-native';
import { useGetSdsSearchQuery } from '../api/authApi';

const SdsSearchScreen = () => {
  const { data, isLoading, error, refetch } = useGetSdsSearchQuery();

  useEffect(() => {
    refetch(); // Fetch the data when the component mounts
  }, []);

  const handleDownload = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.sdsName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(item.sds_pdf)}
      >
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SDS Search</Text>

      {isLoading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.error}>Error: Failed to fetch data</Text>}

      {data?.results?.length > 0 ? (
        <FlatList
          data={data.results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <Text style={styles.noData}>No SDS available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f2bb13',
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#555',
  },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  sdsName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  noData: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default SdsSearchScreen;
