/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Input, Avatar, Card, Tooltip} from '@ui-kitten/components';
import {TouchableOpacity} from 'react-native-gesture-handler';

const LandingPage = ({navigation}) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            alignSelf: 'center',
            marginTop: '50%',
          }}>
          Welcome to FITNER
        </Text>
        <Avatar
          style={styles.logo}
          source={require('../assets/logo.png')}></Avatar>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,

            alignSelf: 'center',
          }}>
          COOL SENTENCE
        </Text>
        <Button
          onPress={() => {
            navigation.navigate('SignUpPage');
          }}
          style={styles.button}>
          GET STARTED
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 200,
    marginVertical: '10%',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  button: {
    alignSelf: 'center',
    marginVertical: '20%',
    width: '40%',
    borderRadius: 15,
  },
});
export default LandingPage;
