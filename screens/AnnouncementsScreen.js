import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetAnnouncementsQuery } from '../api/authApi'; // Import the hook

const AnnouncementScreen = () => {
  const navigation = useNavigation();
  const { data: announcements, error, isLoading } = useGetAnnouncementsQuery();
  
  // Handle the error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Handle empty state (no announcements)
  if (!announcements || announcements.results.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No announcements available.</Text>
      </View>
    );
  }

  const handleDownloadDocument = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Error opening document URL:', err);
      Alert.alert('Error', 'Failed to open document. Please try again.');
    });
  };

  return (
    <View style={styles.container}>
      {/* Announcement List */}
      {announcements.results.map((announcement) => (
        <View key={announcement.id} style={styles.announcementCard}>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.content}>{announcement.content}</Text>

          {/* Created By and Last Modified By */}
          <Text style={styles.metadata}>
            Created by: {announcement.created_by.first_name} {announcement.created_by.last_name} ({announcement.created_by.role})
          </Text>
          <Text style={styles.metadata}>
            Last modified by: {announcement.modified_by ? `${announcement.modified_by.first_name} ${announcement.modified_by.last_name}` : 'N/A'}
          </Text>

          {announcement.announcement_document && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownloadDocument(announcement.announcement_document)}
            >
              <Text style={styles.downloadButtonText}>Download Document</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  announcementCard: {
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
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  metadata: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  downloadButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default AnnouncementScreen;
