import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
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
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import ProfilePage from './src/screens/ProfilePage';
import AccountPage from './src/screens/AccountPage';
import ExplorePage from './src/screens/ExplorePage';
import ChatsListPage from './src/screens/ChatsListPage';
import FirstOpenPage from './src/screens/FirstOpenPage';
import ChatPage from './src/screens/ChatPage';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const HeartIcon = props => <Icon {...props} name="heart" />;

const {Navigator, Screen} = createBottomTabNavigator();

const App = () => {
  const BottomTabBar = ({navigation, state}) => (
    <SafeAreaView>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab
          title="Explore"
          icon={<Icon name="search-outline"></Icon>}
        />
        <BottomNavigationTab
          title="Chats"
          icon={<Icon name="message-circle-outline"></Icon>}
        />
        {/* <BottomNavigationTab
          title="Account"
          icon={<Icon name="person-outline"></Icon>}
        /> */}
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
        <Stack.Screen name="Account" component={AccountPage} />
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
                  marginBottom: 15,
                  height: 50,
                  width: 50,
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
  const [imageUri, setImageUri] = useState('');

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
        <FirstOpenPage />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
