import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetCorrectiveActionsQuery } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';

const CorrectiveActionsScreen = () => {
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        setAuthToken(token);
      }
    };
    fetchAuthToken();
  }, []);

  const { data, error, isLoading } = useGetCorrectiveActionsQuery(undefined, {
    skip: !authToken,
  });

  if (!authToken || isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error('API Error:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  const renderActionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('CorrectiveActionsDetails', { id: item.id })
      }
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.deficiency}</Text>
        <Text style={styles.itemSubtitle}>
          Severity: {item.severity} | Status: {item.status}
        </Text>
        <Text style={styles.itemDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Corrective Actions</Text>
      </View>
  
      {/* Add Corrective Action Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCorrectiveAction')}
      >
        <Text style={styles.addButtonText}>Create Corrective Actions</Text>
      </TouchableOpacity>
  
      <FlatList
        data={data?.results || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActionItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No corrective actions found.</Text>
          </View>
        )}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#f2bb13',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#f2bb13', // Same color as header
    alignSelf: 'flex-end',
    margin: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 12,
    color: '#555',
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
    color: '#d9534f',
    marginTop: 20,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'ios' ? 50 : 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: '#f2bb13',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default CorrectiveActionsScreen;
