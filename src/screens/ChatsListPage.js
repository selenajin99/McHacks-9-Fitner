import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import ChatLists from '../components/ChatLists';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Icon} from '@ui-kitten/components';

const ChatsListPage = ({navigation}) => {
  const [chats, setChats] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {}}>
              <Icon
                style={{width: 32, height: 32}}
                fill="#8F9BB3"
                name="people-outline"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Icon
                style={{width: 32, height: 32}}
                fill="#8F9BB3"
                name="plus"
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    const bob = firestore()
      .collection('Chats')
      .where('members', 'array-contains', auth().currentUser.uid)
      .onSnapshot(snapshot => {
        setChats(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})));
      });
    return bob;
  }, []);
  return (
    <FlatList
      data={chats}
      renderItem={item => {
        return (
          <ChatLists
            key={item.index}
            id={item.item.id}
            chatName={item.item.data.chatName}
            chatCode={item.item.data.chatCode}
            navigation={navigation}
          />
        );
      }}
    />
  );
};

export default ChatsListPage;
