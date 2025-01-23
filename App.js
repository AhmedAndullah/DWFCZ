import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import store from './store/store';
import RegisterScreen from './screens/RegisterScreen';
import SdsSearchScreen from './screens/SdsSearchScreen'; // New screen
import ToolboxTalkScreen from './screens/ToolboxTalkScreen'; // New screnomen
import LoginScreen from './screens/LoginScreen';
import ToolboxTalkDetailsScreen from './screens/ToolboxTalkDetailScreen';
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
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Login">
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Register" component={RegisterScreen} />
          <Drawer.Screen name="SDS Search" component={SdsSearchScreen} />
          <Drawer.Screen name="Toolbox Talk" component={ToolboxTalkScreen} />
          <Drawer.Screen name="ToolboxTalkDetails" component={ToolboxTalkDetailsScreen} />
          <Drawer.Screen name="ConductToolboxTalk" component={ConductToolboxTalkScreen} />
          <Drawer.Screen name="Lesson" component={LessonScreen} />
          <Drawer.Screen name="LessonDetails" component={LessonDetailsScreen} />
          <Drawer.Screen name="LessonProgress" component={LessonProgressScreen} />
          <Drawer.Screen name="Form" component={FormScreen} />
          <Drawer.Screen name="FormDetail" component={FormDetailScreen} />
          <Drawer.Screen name="Equipment" component={EquipmentScreen} />
          <Drawer.Screen name="EquipmentDetail" component={EquipmentDetailScreen} />
          <Drawer.Screen name="Division" component={DivisionScreen} />
          <Drawer.Screen name="DivisionDetails" component={DivisionDetailScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />



        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}