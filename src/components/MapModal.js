import {Button, Card, Modal} from '@ui-kitten/components';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const dimensions = Dimensions.get('window');
const MapModal = ({
  setCity,
  city,
  mapVisible,
  setMapVisible,
  region,
  setRegion,
  dismissButtonFunction,
}) => {
  return (
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
                        component.types.includes('administrative_area_level_1')
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
        <Button
          onPress={
            dismissButtonFunction
              ? dismissButtonFunction
              : () => setMapVisible(false)
          }>
          Select: {city}
        </Button>
      </Card>
    </Modal>
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

export default MapModal;
