import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetFormAssignmentsDetailQuery } from '../api/authApi';

const SubmittedFormDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params; // Assignment ID passed via navigation
  const { data, error, isLoading } = useGetFormAssignmentsDetailQuery(id);

  const handleOpenPDF = () => {
    if (data?.response_pdf) {
      Linking.openURL(data.response_pdf).catch((err) => console.error('Error opening PDF:', err));
    } else {
      alert('No PDF available for this form.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading form details...</Text>
      </View>
    );
  }

  if (error) {
    console.error('Error fetching form details:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load form details. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Open PDF Button */}
      {data.response_pdf && (
        <TouchableOpacity style={styles.pdfButton} onPress={handleOpenPDF}>
          <Text style={styles.pdfButtonText}>Open Response PDF</Text>
        </TouchableOpacity>
      )}

      {/* Form Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Details</Text>
        <Text style={styles.detailItem}>Assignment ID: {data.assignment_id}</Text>
        <Text style={styles.detailItem}>Form Name: {data.form_name}</Text>
        <Text style={styles.detailItem}>User Email: {data.user_email}</Text>
        <Text style={styles.detailItem}>Assigned At: {new Date(data.assigned_at).toLocaleString()}</Text>
        {data.due_date && (
          <Text style={styles.detailItem}>Due Date: {new Date(data.due_date).toLocaleDateString()}</Text>
        )}
        {data.submitted_at && (
          <Text style={styles.detailItem}>Submitted At: {new Date(data.submitted_at).toLocaleString()}</Text>
        )}
        <Text style={styles.detailItem}>Completed: {data.is_completed ? 'Yes' : 'No'}</Text>
      </View>

      {/* Assigned By */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned By</Text>
        <Text style={styles.detailItem}>First Name: {data.assigned_by.first_name}</Text>
        <Text style={styles.detailItem}>Last Name: {data.assigned_by.last_name}</Text>
        <Text style={styles.detailItem}>Email: {data.assigned_by.email}</Text>
        <Text style={styles.detailItem}>Role: {data.assigned_by.role}</Text>
      </View>

      {/* Form Response */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Response</Text>
        {data.response_data_content &&
          Object.entries(data.response_data_content).map(([key, fields]) => (
            <View key={key} style={styles.responseContainer}>
              <Text style={styles.responseHeading}>{key}</Text>
              {Object.entries(fields).map(([fieldName, fieldValue]) => (
                <Text key={fieldName} style={styles.responseField}>
                  {fieldName}: {fieldValue?.toString()}
                </Text>
              ))}
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  responseContainer: {
    marginTop: 10,
  },
  responseHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  responseField: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  pdfButton: {
    backgroundColor: '#f2bb13',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  pdfButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SubmittedFormDetailScreen;
