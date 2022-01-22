import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import ProfileCard from '../components/ProfileCard';

const ExplorePage = () => {
  const [username, setUsername] = useState([]);

  useEffect(() => {
    const bob = firestore()
      .collection('Users')
      .doc('tDywtpawk5ReOYza0Lpo')
      .get();
  }, []);

  return (
    <View>
      <Text>{username}</Text>
      <ProfileCard name={'Tom Holland'} />
    </View>
  );
};

export default ExplorePage;
