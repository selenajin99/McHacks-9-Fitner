import {Avatar, Icon, Input} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import firestore, {firebase} from '@react-native-firebase/firestore';
const ChatDetailsPage = ({route, navigation}) => {
  const [memberNames, setMemberNames] = useState([...route.params.memberNames]);
  const [profilePicUri, setProfilePicUri] = useState([
    ...route.params.profilePicUri,
  ]);
  const [chatName, setChatName] = useState(route.params.chatName);

  return (
    <>
      <Input
        label={'Change group name'}
        value={chatName}
        onChangeText={setChatName}
        onSubmitEditing={() => {
          firestore()
            .collection('Chats')
            .doc(route.params.id)
            .update({chatName: chatName});
        }}
        style={{marginVertical: 10, marginHorizontal: 20}}
        accessoryRight={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                firestore()
                  .collection('Chats')
                  .doc(route.params.id)
                  .update({chatName: chatName});
              }}>
              <Icon
                name="arrow-right"
                style={{width: 32, height: 32}}
                fill="#8F9BB3"
              />
            </TouchableOpacity>
          );
        }}
      />
      <FlatList
        style={{alignSelf: 'center'}}
        data={route.params.memberNames}
        renderItem={item => {
          return (
            <View style={{flexDirection: 'row'}}>
              <Avatar
                rounded
                style={{
                  backgroundColor: 'blue',
                  width: 50,
                  height: 50,
                }}
                source={{
                  uri: route.params.profilePicUri[item.index],
                }}
              />
              <Text style={{alignSelf: 'center'}}>{item.item}</Text>
            </View>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => {
          //   console.log('groups');
          firestore()
            .collection('Chats')
            .doc(route.params.id)
            .get()
            .then(doc => {
              doc.ref.update({
                members: doc
                  .data()
                  .members.filter(item => item != auth().currentUser.uid),
              });
              navigation.pop(2);
            });
        }}
        style={{
          position: 'absolute',
          bottom: 50,
          alignSelf: 'center',
        }}>
        <Text style={{color: 'red'}}>Leave group</Text>
      </TouchableOpacity>
    </>
  );
};

export default ChatDetailsPage;
