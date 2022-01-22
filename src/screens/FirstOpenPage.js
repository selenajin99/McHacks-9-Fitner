import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Input} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FirstOpenPage = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  return (
    <SafeAreaView>
      <Text>Thank you for downloading Fitner</Text>
      <Input label={'Name'} onChangeText={setName} />
      <Input label={'City'} onChangeText={setCity} />
      <Input label={'Bio'} onChangeText={setBio} />
      <Button
        onPress={() => {
          auth()
            .signInAnonymously()
            .then(user => {
              firestore().collection('Users').doc(user.user.uid).set({
                Name: name,
                dateCreated: firestore.Timestamp.now(),
                city,
                bio,
                lastOpen: firestore.Timestamp.now(),
              });
              userID = user.user.uid;
            });
        }}
      />
    </SafeAreaView>
  );
};

export default FirstOpenPage;
