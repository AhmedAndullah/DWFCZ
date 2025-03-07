import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Signature from 'react-native-signature-canvas';
import { useGetProjectsQuery, useGetEmployeeQuery, useConductToolboxTalkMutation } from '../api/authApi';
import { useNavigation } from '@react-navigation/native'; 


const ConductToolboxTalkScreen = ({ route }) => {
  const { title, id } = route.params; 
  const [project, setProject] = useState('');
  const [foreman, setForeman] = useState('');
  const [foremanSignature, setForemanSignature] = useState('');
  const [workers, setWorkers] = useState([]);
  const [currentWorker, setCurrentWorker] = useState(['']);
  const [workerSignatures, setWorkerSignatures] = useState([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSignature, setCurrentSignature] = useState('');
  const [isForemanSigning, setIsForemanSigning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const { data: projects } = useGetProjectsQuery();
  const { data: employees } = useGetEmployeeQuery();
  const [conductToolboxTalk] = useConductToolboxTalkMutation();

  const handleSignature = (sig) => setCurrentSignature(sig);

  const saveForemanSignature = () => {
    if (currentSignature) {
      setForemanSignature(currentSignature);
      setShowSignaturePad(false);
      setCurrentSignature('');
    } else {
      Alert.alert('Validation Error', 'Please provide a signature.');
    }
  };
  const saveWorkerSignature = () => {
    if (!currentWorker) {
      Alert.alert('Error', 'Select a worker to add their signature.');
      return;
    }
  
    if (!currentSignature) {
      Alert.alert('Validation Error', 'Please provide a signature.');
      return;
    }
  
    
    setWorkerSignatures((prev) => ({
      ...prev,
      [currentWorker]: currentSignature, 
    
    }));
    
    
    
    if (!workers.includes(currentWorker)) {
      setWorkers((prev) => [...prev, currentWorker]);
    }
    setShowSignaturePad(false);
  
    Alert.alert('Success', 'Worker signature saved.');
  };
  
  
  
  
  
  
  {workers.length > 0 && (
    <>
      <Text style={styles.label}>Worker Signatures</Text>
      {workers.map((workerId) => {
        const worker = employees?.find((emp) => emp.id === workerId); 
        return (
          <View key={workerId} style={styles.signatureCard}>
            <Text style={styles.signatureText}>
              {worker?.first_name} {worker?.last_name}: {workerSignatures[workerId] ? '✔ Signature Captured' : 'No Signature'}
            </Text>
          </View>
        );
      })}
    </>
  )}
  

  const handleSaveToolboxTalk = async () => {
    if (!project) {
      Alert.alert('Validation Error', 'Please select a project');
      return;
    }
    if (!foreman || !foremanSignature) {
      Alert.alert('Validation Error', 'Please select a foreman and provide a signature');
      return;
    }
  
    
    const signaturesArray = workers.map((workerId) => ({
      worker: workerId,
      signature: workerSignatures[workerId] || null, 
    }));
  
    const formData = new FormData();
    formData.append('toolbox_talk', id);
    formData.append('foreman_signature', foremanSignature);
    formData.append('project', project);
    formData.append('conducted_by', JSON.stringify(workers)); // List of worker IDs
    formData.append('signed_by', JSON.stringify(workers)); // List of worker IDs
    formData.append('signatures', JSON.stringify(signaturesArray)); // Properly formatted signatures
  console.warn("Heloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",signaturesArray);
  
    formData.forEach((value, key) => console.log(key, value)); // Debug log FormData
  
    try {
      setIsLoading(true);
      console.warn("formData",formData);
      
      const response = await conductToolboxTalk(formData);
      Alert.alert('Success', 'Toolbox talk saved successfully!');
      navigation.navigate('Toolbox Talk');
    } catch (error) {
      console.error('Error saving toolbox talk:', error);
      Alert.alert('Error', 'Failed to save toolbox talk. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Conduct Toolbox Talk</Text>

        <Text style={styles.label}>Toolbox Talk Title</Text>
        <TextInput style={styles.input} value={title} editable={false} />

        <Text style={styles.label}>Select Project</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={project} onValueChange={setProject} style={styles.picker}>
            <Picker.Item label="Select Project" value="" />
            {projects?.map((proj) => (
              <Picker.Item key={proj.id} label={proj.name} value={proj.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Foreman</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={foreman} onValueChange={setForeman} style={styles.picker}>
            <Picker.Item label="Select Foreman" value="" />
            {employees?.map((emp) => (
              <Picker.Item key={emp.id} label={`${emp.first_name} ${emp.last_name}`} value={emp.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setIsForemanSigning(true) || setShowSignaturePad(true)}>
          <Text style={styles.buttonText}>
            {foremanSignature ? 'Foreman Signature Added ✅' : 'Add Foreman Signature'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Add Worker Signature</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={currentWorker} onValueChange={setCurrentWorker} style={styles.picker}>
            <Picker.Item label="Select Worker" value="" />
            {employees?.map((emp) => (
              <Picker.Item key={emp.id} label={`${emp.first_name} ${emp.last_name}`} value={emp.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsForemanSigning(false) || setShowSignaturePad(true)}
        >
          <Text style={styles.buttonText}>Add Worker Signature</Text>
        </TouchableOpacity>

        {workers.length > 0 && (
          <>
            <Text style={styles.label}>Worker Signatures</Text>
            {workers.map((workerId) => {
              const worker = employees?.find((emp) => emp.id === workerId);
              return (
                <View key={workerId} style={styles.signatureCard}>
                  <Text style={styles.signatureText}>
                    {worker?.first_name} {worker?.last_name}:{' '}
                    {workerSignatures[workerId] === 'No Signature' ? 'No Signature' : '✔ Signature Captured'}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToolboxTalk}>
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Toolbox Talk'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSignaturePad} animationType="slide">
  <View style={styles.modalContainer}>
    {/* Back Button */}
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        setShowSignaturePad(false);
        setCurrentSignature(''); // Clear the signature if back button is pressed
      }}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>

    
    <Text style={styles.modalTitle}>
      {isForemanSigning ? 'Foreman Signature' : 'Worker Signature'}
    </Text>

    
    <Signature
      onOK={handleSignature}
      onEmpty={() => Alert.alert('Validation Error', 'Signature is empty.')}
      descriptionText="Sign Here"
      clearText="Clear"
      confirmText="Save"
      webStyle={styles.signaturePad}
    />

    
    <TouchableOpacity
      style={styles.modalButton}
      onPress={isForemanSigning ? saveForemanSignature : saveWorkerSignature}
    >
      <Text style={styles.modalButtonText}>Save Signature</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { padding: 20 },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#f2bb13',
    borderRadius: 8,
    zIndex: 10, 
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
  heading: { fontSize: 26, fontWeight: '800', color: '#f2bb13', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 15, backgroundColor: '#fff' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 15, backgroundColor: '#fff' },
  picker: { height: 50 },
  button: { backgroundColor: '#f2bb13', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signatureCard: { padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 3 },
  signatureText: { fontSize: 14, fontWeight: '600', color: '#555' },
  saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#333', marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#f2bb13', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ConductToolboxTalkScreen;
