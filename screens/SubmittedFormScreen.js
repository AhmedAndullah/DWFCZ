import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Ensure navigation is imported
import { useGetFormAssignmentsQuery } from '../api/authApi'; // Adjust import path for your project

const SubmittedFormScreen = () => {
  const navigation = useNavigation();
  const { data, error, isLoading } = useGetFormAssignmentsQuery();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading submitted forms...</Text>
      </View>
    );
  }

  if (error) {
    console.error('Error fetching submitted forms:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load submitted forms.</Text>
      </View>
    );
  }

  // Filter to show only completed forms
  const completedForms = data?.results.filter((form) => form.is_completed) || [];

  const renderSubmittedForm = ({ item }) => (
    <TouchableOpacity
      style={styles.formCard}
      onPress={() => navigation.navigate('SubmitFormDetail', { id: item.assignment_id })} // Fix onPress placement
    >
      <Text style={styles.formTitle}>Form Name: {item.form_name}</Text>
      <Text style={styles.formDetails}>Assigned to: {item.user_email}</Text>
      <Text style={styles.formDetails}>Completed: {item.is_completed ? 'Yes' : 'No'}</Text>
      <Text style={styles.formDetails}>
        Assigned At: {new Date(item.assigned_at).toLocaleString()}
      </Text>
      {item.submitted_at && (
        <Text style={styles.formDetails}>
          Submitted At: {new Date(item.submitted_at).toLocaleString()}
        </Text>
      )}
      <Text style={styles.formDetails}>
        Assigned By:
        {' '}
        {`${item.assigned_by.first_name} ${item.assigned_by.last_name}`}
      </Text>
      <Text style={styles.subDetails}>Role: {item.assigned_by.role}</Text>
      <Text style={styles.subDetails}>
        Employee No: {item.assigned_by.employee_no}
      </Text>
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
        <Text style={styles.title}>Submitted Forms</Text>
      </View>
  
      {completedForms.length > 0 ? (
        <FlatList
          data={completedForms}
          renderItem={renderSubmittedForm}
          keyExtractor={(item) => item.assignment_id.toString()}
          style={styles.formList}
        />
      ) : (
        <View style={styles.emptyList}>
          <Text style={styles.emptyText}>No submitted forms available.</Text>
        </View>
      )}
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
  formCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  formDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  subDetails: {
    fontSize: 12,
    color: '#777',
    marginLeft: 10,
    marginTop: 2,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonText: {
    color: '#f2bb13',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default SubmittedFormScreen;
