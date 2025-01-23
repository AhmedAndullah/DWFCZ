import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useGetFormsProgressQuery, useSubmitFormResponseMutation } from '../api/authApi';

const FormDetailScreen = ({ route }) => {
  const { id, assignment_id } = route.params;
  const { data, isLoading, error } = useGetFormsProgressQuery(id);
  const [submitFormResponse] = useSubmitFormResponseMutation();
  const [formValues, setFormValues] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const handleInputChange = (fieldId, value) => {
    setFormValues({ ...formValues, [fieldId]: value });
  };

  const handleDateConfirm = (date) => {
    handleInputChange(selectedFieldId, date.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    handleInputChange(selectedFieldId, time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    try {
      // Grouping fields by their container (e.g., "Workflow Step")
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
  
      // Construct the payload
      const payload = {
        assignment_id,
        form_id: data?.id,
        form_data: groupedData,
      };
  
      console.log('Submitting payload:', payload);
  
      // Send the payload using the mutation hook
      const response = await submitFormResponse(payload).unwrap();
      Alert.alert('Success', 'Form submitted successfully!');
  
      // Reset the state of the screen
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
        case 'radio-group':
          return (
            <View style={styles.fieldContainer} key={field.id}>
              <Text style={styles.label}>{field.labelName}</Text>
              {field.description && (
                <Text style={styles.description}>{field.description}</Text>
              )}
              <View style={styles.radioGroup}>
                {field.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.radioItem}
                    onPress={() => handleInputChange(field.id, item.value)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        formValues[field.id] === item.value && styles.radioCircleSelected,
                      ]}
                    />
                    <Text style={styles.radioText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        
      default:
        return null;
    }
  };

  const components = data?.form_content?.formLayoutComponents || [];

  if (isLoading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView style={styles.container}>
      {components.map((component) => (
        <View key={component.container?.id} style={styles.componentContainer}>
          <Text style={styles.componentTitle}>{component.container?.heading || 'No Heading'}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  componentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  componentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#f2bb13',
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    color: '#d9534f',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginVertical: 5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    backgroundColor: '#f2bb13',
    borderColor: '#f2bb13',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FormDetailScreen;
