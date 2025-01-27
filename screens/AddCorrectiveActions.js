import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import {
  useGetProjectsQuery,
  useGetEmployeeQuery,
  useSubmitCorrectiveActionMutation,
} from '../api/authApi';
import DropDownPicker from 'react-native-dropdown-picker';
// import { useNavigation } from '@react-navigation/native';


const AddCorrectiveActionScreen = ({ navigation }) => {
  const { data: projectsData = [] } = useGetProjectsQuery();
  const { data: employeesData = [] } = useGetEmployeeQuery();
  const [submitCorrectiveAction, { isLoading }] = useSubmitCorrectiveActionMutation();
  

  const [formData, setFormData] = useState({
    project: null,
    deficiency: '',
    actionTaken: '',
    deficiencyType: '',
    severity: null,
    assignedWorkers: [],
    owners: [],
    status: null,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    project: false,
    severity: false,
    status: false,
    workers: false,
    owners: false,
  });

  const severityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  const statusOptions = [
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];

  const toggleDropdown = (dropdownKey) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [dropdownKey]: !prevState[dropdownKey],
    }));
  };

  const handleMultiSelect = (key, value) => {
    setFormData((prev) => {
      const updatedArray = prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];
      return { ...prev, [key]: updatedArray };
    });
    setOpenDropdowns((prevState) => ({ ...prevState, [key]: false }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.actionTaken || !formData.deficiencyType || formData.owners.length === 0) {
      alert('Please fill in all required fields, including Owners.');
      return;
    }
  
    // Create FormData object
    const formPayload = new FormData();
  
    // Append fields to FormData
    formPayload.append('project', formData.project || '');
    formPayload.append('deficiency', formData.deficiency || '');
    formPayload.append('action_taken', formData.actionTaken || '');
    formPayload.append('deficiency_type', formData.deficiencyType || '');
    formPayload.append('severity', formData.severity || '');
    formPayload.append('status', formData.status || '');
  
    // Append arrays as separate entries
    formData.assignedWorkers.forEach((worker) => {
      formPayload.append('assigned_workers[]', typeof worker === 'object' ? worker.id : worker);
    });
  
    formData.owners.forEach((owner) => {
      formPayload.append('owners[]', typeof owner === 'object' ? owner.id : owner);
    });
  
    // Debug the FormData content
    for (let pair of formPayload.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const response = await submitCorrectiveAction(formPayload).unwrap();
      console.log('Submit Successful:', response);
      alert('Corrective Action submitted successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('Submit Failed:', err);
      alert(
        `Failed to submit corrective action. Error: ${
          err?.data?.message || JSON.stringify(err?.data || err)
        }`
      );
    }
  };
  
  

  const renderSelectedItems = (key) =>
    formData[key].map((value, index) => {
      const employee = employeesData.find(
        (emp) => emp.id === value || emp.id === parseInt(value)
      );

      const displayName = employee
        ? `${employee.first_name} ${employee.last_name}`
        : 'Unknown';

      return (
        <View style={styles.selectedItem} key={`${key}-${value}-${index}`}>
          <Text>{displayName}</Text>
          <TouchableOpacity onPress={() => handleMultiSelect(key, value)}>
            <Text style={styles.removeButton}>×</Text>
          </TouchableOpacity>
        </View>
      );
    });

  const renderFormField = ({ item }) => {
    switch (item.key) {
      case 'project':
        return (
          <View style={[styles.fieldContainer, { zIndex: openDropdowns.project ? 1000 : 1 }]}>
            <Text style={styles.label}>Project</Text>
            <DropDownPicker
              open={openDropdowns.project}
              value={formData.project}
              items={projectsData.map((project) => ({
                label: project.name,
                value: project.id,
              }))}
              setOpen={() => toggleDropdown('project')}
              setValue={(callback) =>
                setFormData((prev) => ({ ...prev, project: callback(formData.project) }))
              }
              placeholder="Select Project"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        );
      case 'deficiency':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Deficiency</Text>
            <TextInput
              style={styles.input}
              value={formData.deficiency}
              onChangeText={(text) =>
                setFormData({ ...formData, deficiency: text })
              }
              placeholder="Enter Deficiency"
            />
          </View>
        );
      case 'actionTaken':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Action Taken</Text>
            <TextInput
              style={styles.input}
              value={formData.actionTaken}
              onChangeText={(text) =>
                setFormData({ ...formData, actionTaken: text })
              }
              placeholder="Enter Action Taken"
            />
          </View>
        );
      case 'deficiencyType':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Deficiency Type</Text>
            <TextInput
              style={styles.input}
              value={formData.deficiencyType}
              onChangeText={(text) =>
                setFormData({ ...formData, deficiencyType: text })
              }
              placeholder="Enter Deficiency Type"
            />
          </View>
        );
      case 'severity':
        return (
          <View style={[styles.fieldContainer, { zIndex: openDropdowns.severity ? 1000 : 1 }]}>
            <Text style={styles.label}>Severity</Text>
            <DropDownPicker
              open={openDropdowns.severity}
              value={formData.severity}
              items={severityOptions}
              setOpen={() => toggleDropdown('severity')}
              setValue={(callback) =>
                setFormData((prev) => ({ ...prev, severity: callback(formData.severity) }))
              }
              placeholder="Select Severity"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        );
      case 'status':
        return (
          <View style={[styles.fieldContainer, { zIndex: openDropdowns.status ? 1000 : 1 }]}>
            <Text style={styles.label}>Status</Text>
            <DropDownPicker
              open={openDropdowns.status}
              value={formData.status}
              items={statusOptions}
              setOpen={() => toggleDropdown('status')}
              setValue={(callback) =>
                setFormData((prev) => ({ ...prev, status: callback(formData.status) }))
              }
              placeholder="Select Status"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        );
      case 'assignedWorkers':
        return (
          <View style={[styles.fieldContainer, { zIndex: openDropdowns.workers ? 1000 : 1 }]}>
            <Text style={styles.label}>Assigned Workers</Text>
            <DropDownPicker
              open={openDropdowns.workers}
              value={null}
              items={employeesData.map((employee) => ({
                label: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              }))}
              setOpen={() => toggleDropdown('workers')}
              setValue={(callback) => {
                const selectedValue = callback();
                handleMultiSelect('assignedWorkers', selectedValue);
              }}
              placeholder="Select Workers"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <View style={styles.selectedItemsContainer}>
              {renderSelectedItems('assignedWorkers')}
            </View>
          </View>
        );
      case 'owners':
        return (
          <View style={[styles.fieldContainer, { zIndex: openDropdowns.owners ? 1000 : 1 }]}>
            <Text style={styles.label}>Owners</Text>
            <DropDownPicker
              open={openDropdowns.owners}
              value={null}
              items={employeesData.map((employee) => ({
                label: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              }))}
              setOpen={() => toggleDropdown('owners')}
              setValue={(callback) => {
                const selectedValue = callback();
                handleMultiSelect('owners', selectedValue);
                setOpenDropdowns((prevState) => ({ ...prevState, owners: false })); // Close dropdown
              }}
              placeholder="Select Owners"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <View style={styles.selectedItemsContainer}>
              {renderSelectedItems('owners')}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const formFields = [
    { key: 'project' },
    { key: 'deficiency' },
    { key: 'actionTaken' },
    { key: 'deficiencyType' },
    { key: 'severity' },
    { key: 'status' },
    { key: 'assignedWorkers' },
    { key: 'owners' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
  
      <Text style={styles.header}>Corrective Action</Text>
      <FlatList
        data={formFields}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        renderItem={renderFormField}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
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

export default AddCorrectiveActionScreen;
