import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Button, ListItem, Divider} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';

const ChatLists = ({id, chatName, navigation, chatCode, members}) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const bob = firestore()
      .collection('Chats')
      .doc(id)
      .collection('Messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setChatMessages(snapshot.docs.map(doc => doc.data()));
      });
    return bob;
  }, []);

  const ItemImage = props => (
    <>
      <Avatar
        bottom={-10}
        left={8}
        position="relative"
        rounded
        style={{width: 35, height: 35}}
        source={{
          uri: profilePicUri[memberNames.length - 2],
        }}
      />
      <Avatar
        bottom={10}
        right={8}
        position="relative"
        rounded
        style={{width: 35, height: 35}}
        source={{
          uri: profilePicUri[memberNames.length - 1],
        }}
      />
    </>
  );

  const [memberNames, setMemberNames] = useState([]);
  const [profilePicUri, setProfilePicUri] = useState([]);

  useEffect(() => {
    let temp = [];
    let imgTmp = [];
    members.forEach((member, index) => {
      firestore()
        .collection('Users')
        .doc(member)
        .get()
        .then(doc => {
          temp.push(doc.data().Name);
          imgTmp.push(doc.data().imageUri);
          if (index === members.length - 1) {
            setMemberNames(temp);
            // console.log(temp);
            setProfilePicUri(imgTmp);
            // console.log(imgTmp);
          }
        });
    });
  }, []);

  const renderItemAccessory = props => (
    <Text style={{fontSize: 12}}>
      {chatMessages?.[0]?.timestamp?.toDate().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Text>
  );

  return (
    <View>
      <ListItem
        key={id}
        title={evaProps => (
          <Text
            style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              marginLeft: 12,
            }}>
            {chatName}
          </Text>
        )}
        description={evaProps => {
          if (chatMessages?.[0]?.message != null) {
            return (
              <Text style={{color: 'black', fontSize: 10, marginLeft: 12}}>
                {chatMessages?.[0]?.sender}: {chatMessages?.[0]?.message}
              </Text>
            );
          } else {
            return null;
          }
        }}
        accessoryLeft={ItemImage}
        accessoryRight={renderItemAccessory}
        onPress={() =>
          navigation.navigate('ChatPage', {
            id,
            chatName,
            chatCode,
            members,
          })
        }
      />
      <Divider />
    </View>
  );
};

export default ChatLists;
