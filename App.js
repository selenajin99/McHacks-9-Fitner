/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  ApplicationProvider,
  Avatar,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconRegistry,
  Text,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import ProfilePage from './src/screens/ProfilePage';
import AccountPage from './src/screens/AccountPage';
import ExplorePage from './src/screens/ExplorePage';
import ChatsListPage from './src/screens/ChatsListPage';
import SignUpPage from './src/screens/SignUpPage';
import LandingPage from './src/screens/LandingPage';
import ChatPage from './src/screens/ChatPage';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ChatDetailsPage from './src/screens/ChatDetailsPage';

const Stack = createStackNavigator();

const HeartIcon = props => <Icon {...props} name="heart" />;

const {Navigator, Screen} = createBottomTabNavigator();

const App = () => {
  const BottomTabBar = ({navigation, state}) => (
    <SafeAreaView>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => {
          navigation.navigate(state.routeNames[index]);
        }}>
        <BottomNavigationTab
          title="Explore"
          icon={<Icon name="search-outline"></Icon>}
        />
        <BottomNavigationTab
          title="Chats"
          icon={<Icon name="message-circle-outline"></Icon>}
        />
      </BottomNavigation>
    </SafeAreaView>
  );
  const ChatListStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen
          options={{
            ...TransitionPresets.ModalPresentationIOS,
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    auth().signOut();
                  }}
                  style={{
                    marginRight: '10%',
                  }}>
                  <Text style={{color: 'red'}}>Sign out</Text>
                </TouchableOpacity>
              );
            },
          }}
          name="Account"
          component={AccountPage}
        />
        <Stack.Screen name="ChatDetailsPage" component={ChatDetailsPage} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
      </Stack.Navigator>
    );
  };

  const LandingStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  const TabNavigator = ({navigation}) => (
    <Navigator
      screenOptions={{
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Account', {imageUri, setImageUri});
              }}>
              <Avatar
                style={{
                  marginLeft: 20,
                  height: 25,
                  width: 25,
                  backgroundColor: 'blue',
                }}
                source={{
                  uri: imageUri,
                }}
              />
            </TouchableOpacity>
          );
        },
      }}
      tabBar={props => <BottomTabBar {...props} />}>
      <Screen name="Explore" component={ExplorePage} />
      <Stack.Screen name="ChatList" component={ChatsListPage} />
      {/* <Screen name="Account" component={AccountPage} /> */}
    </Navigator>
  );
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [imageUri, setImageUri] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
  );

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [user]);

  if (initializing) return null;

  if (!user) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <LandingStack />
        </NavigationContainer>
      </ApplicationProvider>
    );
  }

  firestore()
    .collection('Users')
    .doc(user.uid)
    .get()
    .then(doc => {
      setImageUri(doc.data().imageUri);
    });
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <ChatListStack />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
};
export default App;
