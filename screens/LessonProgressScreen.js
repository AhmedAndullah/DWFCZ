import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetLessonsProgressQuery } from '../api/authApi';

const LessonProgressScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const { data, error, isLoading } = useGetLessonsProgressQuery(id);

  const renderCompletedForm = ({ item }) => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>{item.name}</Text>
      <Text style={styles.formDetails}>
        Completed by: {item.created_by.first_name} {item.created_by.last_name}
      </Text>
      <Text style={styles.formDetails}>
        Completed on: {isNaN(new Date(item.created_at)) ? 'Invalid Date' : new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderIncompleteQuiz = ({ item }) => {
    console.log('Incomplete Quiz Item:', item); // Debugging: log the item to verify its structure
  
    return (
      <TouchableOpacity
        style={styles.formCard}
        onPress={() => {
          console.log('Navigating to FormDetail screen with:', {
            formID: item.id, // Correct key for form ID
            assignmentID: 1, // Update this if there's a specific assignment ID key
          });
          navigation.navigate('Forms', {
            screen: 'FormDetail',
            params: {
              id: item.id, // Pass the correct form ID
              assignment_id: 1, // Replace with actual assignment ID key if available
            },
          });
        }}
      >
        <Text style={styles.formTitle}>{item.name}</Text>
        <Text style={styles.formDetails}>Incomplete Quiz</Text>
      </TouchableOpacity>
    );
  };
  
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Progress</Text>
      </View>

      {/* Incomplete Quizzes Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Incomplete Quizzes</Text>
        {data.incomplete_forms.length > 0 ? (
          <FlatList
            data={data.incomplete_forms}
            renderItem={renderIncompleteQuiz}
            keyExtractor={(item) => item.id.toString()}
            style={styles.formList}
          />
        ) : (
          <Text style={styles.noDataText}>No incomplete quizzes available.</Text>
        )}
      </View>

      {/* Completed Quizzes Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Completed Quizzes</Text>
        {data.completed_forms.length > 0 ? (
          <FlatList
            data={data.completed_forms}
            renderItem={renderCompletedForm}
            keyExtractor={(item) => item.id.toString()}
            style={styles.formList}
          />
        ) : (
          <Text style={styles.noDataText}>No completed quizzes yet.</Text>
        )}
      </View>

      {/* All Quizzes Completed Message */}
      {data.is_completed && (
        <View style={styles.completionStatus}>
          <Text style={styles.completedText}>
            🎉 All quizzes completed!
          </Text>
        </View>
      )}
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  progressSection: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
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
  },
  formDetails: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  completionStatus: {
    alignItems: 'center',
    marginVertical: 20,
  },
  completedText: {
    fontSize: 20,
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  backButtonText: {
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

export default LessonProgressScreen;
