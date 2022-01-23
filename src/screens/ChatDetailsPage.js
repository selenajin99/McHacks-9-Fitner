import {Avatar} from '@ui-kitten/components';
import React, {useLayoutEffect} from 'react';
import {View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const ChatDetailsPage = ({route}) => {
  console.log(route.params);

  useLayoutEffect(() => {}, []);
  return (
    <View style={{alignContent: 'center'}}>
      {route.params.memberNames.map((member, index) => (
        <View
          style={{
            alignSelf: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Avatar
            rounded
            style={{
              width: 50,
              height: 50,
            }}
            source={{
              uri: route.params.profilePicUri[index],
            }}
          />
          <Text
            style={{
              flex: 1,
            }}>
            {member}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ChatDetailsPage;
