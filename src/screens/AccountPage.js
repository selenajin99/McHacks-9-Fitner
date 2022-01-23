/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, Keyboard, StyleSheet, Dimensions} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';

import ImageResizer from 'react-native-image-resizer';
import {
  IndexPath,
  Input,
  Select,
  SelectGroup,
  SelectItem,
  Tooltip,
  Avatar,
} from '@ui-kitten/components';

import axios from 'axios';
import MapModal from '../components/MapModal';
import {TouchableOpacity} from 'react-native-gesture-handler';
const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

const AccountPage = ({route, navigation}) => {
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
        let tempArray = [];
        res.data().activities.forEach(activity => {
          console.log(
            'pushing ' + activity + ' ' + presetActivities.indexOf(activity),
          );
          tempArray.push(new IndexPath(presetActivities.indexOf(activity)));
        });

        setAvailability(formattedAvail);
        setName(res.data().Name);
        setBio(res.data().bio);
        setCity(res.data().city);
        setSelectedActivities(tempArray);

        axios({
          method: 'get',
          url: `${baseUrl}${
            res.data().city
          }&key=AIzaSyA1NFourwaEW-OiAYSl2QJ0y0umeahYgjw`,
        }).then(coords => {
          setRegion({
            ...region,
            latitude: coords.data.results[0].geometry.location.lat,
            longitude: coords.data.results[0].geometry.location.lng,
          });
        });
      });
  }, []);
  const [selectedActivities, setSelectedActivities] = React.useState([
    new IndexPath(0),
    new IndexPath(1),
  ]);

  const renderNameInput = () => {
    return (
      <Input
        label={'Name'}
        onChangeText={setName}
        value={Name}
        onSubmitEditing={() => {
          if (Name.length == 0) {
            setNameTooltipVisible(true);
          } else {
            firestore()
              .collection('Users')
              .doc(auth().currentUser.uid)
              .update({Name})
              .then(res => {
                console.log('done');
              });
          }
        }}
      />
    );
  };

  const [Name, setName] = useState('');
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
      <KeyboardAwareScrollView style={{marginBottom: 20}}>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={() => {
              launchImageLibrary().then(image => {
                ImageResizer.createResizedImage(
                  image.assets[0].uri,
                  500,
                  500,
                  'PNG',
                  500,
                  0,
                  image.assets[0].uri,
                )
                  .then(response => {
                    let uri = response.uri;

                    let imageName =
                      'profile/' + auth().currentUser.uid + '.png';
                    let uploadUri =
                      Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

                    firebase
                      .storage()
                      .ref(imageName)
                      .putFile(uploadUri)
                      .then(snapshot => {
                        //You can check the image is now uploaded in the storage bucket
                        console.log(
                          `${imageName} has been successfully uploaded.`,
                        );

                        firebase
                          .storage()
                          .ref(imageName)
                          .getDownloadURL()
                          .then(url => {
                            route.params.setImageUri(url);
                            firestore()
                              .collection('Users')
                              .doc(auth().currentUser.uid)
                              .update({imageUri: url});
                            navigation.pop();
                          });
                      })
                      .catch(e => console.log('uploading image error => ', e));
                  })
                  .catch(err => {
                    console.log('image resizing error => ', err);
                  });
              });
            }}
            style={{
              top: 30,
              width: Dimensions.get('window').width * 0.55,
              height: Dimensions.get('window').width * 0.55,
              alignSelf: 'center',
            }}>
            <Avatar
              style={{width: '100%', height: '100%', borderRadius: 360}}
              source={{
                uri: route.params.imageUri,
              }}
            />
          </TouchableOpacity>
        </View>
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
            value={bio}
            onChangeText={setBio}
            style={{marginVertical: '10%'}}
            multiline={true}
            onKeyDown={handleKeyDown}
            onSubmitEditing={newBio => {
              firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .update({bio: bio})
                .then(res => {
                  console.log('done');
                });
            }}
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

          <Select
            value={'Select activities here'}
            multiSelect={true}
            label={'Activities'}
            style={{width: '100%', marginTop: '10%'}}
            selectedIndex={selectedActivities}
            onSelect={index => {
              setSelectedActivities(index);
              let tempArray = [];
              index.forEach(item => {
                tempArray.push(presetActivities[item.row]);
              });

              firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .update({activities: tempArray})
                .then(res => {
                  console.log('done');
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
            style={{width: '100%', marginVertical: '10%'}}
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
      </KeyboardAwareScrollView>
      <MapModal
        setCity={setCity}
        city={city}
        mapVisible={mapVisible}
        setMapVisible={setMapVisible}
        region={region}
        setRegion={setRegion}
        dismissButtonFunction={() => {
          firestore()
            .collection('Users')
            .doc(auth().currentUser.uid)
            .update({city: city})
            .then(res => {
              setMapVisible(false);
              console.log('done');
            });
        }}
      />
    </>
  );
};

export default AccountPage;
