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
  Autocomplete,
  AutocompleteItem,
  Button,
  IndexPath,
  Input,
  Select,
  SelectGroup,
  SelectItem,
  Tooltip,
  Avatar,
  Icon,
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
        setAvailability(formattedAvail);
        setName(res.data().Name);
        setBio(res.data().bio);
        setCity(res.data().city);
        setActivies(res.data().activities);
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
    {title: 'Soccer'},
    {title: 'Basketball'},
    {title: 'Baseball'},
    {title: 'Cricket'},
    {title: 'Squash'},
    {title: 'Swimming'},
    {title: 'Running'},
    {title: 'Skating'},
    {title: 'Badminton'},
    {title: 'Tennis'},
    {title: 'Curling'},
    {title: 'Field Hockey'},
    {title: 'Ice Hockey'},
    {title: 'Beach Volleyball'},
    {title: 'Volleyball'},
    {title: 'American Football'},
    {title: 'Skiing'},
    {title: 'Snowboarding'},
    {title: 'Table Tennis'},
    {title: 'Walking'},
    {title: 'Hiking'},
    {title: 'Bowling'},
    {title: 'Boxing'},
  ];
  const filter = (item, query) =>
    item.title.toLowerCase().includes(query.toLowerCase());
  const [activityInput, setActivityInput] = useState(null);
  const [activities, setActivies] = useState([]);
  const [data, setData] = useState(presetActivities);
  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.title} />
  );
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
                // storage()
                //   .ref(auth().currentUser.uid)
                //   .putFile(image.assets[0].uri)
                //   .then(res => {
                //     console.log(res);
                //   })
                //   .catch(e => {
                //     console.log(e);
                //   });
              });
            }}
            style={{
              top: 30,
              width: Dimensions.get('window').width * 0.55,
              height: Dimensions.get('window').width * 0.55,
              alignSelf: 'center',
            }}>
            <Avatar
              style={{width: '100%', height: '100%', borderRadius: 15}}
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

          <Autocomplete
            placeholder="Type activities in here..."
            value={activityInput}
            onSelect={index => {
              setActivityInput(data[index].title);
            }}
            onSubmitEditing={() => {
              let theActivity = false;
              presetActivities.forEach(activity => {
                if (
                  activity.title
                    .toLowerCase()
                    .startsWith(activityInput.toLowerCase()) &&
                  !activities.includes(activity.title)
                ) {
                  theActivity = activity.title;
                }
              });

              if (theActivity) {
                let newActivities = [...activities, theActivity];
                firestore()
                  .collection('Users')
                  .doc(auth().currentUser.uid)
                  .update({activities: newActivities});
                setActivies(newActivities);
                setActivityInput('');
                setData(
                  presetActivities.filter(item => {
                    if (
                      activities.includes(item.title) ||
                      item.title.includes(theActivity)
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  }),
                );
              }
            }}
            onChangeText={query => {
              setActivityInput(query);
              setData(presetActivities.filter(item => filter(item, query)));
            }}>
            {data.map(renderOption)}
          </Autocomplete>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {activities.map((activity, index) => {
              return (
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => {
                    let newActivities = activities.filter(
                      item => item != activity,
                    );
                    setActivies(newActivities);
                    firestore()
                      .collection('Users')
                      .doc(auth().currentUser.uid)
                      .update({activities: newActivities});
                  }}
                  key={index}>
                  <Text style={{marginLeft: 20}}>{activity}</Text>
                  <Icon
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,

                      backgroundColor: 'blue',
                      fill: '#8F9BB3',
                    }}
                    name="trash-outline"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Button
          status={'danger'}
          style={{alignSelf: 'center'}}
          onPress={() => {
            auth().signOut();
          }}>
          Sign out
        </Button>
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
const styles = StyleSheet.create({
  chip: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: ' black',
    borderWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
});

export default AccountPage;
