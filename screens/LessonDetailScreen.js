import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  const regExp = /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+[\?&]v=|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11}))$/;
  const match = url.match(regExp);
  return match ? match[1] || match[2] : null;
};

const LessonDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, lessonVideo } = route.params; // lessonVideo will contain the YouTube URL
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Session Expired', 'Please log in again.');
        navigation.navigate('Login');
      } else {
        setAuthToken(token);
      }
    };
    fetchAuthToken();
  }, []);

  if (!authToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Authenticating...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Extract YouTube video ID
  const videoId = getYouTubeVideoId(lessonVideo);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Lesson Details</Text>
      </View>

      {/* WebView for YouTube Video Section */}
      {lessonVideo && videoId ? (
        <View style={{ height: 200, width: '100%' }}>
          <WebView
            source={{
              uri: `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&modestbranding=1`,
            }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
          />
        </View>
      ) : (
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>No video available for this lesson.</Text>
        </View>
      )}

      {/* Attempt Quiz Button */}
      <TouchableOpacity
        style={styles.attemptButton}
        onPress={() => {
            if (id) {
              navigation.navigate('LessonProgress', { id }); // Pass id correctly
            } else {
              Alert.alert('Error', 'Lesson ID not found!');
            }
          }}      >
        <Text style={styles.attemptButtonText}>Attempt Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#f2bb13',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  noVideoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  noVideoText: {
    fontSize: 16,
    color: '#777',
  },
  attemptButton: {
    backgroundColor: '#28a745', // Green color
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5,
  },
  attemptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
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
});

export default LessonDetailsScreen;
