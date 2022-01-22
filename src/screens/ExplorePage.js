import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
import {Button} from '@ui-kitten/components';

const ExplorePage = () => {
  const [username, setUsername] = useState([]);

  useEffect(() => {
    const bob = firestore()
      .collection('Users')
      .doc('tDywtpawk5ReOYza0Lpo')
      .get();

    firestore()
      .collection('Users')
      .doc('tDywtpawk5ReOYza0Lpo')
      .get()
      .then(doc => {
        setUsername(doc.data().Name);
      });
  }, []);

  return (
    <View>
      <Text>{username}</Text>
      <ProfileCard name={'Tom Holland'} />

      <Button
        onPress={() => {
          auth().signOut();
        }}>
        Sign out
      </Button>
      <Text>{username}</Text>
    </View>
  );
};

export default ExplorePage;
