import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRegisterMutation, useGetAllCompaniesQuery } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // API Query to fetch all companies
  const { data, isLoading, error } = useGetAllCompaniesQuery();
  const companies = data?.results || [];

  // Debugging API Response
  useEffect(() => {
    console.log('Debugging Companies API Response:');
    console.log('Data:', data);
    console.log('Error:', error);
    console.log('Is Loading:', isLoading);
  }, [data, error, isLoading]);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log('Debugging Form State Before Registration:');
    console.log({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
      company,
    });

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !company
    ) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address,
        company,
      }).unwrap();

      Alert.alert('Success', 'Registration successful. Please log in.');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', err?.data?.message || 'Failed to register.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Company Picker */}
      <Text style={styles.label}>Select Company</Text>
      {isLoading ? (
        <Text style={styles.loading}>Loading companies...</Text>
      ) : error ? (
        <Text style={styles.error}>Failed to load companies</Text>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={company}
            onValueChange={(value) => setCompany(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Company" value="" />
            {companies.map((comp) => (
              <Picker.Item key={comp.id} label={comp.name} value={comp.id} />
            ))}
          </Picker>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f2bb13',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#f2bb13',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#f2bb13',
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
});

export default RegisterScreen;
