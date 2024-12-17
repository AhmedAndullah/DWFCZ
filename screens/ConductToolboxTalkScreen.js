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
import { useGetProjectsQuery, useGetEmployeeQuery } from '../api/authApi';
import Signature from 'react-native-signature-canvas';

const ConductToolboxTalkScreen = ({ route }) => {
  const { title } = route.params;
  const [project, setProject] = useState('');
  const [foreman, setForeman] = useState('');
  const [foremanSignature, setForemanSignature] = useState('');
  const [workers, setWorkers] = useState([]);
  const [currentWorker, setCurrentWorker] = useState('');
  const [workerSignatures, setWorkerSignatures] = useState({});
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSignature, setCurrentSignature] = useState('');
  const [isForemanSigning, setIsForemanSigning] = useState(false);

  const { data: projects } = useGetProjectsQuery();
  const { data: employees } = useGetEmployeeQuery();

  const handleSignature = (sig) => setCurrentSignature(sig);

  const saveForemanSignature = () => {
    if (currentSignature) {
      setForemanSignature(currentSignature);
      setShowSignaturePad(false);
      setCurrentSignature('');
      Alert.alert('Success', 'Foreman signature saved.');
    } else {
      Alert.alert('Validation Error', 'Please provide a signature.');
    }
  };

  const saveWorkerSignature = () => {
    if (currentWorker) {
      setWorkerSignatures((prev) => ({
        ...prev,
        [currentWorker]: currentSignature || 'No Signature',
      }));

      if (!workers.includes(currentWorker)) {
        setWorkers([...workers, currentWorker]);
      }

      setCurrentWorker('');
      setCurrentSignature('');
      setShowSignaturePad(false);

      Alert.alert('Success', 'Worker signature saved.');
    } else {
      Alert.alert('Error', 'Select a worker to add their signature.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Conduct Toolbox Talk</Text>

        {/* Toolbox Talk Title */}
        <Text style={styles.label}>Toolbox Talk Title</Text>
        <TextInput style={styles.input} value={title} editable={false} />

        {/* Project Picker */}
        <Text style={styles.label}>Select Project</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={project} onValueChange={setProject} style={styles.picker}>
            <Picker.Item label="Select Project" value="" />
            {projects?.map((proj) => (
              <Picker.Item key={proj.id} label={proj.name} value={proj.id} />
            ))}
          </Picker>
        </View>

        {/* Foreman Section */}
        <Text style={styles.label}>Select Foreman</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={foreman} onValueChange={setForeman} style={styles.picker}>
            <Picker.Item label="Select Foreman" value="" />
            {employees?.map((emp) => (
              <Picker.Item
                key={emp.id}
                label={`${emp.first_name} ${emp.last_name}`}
                value={emp.id}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setIsForemanSigning(true) || setShowSignaturePad(true)}>
          <Text style={styles.buttonText}>
            {foremanSignature ? 'Foreman Signature Added ✅' : 'Add Foreman Signature'}
          </Text>
        </TouchableOpacity>

        {/* Worker Section */}
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

        {/* Display Worker Signatures */}
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

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Toolbox Talk</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Signature Modal */}
      <Modal visible={showSignaturePad} animationType="slide">
        <View style={styles.modalContainer}>
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
