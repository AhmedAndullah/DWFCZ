import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetCorrectiveActionsDetailQuery } from '../api/authApi';
import { useRoute, useNavigation } from '@react-navigation/native';


const CorrectiveActionDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [authToken, setAuthToken] = useState(null);

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

  const { data, error, isLoading } = useGetCorrectiveActionsDetailQuery(id, {
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

  const {
    deficiency,
    action_taken,
    deficiency_type,
    severity,
    status,
    created_at,
    photos,
  } = data;

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
  
      <View style={styles.card}>
        <View style={styles.headerSection}>
          <Text style={styles.deficiencyTitle}>{deficiency}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.label}>Deficiency:</Text>
          <Text style={styles.value}>{deficiency}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>
            {new Date(created_at).toLocaleDateString()}
          </Text>
        </View>
  
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date Completed:</Text>
          <Text style={styles.value}>
            {new Date(created_at).toLocaleDateString()}
          </Text>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Deficiency</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              <Text style={styles.bold}>Severity:</Text> {severity}
            </Text>
            <Text style={styles.highlightText}>
              <Text style={styles.bold}>Deficiency Type:</Text> {deficiency_type}
            </Text>
          </View>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Action Taken</Text>
          <View style={styles.highlightBoxGreen}>
            <Text style={styles.highlightText}>{action_taken}</Text>
          </View>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.value}>
            {photos && photos.length > 0 ? 'Photos Available' : 'No Photos Available'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deficiencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#fff3cd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  highlightBox: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 4,
  },
  highlightBoxGreen: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
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
    paddingHorizontal: 20,
  },
  backButton: {
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2bb13',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default CorrectiveActionDetailsScreen;
