import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useGetDocumentsQuery } from '../api/authApi'; // Hook to fetch documents
import { useNavigation } from '@react-navigation/native';

const DocumentScreen = () => {
  const navigation = useNavigation();

  const { data, isLoading, error, refetch } = useGetDocumentsQuery(); // Fetch documents

  useEffect(() => {
    refetch(); // Refetch documents on component mount
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.project}>Project: {item.project.name}</Text>
      <Text style={styles.tags}>
        Tags: {item.document_tags ? item.document_tags : 'None'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DocumentsDetail', { id: item.id })} // Navigate to detail screen
      >
        <Text style={styles.buttonText}>View Document</Text>
      </TouchableOpacity>
      <Text style={styles.timestamp}>
        Created At: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Failed to load documents</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.results || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No documents available</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  project: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  tags: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f2bb13',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    marginTop: 10,
    fontSize: 12,
    color: '#777',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DocumentScreen;
