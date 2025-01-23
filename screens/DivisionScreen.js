import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useGetCompaniesQuery } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';

const DivisionScreen = () => {
  const { data, isLoading, error } = useGetCompaniesQuery();
    const navigation = useNavigation();
  

  const renderDivision = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Created Date:</Text>
          <Text style={styles.value}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Modified:</Text>
          <Text style={styles.value}>
            {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Created By:</Text>
          <Text style={styles.value}>
            {item.created_by?.first_name && item.created_by?.last_name
              ? `${item.created_by.first_name} ${item.created_by.last_name}`
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              { backgroundColor: item.status === 'Active' ? '#c8facc' : '#facccc' },
            ]}
          >
            {item.status || 'Unknown'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('DivisionDetails', { id: item.id })}
            >
            < Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>

    </View>
  );
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading divisions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load divisions. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Divisions</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Division</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderDivision}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 20,
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    createButton: {
      backgroundColor: '#f2bb13',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },
    createButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardContent: {
      flex: 1,
      marginRight: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#777',
      marginRight: 5,
    },
    value: {
      fontSize: 14,
      color: '#555',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    status: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#ccc', // Fallback for unknown statuses
    },
    viewButton: {
        backgroundColor: '#f2bb13',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
      viewButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        textTransform: 'uppercase',
      },
      
    loading: {
      fontSize: 18,
      color: '#555',
      textAlign: 'center',
      marginTop: 20,
    },
    error: {
      fontSize: 18,
      color: '#d9534f',
      textAlign: 'center',
      marginTop: 20,
    },
    list: {
      paddingBottom: 20,
    },
  });
  
export default DivisionScreen;
