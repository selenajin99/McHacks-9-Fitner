import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Icon, Modal, Card, Button, Avatar} from '@ui-kitten/components';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ChatPage = ({navigation, route}) => {
  console.log('hi');

  console.log(route.params);
  const [input, setInput] = useState('');
  const [senderName, setSenderName] = useState('');
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [memberNames, setMemberNames] = useState([]);
  const [profilePicUri, setProfilePicUri] = useState([]);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        setSenderName(doc.data().Name);
      });

    let temp = [];
    let imgTmp = [];
    route.params.members.forEach((member, index) => {
      firestore()
        .collection('Users')
        .doc(member)
        .get()
        .then(doc => {
          temp.push(doc.data().Name);
          imgTmp.push(doc.data().imageUri);
          if (index === route.params.members.length - 1) {
            setMemberNames(temp);
            console.log(temp);
            setProfilePicUri(imgTmp);
            console.log(imgTmp);
          }
        });
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setVisible(true);
            }}>
            <Text style={{fontSize: 20}}> {route.params.chatName}</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => {
        return (
          <Text style={{fontSize: 12, marginEnd: 10}}>
            Room Code: {route.params.chatCode}
          </Text>
        );
      },
    });
  }, [navigation]);

  const sendMessage = () => {
    firestore()
      .collection('Chats')
      .doc(route.params.id)
      .collection('Messages')
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        sender: senderName,
      });

    setInput('');
  };

  useLayoutEffect(() => {
    const rob = firestore()
      .collection('Chats')
      .doc(route.params.id)
      .collection('Messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot =>
        setMessages(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()}))),
      );
    return rob;
  }, [route]);

  const scrollViewRef = React.useRef();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styles.container}
        keyboardVerticalOffset={120}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <KeyboardAwareScrollView
              contentContainerStyle={{paddingBottom: 15, paddingTop: 15}}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({animated: true})
              }>
              {messages.map(({id, data}) =>
                data.sender !== senderName ? (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      marginEnd={10}
                      bottom={-15}
                      left={-5}
                      position="absolute"
                      rounded
                      style={{width: 30, height: 30}}
                      source={{
                        uri: profilePicUri[memberNames.indexOf(data.sender)],
                      }}
                    />
                    <Text style={styles.recieverText}>{data.message}</Text>
                    <Text style={styles.recieverName}>{data.sender}</Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    <Avatar
                      marginEnd={10}
                      bottom={-15}
                      right={-15}
                      position="absolute"
                      rounded
                      style={{width: 30, height: 30}}
                      source={{
                        uri: profilePicUri[memberNames.indexOf(data.sender)],
                      }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>me</Text>
                  </View>
                ),
              )}
            </KeyboardAwareScrollView>
            <Modal visible={visible}>
              <Card disabled={true}>
                <Text>Group Chat Members:</Text>
                <ScrollView>
                  {memberNames.map((member, index) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Avatar
                        rounded
                        style={{
                          width: 25,
                          height: 25,
                        }}
                        source={{
                          uri: profilePicUri[index],
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
                </ScrollView>
                <Button size="tiny" onPress={() => setVisible(false)}>
                  DISMISS
                </Button>
              </Card>
            </Modal>
            <View style={styles.footer}>
              <TextInput
                onFocus={() => {
                  scrollViewRef.current.scrollToEnd({animated: true});
                }}
                value={input}
                onChangeText={text => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Message..."
                style={styles.textInput}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Icon
                  style={styles.icon}
                  fill="#8F9BB3"
                  name="paper-plane-outline"
                />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {flex: 1},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    padding: 10,
    marginRight: 15,
    backgroundColor: '#ECECEC',
    color: 'grey',
    borderRadius: 30,
  },
  icon: {
    width: 24,
    height: 24,
    color: 'blue',
  },
  recieverText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
    fontSize: 15,

    marginBottom: 15,
  },
  recieverName: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: 'white',
  },
  senderName: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: 'white',
  },
  reciever: {
    padding: 15,
    backgroundColor: 'lightblue',
    alignSelf: 'flex-start',
    borderRadius: 30,
    marginLeft: 15,
    marginBottom: 30,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    backgroundColor: 'lightgreen',
    alignSelf: 'flex-end',
    borderRadius: 30,
    marginRight: 15,
    marginBottom: 30,
    maxWidth: '80%',
    position: 'relative',
  },
});
