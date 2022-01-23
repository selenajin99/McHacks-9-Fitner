/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Button,
  Avatar,
  IndexPath,
  Input,
  Select,
  SelectGroup,
  Modal,
  SelectItem,
  Tooltip,
} from '@ui-kitten/components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapModal from '../components/MapModal';
import ImageResizer from 'react-native-image-resizer';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const SignUpPage = () => {
  const [selectedActivities, setSelectedActivities] = React.useState([
    new IndexPath(0),
    new IndexPath(1),
  ]);
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
  );
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [mapVisible, setMapVisible] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [nameTooltipVisible, setNameTooltipVisible] = useState(false);

  const [region, setRegion] = useState({
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
    latitude: 69,
    longitude: -73.5673,
  });
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
  const renderNameInput = () => {
    return <Input label={'Name'} onChangeText={setName} />;
  };
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

  const presetActivities = [
    'Soccer',
    'Basketball',
    'Baseball',
    'Cricket',
    'Squash',
    'Swimming',
    'Running',
    'Skating',
    'Badminton',
    'Tennis',
    'Curling',
    'Field Hockey',
    'Ice Hockey',
    'Beach Volleyball',
    'Volleyball',
    'American Football',
    'Skiing',
    'Snowboarding',
    'Table Tennis',
    'Walking',
    'Hiking',
    'Bowling',
    'Boxing',
  ];
  // use enter key to submit form - used in bio edit
  const handleKeyDown = event => {
    if (event.which === 13) {
      inputRef.current.getElementsByTagName('textarea')[0].style.height =
        'auto';
      addMessage(event);
      event.preventDefault();
      Keyboard.dismiss();
    }
  };
  return (
    <>
      <KeyboardAwareScrollView style={{marginTop: 20, marginBottom: 20}}>
        <View
          style={{
            flex: 1,
            marginTop: 50,
            alignSelf: 'center',
            width: '90%',
          }}>
          <Tooltip
            anchor={renderNameInput}
            visible={nameTooltipVisible}
            onBackdropPress={() => setNameTooltipVisible(false)}>
            Must have a name
          </Tooltip>
          <Input
            label={'Bio'}
            onChangeText={setBio}
            style={{marginTop: '5%'}}
            multiline={true}
            onKeyDown={handleKeyDown}
          />
          <TouchableOpacity>
            <Input
              showSoftInputOnFocus={false}
              keyboardType={null}
              label={'Location'}
              style={{width: '100%', marginTop: '5%'}}
              value={city}
              onFocus={() => {
                Keyboard.dismiss();
                setMapVisible(true);
              }}
              editable={false}
              focusable={false}
            />
          </TouchableOpacity>

          <Select
            value={'Select activities here'}
            multiSelect={true}
            label={'Activities'}
            style={{width: '100%', marginTop: '5%'}}
            selectedIndex={selectedActivities}
            onSelect={index => {
              setSelectedActivities(index);
              let tempArray = [];
              index.forEach(item => {
                tempArray.push(presetActivities[item.row]);
              });
            }}>
            <SelectItem title="Soccer" />
            <SelectItem title="Basketball" />
            <SelectItem title="Baseball" />
            <SelectItem title="Cricket" />
            <SelectItem title="Squash" />
            <SelectItem title="Swimming" />
            <SelectItem title="Running" />
            <SelectItem title="Skating" />
            <SelectItem title="Badminton" />
            <SelectItem title="Tennis" />
            <SelectItem title="Curling" />
            <SelectItem title="Field Hockey" />
            <SelectItem title="Ice Hockey" />
            <SelectItem title="Beach Volleyball" />
            <SelectItem title="Volleyball" />
            <SelectItem title="American Football" />
            <SelectItem title="Skiing" />
            <SelectItem title="Snowboarding" />
            <SelectItem title="Table Tennis" />
            <SelectItem title="Walking" />
            <SelectItem title="Hiking" />
            <SelectItem title="Bowling" />
            <SelectItem title="Boxing" />
          </Select>

          <Select
            value={displayValue}
            style={{width: '100%', marginTop: '5%'}}
            label="Availability"
            multiSelect={true}
            selectedIndex={availability}
            onSelect={index => {
              setAvailability(index);
              console.log(index);
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
      </KeyboardAwareScrollView>
      <Button
        style={styles.button}
        onPress={() => {
          if (name.length == 0) {
            setNameTooltipVisible(true);
          } else if (city == 'Choose Location') {
            setMapVisible(true);
          } else if (city != 'Choose Location') {
            auth()
              .signInAnonymously()
              .then(user => {
                let firestoreFormatted = {
                  Monday: [false, false, false],
                  Tuesday: [false, false, false],
                  Wednesday: [false, false, false],
                  Thursday: [false, false, false],
                  Friday: [false, false, false],
                  Saturday: [false, false, false],
                  Sunday: [false, false, false],
                };
                availability.forEach(item => {
                  firestoreFormatted[days[item.section]][item.row] = true;
                });
                firestore().collection('Users').doc(user.user.uid).set({
                  Name: name,
                  dateCreated: firestore.Timestamp.now(),
                  city,
                  bio,
                  lastOpen: firestore.Timestamp.now(),
                  chats: [],
                  availability: firestoreFormatted,
                  activities: selectedActivities,
                  imageUri:
                    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
                });
              });
          }
        }}>
        Submit
      </Button>
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

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginBottom: '20%',
    width: '40%',
    borderRadius: 15,
  },
});
export default SignUpPage;
