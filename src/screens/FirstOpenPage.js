import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Input, Modal, Card} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';

const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
const dimensions = Dimensions.get('window');

const FirstOpenPage = () => {
  const [mapVisible, setMapVisible] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('Choose Location');
  const [bio, setBio] = useState('');

  const [region, setRegion] = useState({
    latitudeDelta,
    longitudeDelta,
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
  return (
    <>
      <SafeAreaView style={{justifyContent: 'center', flex: 1}}>
        <Text>Hi</Text>
        <Text>Thank you for downloading Fitner</Text>
        <View style={{marginHorizontal: '10%'}}>
          <Input label={'Name'} onChangeText={setName} />
          <Input
            label={'Bio'}
            onChangeText={setBio}
            style={{marginVertical: '10%'}}
          />
          <TouchableOpacity
            onPress={() => {
              setMapVisible(true);
            }}>
            <View pointerEvents="none">
              <Input label={'Location'} value={city} focusable={false} />
            </View>
          </TouchableOpacity>
        </View>

        <Button
          style={{position: 'absolute', bottom: '5%', alignSelf: 'center'}}
          onPress={() => {
            if (city != 'Choose Location') {
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
            }
          }}>
          Submit
        </Button>
      </SafeAreaView>
      <Modal visible={mapVisible} style={{width: '75%', height: '75%'}}>
        <Card disabled={true} style={{flex: 1}}>
          <MapView
            style={styles.map}
            initialRegion={region}
            onRegionChange={setRegion}
            onRegionChangeComplete={() => {
              let newLocation = ['', ''];
              axios({
                method: 'get',
                url: `${baseUrl}${region.latitude},${region.longitude}&key=AIzaSyA1NFourwaEW-OiAYSl2QJ0y0umeahYgjw`,
              })
                .then(newAddress => {
                  if (newAddress.data.results) {
                    newAddress.data.results[0].address_components.forEach(
                      component => {
                        if (component.types.includes('locality')) {
                          newLocation[0] = component.short_name;
                        } else if (
                          component.types.includes(
                            'administrative_area_level_1',
                          )
                        ) {
                          newLocation[1] = component.short_name;
                        }
                      },
                    );
                    setCity(newLocation[0] + ', ' + newLocation[1]);
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            }}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
          <Button onPress={() => setMapVisible(false)}>Select: {city}</Button>
        </Card>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    height: dimensions.height * 0.75,
    width: dimensions.width * 0.75,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20,
  },
});

export default FirstOpenPage;
