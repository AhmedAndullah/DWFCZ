import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { useGetUserProfileQuery, useLogoutMutation } from '../api/authApi'; // Hook to fetch profile data
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import eventEmitter from '../eventEmitter';

const ProfileScreen = () => {
  const { data, error, isLoading } = useGetUserProfileQuery();
  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to load profile data');
    }
  }, [error]);

  const handleSignOut = async () => {
    try {
        await AsyncStorage.removeItem('authToken'); // Remove token
        eventEmitter.emit('tokenChanged'); // Notify App.js about the token change
        Alert.alert('Success', 'You have been signed out.');
    } catch (err) {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
};



  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const {
    email,
    first_name,
    last_name,
    phone_number,
    address,
    role,
    image,
    employee_no,
    date_of_birth,
    company,
  } = data || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: image || 'https://via.placeholder.com/120' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{first_name} {last_name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{phone_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{address || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{date_of_birth ? new Date(date_of_birth).toLocaleDateString() : 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Employee No:</Text>
          <Text style={styles.value}>{employee_no}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Company:</Text>
          <Text style={styles.value}>{company?.name || 'N/A'}</Text>
        </View>
      </View>
      {/* Sign-Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#f2bb13',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#f2bb13',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    maxWidth: '60%',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default ProfileScreen;
