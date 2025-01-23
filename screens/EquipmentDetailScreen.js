import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetEquipmentQuery } from '../api/authApi';
import * as FileSystem from 'expo-file-system';

const EquipmentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Equipment ID

  const { data, isLoading, error, refetch } = useGetEquipmentQuery(); // Query to fetch equipment data

  const [equipment, setEquipment] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false); // To toggle photo visibility

  // Fetch data whenever `id` changes
  useEffect(() => {
    if (data) {
      const selectedEquipment = data.results.find((item) => item.id === id);
      setEquipment(selectedEquipment);
    }
  }, [data, id]);

  const handleDocumentDownload = async (url, fileName) => {
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

  if (error || !equipment) {
    Alert.alert('Error', 'Failed to load equipment details.');
    return null;
  }

  const calculateNextInspectionDate = (lastDate, interval) => {
    const date = new Date(lastDate);
    switch (interval) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return 'Unknown';
    }
    return date.toISOString().split('T')[0];
  };

  const nextInspectionDate = calculateNextInspectionDate(
    equipment.last_inspection_date,
    equipment.inspection_interval
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{equipment.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: equipment.status === 'out_of_service' ? '#d9534f' : '#28a745' },
          ]}
        >
          <Text style={styles.statusText}>
            {equipment.status === 'out_of_service' ? 'OUT OF SERVICE' : 'IN SERVICE'}
          </Text>
        </View>
      </View>

      {/* Equipment Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Serial Number:</Text>
          <Text style={styles.value}>{equipment.serial_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Model Number:</Text>
          <Text style={styles.value}>{equipment.model_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Assigned To:</Text>
          <Text style={styles.link}>
            {equipment.assigned_worker.first_name} {equipment.assigned_worker.last_name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Project:</Text>
          <Text style={styles.link}>{equipment.project.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Manufacturer:</Text>
          <Text style={styles.value}>{equipment.manufacturer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>In Service Date:</Text>
          <Text style={styles.value}>{new Date(equipment.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Inspection Interval:</Text>
          <Text style={styles.value}>{equipment.inspection_interval}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Companies:</Text>
          <Text style={styles.value}>
            {equipment.companies.map((company) => company.name).join(', ')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Last Inspected:</Text>
          <Text style={styles.value}>{equipment.last_inspection_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Next Inspection Date:</Text>
          <Text style={styles.overdue}>
            {nextInspectionDate}{' '}
            {new Date(nextInspectionDate) < new Date() && '(Overdue)'}
          </Text>
        </View>
      </View>

      {/* Photos Dropdown */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowPhotos(!showPhotos)}
      >
        <Text style={styles.dropdownButtonText}>
          {showPhotos ? 'Hide Photos' : 'Show Photos'} ({equipment.photos ? 1 : 0})
        </Text>
      </TouchableOpacity>
      {showPhotos && (
        <View style={styles.photosContainer}>
          <Image source={{ uri: equipment.photos }} style={styles.photo} />
        </View>
      )}

      {/* Related Equipment Section */}
      {equipment.related_equipments?.length > 0 && (
        <View style={styles.relatedContainer}>
          <Text style={styles.sectionTitle}>Related Equipment</Text>
          {equipment.related_equipments.map((related) => (
            <TouchableOpacity
              key={related.id}
              onPress={() => navigation.navigate('EquipmentDetail', { id: related.id })}
            >
              <Text style={styles.link}>{related.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Documents Section */}
      {equipment.documents?.length > 0 && (
        <View style={styles.documentsContainer}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {equipment.documents.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              onPress={() => handleDocumentDownload(doc.document_files, `${doc.name}.pdf`)}
            >
              <Text style={styles.link}>{doc.name}</Text>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  link: {
    fontSize: 16,
    color: '#f2bb13',
    fontWeight: '600',
  },
  overdue: {
    fontSize: 16,
    color: '#d9534f',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dropdownButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  photosContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  relatedContainer: {
    marginBottom: 20,
  },
  documentsContainer: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default EquipmentDetailScreen;
