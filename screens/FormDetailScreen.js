import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useGetFormsProgressQuery, useSubmitFormResponseMutation } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';


const FormDetailScreen = ({ route }) => {
  const { id, assignment_id } = route.params || {};
  const { data, isLoading, error } = useGetFormsProgressQuery(id);
  const [submitFormResponse] = useSubmitFormResponseMutation();
  const [formValues, setFormValues] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const navigation = useNavigation();


  const handleInputChange = (fieldId, value) => {
    setFormValues({ ...formValues, [fieldId]: value });
  };

  const handleDateConfirm = (date) => {
    handleInputChange(selectedFieldId, date.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    handleInputChange(
      selectedFieldId,
      time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    try {
      const groupedData = {};
      const components = data?.form_content?.formLayoutComponents || [];

      components.forEach((component) => {
        const containerName = component.container?.heading || 'Unknown Step';
        groupedData[containerName] = {};

        component.children?.forEach((field) => {
          if (formValues[field.id] !== undefined) {
            groupedData[containerName][field.labelName] = formValues[field.id];
          }
        });
      });

      const payload = {
        assignment_id,
        form_id: data?.id,
        form_data: groupedData,
      };

      console.log('Submitting payload:', payload);

      const response = await submitFormResponse(payload).unwrap();
      Alert.alert('Success', 'Form submitted successfully!');
      setFormValues({});
      setDatePickerVisibility(false);
      setTimePickerVisibility(false);
      setSelectedFieldId(null);

      console.log('Form submission response:', response);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  const renderFormField = (field) => {
    switch (field.controlName) {
      case 'text-field':
        return (
          <View style={styles.fieldContainer} key={field.id}>
            <Text style={styles.label}>{field.labelName}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              onChangeText={(text) => handleInputChange(field.id, text)}
              value={formValues[field.id] || ''}
            />
          </View>
        );
      case 'multiline-text-field':
        return (
          <View style={styles.fieldContainer} key={field.id}>
            <Text style={styles.label}>{field.labelName}</Text>
            <TextInput
              style={styles.textArea}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleInputChange(field.id, text)}
              value={formValues[field.id] || ''}
            />
          </View>
        );
      case 'date-field':
        return (
          <View style={styles.fieldContainer} key={field.id}>
            <Text style={styles.label}>{field.labelName}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedFieldId(field.id);
                setDatePickerVisibility(true);
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="Select Date"
                value={formValues[field.id] || ''}
                editable={false}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
            />
          </View>
        );
      case 'time-field':
        return (
          <View style={styles.fieldContainer} key={field.id}>
            <Text style={styles.label}>{field.labelName}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedFieldId(field.id);
                setTimePickerVisibility(true);
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="Select Time"
                value={formValues[field.id] || ''}
                editable={false}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={() => setTimePickerVisibility(false)}
            />
          </View>
        );
      case 'toggle':
        return (
          <View style={styles.fieldContainer} key={field.id}>
            <Text style={styles.label}>{field.labelName}</Text>
            <Switch
              value={!!formValues[field.id]}
              onValueChange={(value) => handleInputChange(field.id, value)}
              trackColor={{ false: '#767577', true: '#f2bb13' }}
              thumbColor={formValues[field.id] ? '#f2bb13' : '#f4f3f4'}
            />
          </View>
        );
      default:
        return null;
    }
  };

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Form ID is missing</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading form details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: {error.message || 'Unable to fetch form data.'}
        </Text>
      </View>
    );
  }

  const components = data?.form_content?.formLayoutComponents || [];

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
  
      {/* Form Components */}
      {components.map((component) => (
        <View key={component.container?.id} style={styles.componentContainer}>
          <Text style={styles.componentTitle}>
            {component.container?.heading || 'No Heading'}
          </Text>
          {component.children?.map((field) => renderFormField(field))}
        </View>
      ))}
  
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  componentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
  },
  componentTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  textArea: { height: 120, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  submitButton: {
    backgroundColor: '#f2bb13',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#555' },
  backButton: {
    margin: 20,
    padding: 10,
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

export default FormDetailScreen;
