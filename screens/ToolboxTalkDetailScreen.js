import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useRoute, useNavigation } from '@react-navigation/native';

const ToolboxTalkDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found. Please log in again.');
        }

        const response = await fetch(`https://app.dfwcz.com/api/toolbox-talks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch details. Status: ${response.status}`);
        }

        const data = await response.json();
        setDetails(data);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const downloadPdf = async (url, fileName) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      Alert.alert('Download Complete', `File downloaded to ${uri}`);
    } catch (err) {
      console.error('Error downloading file:', err);
      Alert.alert('Download Error', 'Failed to download file. Please try again.');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{details.title}</Text>
      </View>

      {/* Conduct Toolbox Talk Button */}
      <TouchableOpacity
        style={styles.conductButton}
        onPress={() =>
          navigation.navigate('ConductToolboxTalk', {
            id: details.id, // Pass the ID
            title: details.title, // Pass the title
          })
        }
      >
        <Text style={styles.conductButtonText}>Conduct Toolbox Talk</Text>
      </TouchableOpacity>

      {/* Featured Image */}
      {details.featured_image && (
        <Image
          source={{ uri: details.featured_image }}
          style={styles.featuredImage}
        />
      )}

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {details.content ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: details.content }}
            style={styles.webView}
          />
        ) : (
          <Text style={styles.noContentText}>No content available.</Text>
        )}
      </View>

      {/* PDF Buttons */}
      <View style={styles.pdfContainer}>
        {details.english_pdf && (
          <TouchableOpacity
            style={styles.pdfButton}
            onPress={() => downloadPdf(details.english_pdf, 'English_PDF.pdf')}
          >
            <Text style={styles.pdfButtonText}>Download English PDF</Text>
          </TouchableOpacity>
        )}
        {details.spanish_pdf && (
          <TouchableOpacity
            style={styles.pdfButton}
            onPress={() => downloadPdf(details.spanish_pdf, 'Spanish_PDF.pdf')}
          >
            <Text style={styles.pdfButtonText}>Download Spanish PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  featuredImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  webView: {
    height: 300,
  },
  noContentText: {
    fontSize: 16,
    color: '#777',
  },
  pdfContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pdfButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  pdfButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  conductButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5, // Adds shadow for a professional look
  },
  conductButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
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

export default ToolboxTalkDetailsScreen;
