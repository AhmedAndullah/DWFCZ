import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  useGetEmployeeQuery,
  useGetDepartmentsQuery,
  useGetProjectsQuery,
} from '../api/authApi';
import { useNavigation } from '@react-navigation/native';


const DivisionDetailScreen = () => {
  // Fetch employees
  const { data: employeesData, isLoading: isEmployeesLoading, error: employeesError } = useGetEmployeeQuery();

  // Fetch departments
  const { data: departmentsData, isLoading: isDepartmentsLoading, error: departmentsError } = useGetDepartmentsQuery();

  // Fetch projects
  const { data: projectsData, isLoading: isProjectsLoading, error: projectsError } = useGetProjectsQuery();

  // Combine errors and loading states
  const isLoading = isEmployeesLoading || isDepartmentsLoading || isProjectsLoading;
  const hasError = employeesError || departmentsError || projectsError;
  const navigation = useNavigation();


  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', 'Failed to load required data.');
    }
  }, [hasError]);

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f2bb13" />
      </View>
    );
  }

  // Handle error state
  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: Unable to fetch data.</Text>
      </View>
    );
  }

  // Render the UI
  return (
    <View style={styles.container}>
      {/* Statistics Section */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.statisticsContainer}>
        <View style={[styles.statCard, styles.redCard]}>
          <Text style={styles.statValue}>{employeesData?.filter(emp => emp.is_manager).length || 0}</Text>
          <Text style={styles.statLabel}>Total Managers</Text>
        </View>
        <View style={[styles.statCard, styles.blueCard]}>
          <Text style={styles.statValue}>{employeesData?.length || 0}</Text>
          <Text style={styles.statLabel}>Total Employees</Text>
        </View>
        <View style={[styles.statCard, styles.orangeCard]}>
          <Text style={styles.statValue}>{departmentsData?.length || 0}</Text>
          <Text style={styles.statLabel}>Active Departments</Text>
        </View>
        <View style={[styles.statCard, styles.greenCard]}>
          <Text style={styles.statValue}>{projectsData?.length || 0}</Text>
          <Text style={styles.statLabel}>Total Projects</Text>
        </View>
      </View>

      {/* Recent Departments Table */}
      <Text style={styles.tableTitle}>Recent Departments</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Created By</Text>
          <Text style={styles.tableHeaderCell}>Last Modified</Text>
        </View>
        {departmentsData?.slice(0, 5).map((department, index) => (
          <View
            key={department.id}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}
          >
            <Text style={styles.tableCell}>{department.name}</Text>
            <Text style={styles.tableCell}>
              {department.created_by
                ? `${department.created_by.first_name} ${department.created_by.last_name} - ${department.created_by.employee_no}`
                : 'Unknown'}
            </Text>
            <Text style={styles.tableCell}>
              {new Date(department.modified_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    },
    error: {
      fontSize: 18,
      color: '#d9534f',
      textAlign: 'center',
      marginTop: 20,
    },
    statisticsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    statCard: {
      flexBasis: '48%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 3,
    },
    statValue: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
    },
    statLabel: {
      fontSize: 14,
      color: '#777',
    },
    redCard: { backgroundColor: '#fdecea' },
    blueCard: { backgroundColor: '#e7f0fd' },
    orangeCard: { backgroundColor: '#fff5e5' },
    greenCard: { backgroundColor: '#e7f6e9' },
    tableTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    table: {
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 3,
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f2bb13',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    tableHeaderCell: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#fff',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    tableCell: {
      flex: 1,
      fontSize: 14,
      color: '#555',
    },
    rowEven: {
      backgroundColor: '#f9f9f9',
    },
    rowOdd: {
      backgroundColor: '#fff',
    },
    backButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#f2bb13',
      borderRadius: 8,
      marginBottom: 20,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    
  });
  
export default DivisionDetailScreen;
