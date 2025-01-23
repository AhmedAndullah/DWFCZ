import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetDocumentsQuery } from '../api/authApi';

const DocumentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Get document ID from route params
  const { data, isLoading, error } = useGetDocumentsQuery(); // Fetch documents
  const [document, setDocument] = useState(null);

  useEffect(() => {
    if (data) {
      const selectedDocument = data.results.find((doc) => doc.id === id);
      if (selectedDocument) {
        setDocument(selectedDocument);
      } else {
        Alert.alert('Error', 'Document not found.');
      }
    }
    if (error) {
      Alert.alert('Error', 'Failed to fetch document data.');
    }
  }, [data, id, error]);

  const handleDownloadDocument = async (url, fileName) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.downloadAsync(url, fileUri);
      Alert.alert('Download Complete', `File downloaded to ${fileUri}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to download the document.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Document not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* View Document Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() =>
          handleDownloadDocument(
            document.document_files,
            `${document.name.replace(/\s+/g, '_')}.pdf`
          )
        }
      >
        <Text style={styles.downloadButtonText}>Download Document</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{document.name}</Text>

        <Text style={styles.sectionTitle}>Description:</Text>
        <Text style={styles.description}>{document.description}</Text>

        <Text style={styles.sectionTitle}>Project:</Text>
        <Text style={styles.detailText}>{document.project.name}</Text>

        <Text style={styles.sectionTitle}>Companies:</Text>
        {document.companies.length > 0 ? (
          document.companies.map((company) => (
            <Text key={company.id} style={styles.detailText}>
              {company.name}
            </Text>
          ))
        ) : (
          <Text style={styles.detailText}>No associated companies.</Text>
        )}

        <Text style={styles.sectionTitle}>Created By:</Text>
        <Text style={styles.detailText}>
          {document.created_by.first_name} {document.created_by.last_name}
        </Text>

        <Text style={styles.timestamp}>
          Created At: {new Date(document.created_at).toLocaleDateString()}
        </Text>
      </View>

      {document.related_equipments && document.related_equipments.length > 0 && (
        <View style={styles.relatedContainer}>
          <Text style={styles.sectionTitle}>Related Equipment:</Text>
          {document.related_equipments.map((equipment) => (
            <TouchableOpacity
              key={equipment.id}
              style={styles.equipmentItem}
              onPress={() => navigation.navigate('EquipmentDetail', { id: equipment.id })}
            >
              <Text style={styles.equipmentText}>{equipment.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f2bb13',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
    marginTop: 10,
  },
  downloadButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  relatedContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  equipmentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  equipmentText: {
    fontSize: 16,
    color: '#f2bb13',
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

export default DocumentDetailScreen;
