import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Input, Modal, Card, Tooltip} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapModal from '../components/MapModal';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const FirstOpenPage = () => {
  const [mapVisible, setMapVisible] = useState(false);
  const [nameTooltipVisible, setNameTooltipVisible] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('Choose Location');
  const [bio, setBio] = useState('');

  const [region, setRegion] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: 69,
    longitude: -73.5673,
  });
  const renderNameInput = () => {
    return <Input label={'Name'} onChangeText={setName} />;
  };

  useEffect(() => {
    axios
      .post(
        'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA1NFourwaEW-OiAYSl2QJ0y0umeahYgjw',
      )
      .then(res => {
        console.log(res.data);
        setRegion({
          ...region,
          latitude: res.data.location.lat,
          longitude: res.data.location.lng,
        });
      });
  }, []);
  return (
    <>
      <SafeAreaView style={{justifyContent: 'center', flex: 1}}>
        <Text>Thank you for downloading Fitner</Text>
        <View style={{marginHorizontal: '10%'}}>
          <Tooltip
            anchor={renderNameInput}
            visible={nameTooltipVisible}
            onBackdropPress={() => setNameTooltipVisible(false)}>
            Must have a name
          </Tooltip>

          <Input
            label={'Bio'}
            onChangeText={setBio}
            style={{marginVertical: '10%'}}
          />

          <TouchableOpacity>
            <Input
              showSoftInputOnFocus={false}
              keyboardType={null}
              label={'Location'}
              value={city}
              onFocus={() => {
                Keyboard.dismiss();
                setMapVisible(true);
              }}
              editable={false}
              focusable={false}
            />
          </TouchableOpacity>
        </View>

        <Button
          style={{position: 'absolute', bottom: '5%', alignSelf: 'center'}}
          onPress={() => {
            if (name.length == 0) {
              setNameTooltipVisible(true);
            } else if (city == 'Choose Location') {
              setMapVisible(true);
            } else if (city != 'Choose Location') {
              auth()
                .signInAnonymously()
                .then(user => {
                  firestore()
                    .collection('Users')
                    .doc(user.user.uid)
                    .set({
                      Name: name,
                      dateCreated: firestore.Timestamp.now(),
                      city,
                      bio,
                      lastOpen: firestore.Timestamp.now(),
                      chats: [],
                      activities: [],
                      availability: {
                        Monday: [true, true, true],
                        Tuesday: [true, true, true],
                        Wednesday: [true, true, true],
                        Thursday: [true, true, true],
                        Friday: [true, true, true],
                        Saturday: [true, true, true],
                        Sunday: [true, true, true],
                      },
                    });
                });
            }
          }}>
          Submit
        </Button>
      </SafeAreaView>
      <MapModal
        setCity={setCity}
        city={city}
        mapVisible={mapVisible}
        setMapVisible={setMapVisible}
        region={region}
        setRegion={setRegion}
      />
    </>
  );
};

export default FirstOpenPage;
