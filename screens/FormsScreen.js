import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useGetFormsQuery } from '../api/authApi'; // Adjust the import based on your actual file structure

const FormListScreen = () => {
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Fetch form data using the getForms hook
  const { data, error, isLoading } = useGetFormsQuery();

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

  // Filter data based on search query
  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Form List</Text>
          </View>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Forms"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Submitted Forms Button */}
        <TouchableOpacity
          style={styles.submittedFormsButton}
          onPress={() => {
            console.log('Navigating to Submitted Forms');
            // Add navigation or functionality for "Submitted Forms" here
            navigation.navigate('SubmitForm'); // Replace with your desired screen
          }}
        >
          <Text style={styles.submittedFormsButtonText}>Submitted Forms</Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      <FlatList
        data={filteredData || data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('FormDetail', {
                id: item.id,
                assignment_id: 1, // hardcoded assignment_id
              })
            }
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
              <Text style={styles.itemSubmittedBy}>
                Submitted by: {item.created_by.first_name} {item.created_by.last_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No forms available.</Text>
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
  searchContainer: {
    margin: 20,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  submittedFormsButton: {
    marginTop: 10,
    backgroundColor: '#f2bb13',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submittedFormsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
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
  itemDate: {
    fontSize: 14,
    color: '#777',
  },
  itemSubmittedBy: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f2bb13',
    marginTop: 5,
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

export default FormListScreen;
