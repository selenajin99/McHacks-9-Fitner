import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
const ExplorePage = () => {
  const [username, setUsername] = useState([]);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        setUsername(doc.data().Name);
      });
  }, []);

  return (
    <View>
      <Text>Hello, {username}</Text>
      <ProfileCard name={'Tom Holland'} />
    </View>
  );
};

export default ExplorePage;
