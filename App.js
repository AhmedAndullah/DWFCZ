import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store/store';
import eventEmitter from './eventEmitter';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SdsSearchScreen from './screens/SdsSearchScreen';
import ToolboxTalkScreen from './screens/ToolboxTalkScreen';
import ToolboxTalkDetailScreen from './screens/ToolboxTalkDetailScreen';
import ConductToolboxTalkScreen from './screens/ConductToolboxTalkScreen';
import LessonScreen from './screens/LessonScreen';
import LessonDetailsScreen from './screens/LessonDetailScreen';
import LessonProgressScreen from './screens/LessonProgressScreen';
import FormScreen from './screens/FormsScreen';
import FormDetailScreen from './screens/FormDetailScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import EquipmentDetailScreen from './screens/EquipmentDetailScreen';
import AnnouncementScreen from './screens/AnnouncementsScreen';
import DivisionScreen from './screens/DivisionScreen';
import DivisionDetailScreen from './screens/DivisionDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubmittedFormScreen from './screens/SubmittedFormScreen';
import SubmittedFormDetailScreen from './screens/SubmittedFormDetailScreen';
import CorrectiveActionsScreen from './screens/CorrectiveAction';
import CorrectiveActionDetailsScreen from './screens/CorrectiveActionDetail';
import AddCorrectiveActionScreen from './screens/AddCorrectiveActions';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading state
  useEffect(() => {
    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            console.log('Retrieved token:', token);
            setIsLoggedIn(!!token); // Update login state based on token
        } catch (error) {
            console.error('Failed to fetch token:', error);
        } finally {
            setIsLoading(false); // Ensure loading stops after check
        }
    };

    // Initial token check
    checkLoginStatus();

    // Listen for token changes via EventEmitter
    eventEmitter.on('tokenChanged', checkLoginStatus);

    // Cleanup listener on unmount
    return () => {
        eventEmitter.off('tokenChanged', checkLoginStatus);
    };
}, []);

if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
        </View>
    );
}
  // Toolbox Talk Stack
  function ToolboxTalkStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Toolbox Talk"
          component={ToolboxTalkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ToolboxTalkDetails"
          component={ToolboxTalkDetailScreen}
          options={{ headerShown: false }}

        />
        <Stack.Screen
          name="ConductToolboxTalk"
          component={ConductToolboxTalkScreen}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    );
  }

  // Lesson Stack
  function LessonStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LessonDetails" 
          component={LessonDetailsScreen}           
          options={{ headerShown: false , header:{}}}
        />
        <Stack.Screen name="LessonProgress" 
         component={LessonProgressScreen} 
         options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  // Form Stack
  function FormStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Forms"
          component={FormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="FormDetail" 
        component={FormDetailScreen} 
        options={{ headerShown: false }}

        />
        <Stack.Screen name="SubmitForm" 
        component={SubmittedFormScreen} 
        options={{ headerShown: false }}

        />

        <Stack.Screen name="SubmitFormDetail" 
        component={SubmittedFormDetailScreen} 
        options={{ headerShown: false }}

        />

        
      </Stack.Navigator>
    );
  }

  // Equipment Stack
  function EquipmentStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Equipment"
          component={EquipmentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EquipmentDetail"
          component={EquipmentDetailScreen}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    );
  }

  // Division Stack
  function DivisionStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Division"
          component={DivisionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DivisionDetails"
          component={DivisionDetailScreen}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    );
  }
  function CorrectiveStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CorrectiveActions"
          component={CorrectiveActionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CorrectiveActionsDetails"
          component={CorrectiveActionDetailsScreen}
          options={{ headerShown: false }}

        />
        <Stack.Screen
          name="AddCorrectiveAction"
          component={AddCorrectiveActionScreen}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    );
  }
  

  // Drawer Navigator for Main App
  function AppDrawer() {
    return (
      <Drawer.Navigator initialRouteName="Toolbox Talk">
        
        <Drawer.Screen name="Toolbox Talk" component={ToolboxTalkStack} />
        <Drawer.Screen name="SDS Search" component={SdsSearchScreen} />
        <Drawer.Screen name="Lesson" component={LessonStack} />
        <Drawer.Screen name="Forms" component={FormStack} />
        <Drawer.Screen name="Equipment" component={EquipmentStack} />
        <Drawer.Screen name="Division" component={DivisionStack} />
        <Drawer.Screen name="Announcements" component={AnnouncementScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="CorrectiveActions" component={CorrectiveStack} />

      </Drawer.Navigator>
    );
  }

  // Auth Stack for Login/Register
  function AuthStack() {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }


  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? <AppDrawer /> : <AuthStack />}
      </NavigationContainer>
    </Provider>
  );
}
