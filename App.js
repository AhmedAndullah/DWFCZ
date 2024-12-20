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

        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
