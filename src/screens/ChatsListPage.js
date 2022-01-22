import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import ChatLists from '../components/ChatLists';
import firestore from '@react-native-firebase/firestore';

const ChatsListPage = ({navigation}) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const bob = firestore()
      .collection('Chats')
      .onSnapshot(snapshot => {
        setChats(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})));
        console.log(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})));
      });
    return bob;
  }, []);
  return (
    <ScrollView>
      {chats.map(({id, data: {chatName}}) => (
        <ChatLists
          key={id}
          id={id}
          chatName={chatName}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  );
};

export default ChatsListPage;
