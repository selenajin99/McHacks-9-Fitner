import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import ChatLists from '../components/ChatLists';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button, Card, Icon, Input, Modal, Text} from '@ui-kitten/components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

console.disableYellowBox = true;
const ChatsListPage = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newGroupVisible, setNewGroupVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: 'lightblue'},
      headerTitleStyle: {color: 'black'},
      headerTintColor: 'black',
      headerTitle: () => (
        <View>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}> Chat</Text>
        </View>
      ),
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 80,
              marginRight: 15,
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setVisible(true);
              }}>
              <Icon
                style={{width: 22, height: 22}}
                fill="#8F9BB3"
                name="people-outline"
              />
              <Text style={{fontSize: 8, alignSelf: 'center'}}>Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setNewGroupVisible(true);
              }}>
              <Icon
                style={{width: 22, height: 22}}
                fill="#8F9BB3"
                name="plus"
              />
              <Text style={{fontSize: 8, alignSelf: 'center'}}>Create</Text>
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
      <Modal
        visible={visible}
        onBackdropPress={() => {
          setVisible(false), setChatCode('');
        }}>
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
                        setChatCode('');
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
        </Card>
      </Modal>
      <Modal
        visible={newGroupVisible}
        onBackdropPress={() => {
          setNewGroupVisible(false), setNewGroupName('');
        }}>
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
        </Card>
      </Modal>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => {
          return (
            <View style={styles.noChatView}>
              <Text style={styles.noChat}>
                Go explore to chat with new people!
              </Text>
            </View>
          );
        }}
        data={chats}
        renderItem={item => (
          <ChatLists
            key={item.index}
            id={item.item.id}
            chatName={item.item.data.chatName}
            chatCode={item.item.data.chatCode}
            navigation={navigation}
            members={item.item.data.members}
          />
        )}
      />
    </>
  );
};

export default ChatsListPage;

const styles = StyleSheet.create({
  noChat: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  noChatView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
