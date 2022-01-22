import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import ChatLists from '../components/ChatLists';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button, Card, Icon, Input, Modal, Text} from '@ui-kitten/components';

const ChatsListPage = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newGroupVisible, setNewGroupVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
                // firestore()
                //   .collection('Chats')
                //   .where('chatCode', '==', '')
                //   .doc.update({
                //     members: firestore.FieldValue.arrayUnion(
                //       auth().currentUser.uid,
                //     ),
                //   });
              }}>
              <Icon
                style={{width: 32, height: 32}}
                fill="#8F9BB3"
                name="people-outline"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setNewGroupVisible(true);
                // firestore()
                //   .collection('Chats')
                //   .add({chatName: 'New group'})
                //   .then(doc => {
                //     doc.update({
                //       chatCode: doc.id.substring(
                //         doc.id.length - 4,
                //         doc.id.length,
                //       ),
                //       members: [auth().currentUser.uid],
                //     });
                //   });
              }}>
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

  const [chatCode, setChatCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  return (
    <>
      <Modal visible={visible}>
        <Card disabled={true}>
          <Text>Please enter the chat code you would like to join</Text>
          <Input
            value={chatCode}
            onChangeText={setChatCode}
            accessoryRight={
              <TouchableOpacity
                onPress={() => {
                  firestore()
                    .collection('Chats')
                    .where('chatCode', '==', chatCode)
                    .get()
                    .then(docs => {
                      docs.forEach(doc => {
                        let newMember = firestore.FieldValue.arrayUnion(
                          auth().currentUser.uid,
                        );
                        doc.ref.update({members: newMember});
                        setVisible(false);
                      });
                    });
                }}>
                <Icon
                  style={{width: 32, height: 32}}
                  fill="#8F9BB3"
                  name="arrow-right"
                />
              </TouchableOpacity>
            }
          />
          <Button onPress={() => setVisible(false)}>DISMISS</Button>
        </Card>
      </Modal>
      <Modal visible={newGroupVisible}>
        <Card disabled={true}>
          <Text>Please enter a group name</Text>
          <Input
            value={newGroupName}
            onChangeText={setNewGroupName}
            accessoryRight={
              <TouchableOpacity
                onPress={() => {
                  firestore()
                    .collection('Chats')
                    .add({chatName: newGroupName})
                    .then(doc => {
                      doc.update({
                        chatCode: doc.id.substring(
                          doc.id.length - 4,
                          doc.id.length,
                        ),
                        members: [auth().currentUser.uid],
                      });
                    });
                  setNewGroupVisible(false);
                  setNewGroupName('');
                }}>
                <Icon
                  style={{width: 32, height: 32}}
                  fill="#8F9BB3"
                  name="arrow-right"
                />
              </TouchableOpacity>
            }
          />
          <Button
            onPress={() => {
              setNewGroupVisible(false);
              setNewGroupName('');
            }}>
            DISMISS
          </Button>
        </Card>
      </Modal>
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
    </>
  );
};

export default ChatsListPage;
