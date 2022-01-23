/* eslint-disable react-hooks/exhaustive-deps */
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Icon, Avatar} from '@ui-kitten/components';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ChatPage = ({navigation, route}) => {
  const [input, setInput] = useState('');
  const [senderName, setSenderName] = useState('');
  const [messages, setMessages] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [profilePicUri, setProfilePicUri] = useState([]);
  let memberNamesLocal = [];
  let memberPicsLocal = [];
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
            memberNamesLocal = temp;

            setProfilePicUri(imgTmp);
            memberPicsLocal = imgTmp;
            console.log(imgTmp);
          }
        });
    });
    const rob = firestore()
      .collection('Chats')
      .doc(route.params.id)
      .collection('Messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot =>
        setMessages(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()}))),
      );
    return rob;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              console.log(memberNames);
              navigation.push('ChatDetailsPage', {
                members: route.params.members,
                memberNames: memberNamesLocal,
                profilePicUri: memberPicsLocal,
                chatName: route.params.chatName,
                id: route.params.id,
              });
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
                  <View>
                    <Avatar
                      marginEnd={10}
                      bottom={-55}
                      right={-17}
                      position="relative"
                      rounded
                      style={{width: 30, height: 30, alignSelf: 'flex-start'}}
                      source={{
                        uri: profilePicUri[memberNames.indexOf(data.sender)],
                      }}
                    />
                    <View key={id} style={styles.reciever}>
                      <Text style={styles.recieverText}>{data.message}</Text>
                      <Text style={styles.recieverName}>{data.sender}</Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <Avatar
                      marginEnd={10}
                      bottom={-55}
                      left={-5}
                      position="relative"
                      rounded
                      style={{width: 30, height: 30, alignSelf: 'flex-end'}}
                      source={{
                        uri: profilePicUri[memberNames.indexOf(data.sender)],
                      }}
                    />
                    <View key={id} style={styles.sender}>
                      <Text style={styles.senderText}>{data.message}</Text>
                      <Text style={styles.senderName}>me</Text>
                    </View>
                  </View>
                ),
              )}
            </KeyboardAwareScrollView>

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
  container: {flex: 1, backgroundColor: '#e8e8e8'},

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
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 10,
    marginVertical: 0,
    fontSize: 15,
  },
  senderText: {
    color: 'black',
    fontWeight: '500',
    marginHorizontal: 10,
    fontSize: 15,
    marginVertical: 0,
  },
  recieverName: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: 'black',
    marginLeft: 9,
    position: 'relative',
    top: -52,
    left: 0,
  },
  senderName: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: 'black',
    marginRight: 8,
    position: 'relative',
    top: -52,
    right: 0,
  },
  reciever: {
    padding: 15,
    backgroundColor: '#b0b0b0',
    alignSelf: 'flex-start',
    borderRadius: 30,
    marginLeft: 50,
    marginBottom: 30,
    maxWidth: '90%',
    position: 'relative',
    maxHeight: 55,
  },
  sender: {
    padding: 15,
    backgroundColor: '#1982FC',
    alignSelf: 'flex-end',
    borderRadius: 30,
    marginRight: 50,
    marginBottom: 30,
    maxWidth: '90%',
    position: 'relative',
    maxHeight: 55,
  },
});
