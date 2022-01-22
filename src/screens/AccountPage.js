import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  Button,
  CheckBox,
  IndexPath,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';

const AccountPage = () => {
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(res => {
        console.log(new IndexPath(1, 0).groupIndex);
        let firestoreAvail = res.data().availability;
        let formattedAvail = [];
        for (let i = 0; i < 7; i++) {
          for (let k = 0; k < 3; k++) {
            if (firestoreAvail[days[i]][k]) {
              formattedAvail.push(new IndexPath(k, i));
            }
          }
        }
        console.log(formattedAvail);
        setAvailability(formattedAvail);
      });
  }, []);

  const [availability, setAvailability] = useState([]);
  const TimesOfDay = day => {
    return (
      <SelectGroup title={day}>
        <SelectItem title={'Morning ⏰'} />
        <SelectItem title={'Afternoon ☀️'} />
        <SelectItem title={'Evening 🌙'} />
      </SelectGroup>
    );
  };
  const displayValue = 'Click here to edit availabilty';
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return (
    <>
      <View style={{alignSelf: 'center', width: '100%'}}>
        <Text></Text>
        <Select
          value={displayValue}
          style={{width: '100%'}}
          label="Availability"
          multiSelect={true}
          selectedIndex={availability}
          onSelect={index => {
            setAvailability(index);
            console.log(index);
            let firestoreFormatted = {
              Monday: [false, false, false],
              Tuesday: [false, false, false],
              Wednesday: [false, false, false],
              Thursday: [false, false, false],
              Friday: [false, false, false],
              Saturday: [false, false, false],
              Sunday: [false, false, false],
            };
            index.forEach(item => {
              firestoreFormatted[days[item.section]][item.row] = true;
            });
            console.log(auth().currentUser.uid);
            firestore()
              .collection('Users')
              .doc(auth().currentUser.uid)
              .update({availability: firestoreFormatted})
              .then(res => {
                console.log('done');
              });
          }}>
          {TimesOfDay(days[0])}
          {TimesOfDay(days[1])}
          {TimesOfDay(days[2])}
          {TimesOfDay(days[3])}
          {TimesOfDay(days[4])}
          {TimesOfDay(days[5])}
          {TimesOfDay(days[6])}
        </Select>
      </View>
      <Button
        status={'danger'}
        style={{}}
        onPress={() => {
          auth().signOut();
        }}>
        Sign out
      </Button>
    </>
  );
};

export default AccountPage;
