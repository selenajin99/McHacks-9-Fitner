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
import {Icon, Tooltip} from '@ui-kitten/components';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatPage = ({navigation, route}) => {
  console.log(route.params);
  const [input, setInput] = useState('');
  const [senderName, setSenderName] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        setSenderName(doc.data().Name);
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
          <Text style={{fontSize: 20}}> {route.params.chatName}</Text>
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
    Keyboard.dismiss();

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

  const scrollViewRef = React.createRef();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styles.container}
        // keyboardVerticalOffset={120}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView ref={scrollViewRef}>
              {messages.map(({id, data}) =>
                data.sender !== senderName ? (
                  <View key={id} style={styles.reciever}>
                    <Text style={styles.recieverText}>
                      {data.sender}({data.timestamp.toDate().getHours()}:
                      {data.timestamp.toDate().getMinutes()})- {data.message}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    <Text style={styles.senderText}>
                      {data.sender}: {data.message}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>

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
  recieverText: {},
  senderText: {},
  reciever: {
    padding: 15,
    backgroundColor: 'lightblue',
    alignSelf: 'flex-start',
    borderRadius: 30,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    backgroundColor: 'lightgreen',
    alignSelf: 'flex-end',
    borderRadius: 30,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
});
