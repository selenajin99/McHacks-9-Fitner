import React from 'react';
import {Card, Text, Avatar, Icon} from '@ui-kitten/components';
import {View, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

const ProfileCard = props => {
  return (
    <View style={styles.card}>
      <Avatar
        style={styles.profile}
        source={{
          uri: props.imageUri,
        }}
      />
      <View style={styles.right}>
        <Text style={{fontSize: 30, marginBottom: 5}}>{props.name}</Text>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={{fontSize: 13, padding: 2}}>
          {props.bio}
        </Text>
        <View style={{flexDirection: 'row', bottom: 0, position: 'absolute'}}>
          <FlatList
            style={{height: 30}}
            horizontal={true}
            data={
              props.sports
                ? props.sports.filter(item => {
                    if (props.currSports.includes(item)) {
                      return true;
                    } else {
                      return false;
                    }
                  })
                : []
            }
            renderItem={item => {
              return (
                <View style={styles.chip}>
                  <Text style={{justifyContent: 'center'}}>{item.item}</Text>
                </View>
              );
            }}
          />

          <TouchableOpacity
            onPress={() => {
              firestore()
                .collection('Chats')
                .where('members', 'array-contains-any', [
                  auth().currentUser.uid,
                  props.id,
                ])
                .get()
                .then(snapshot => {
                  let chatExists = false;
                  snapshot.docs.forEach((doc, index) => {
                    console.log('going throught' + props.id);
                    if (
                      doc.data().members.length == 2 &&
                      doc.data().members.includes(auth().currentUser.uid) &&
                      doc.data().members.includes(props.id)
                    ) {
                      console.log('HI');
                      props.navigation.navigate('ChatPage', {
                        id: doc.ref.id,
                        chatName: doc.data().chatName,
                        chatCode: doc.data().chatCode,
                        members: [auth().currentUser.uid, props.id],
                      });
                      chatExists = true;
                    }
                    if (
                      index == snapshot.docs.length - 1 &&
                      chatExists == false
                    ) {
                      console.log('creating');
                      firestore()
                        .collection('Chats')
                        .add({chatName: 'New group'})
                        .then(doc => {
                          let chatCode = doc.id.substring(
                            doc.id.length - 4,
                            doc.id.length,
                          );
                          doc.update({
                            chatCode,
                            members: [auth().currentUser.uid, props.id],
                          });
                          props.navigation.navigate('ChatPage', {
                            id: doc.id,
                            chatName: 'New group',
                            chatCode,
                            members: [auth().currentUser.uid, props.id],
                          });
                        });
                    }
                  });
                });
            }}>
            <Icon
              style={styles.chat}
              fill="#8F9BB3"
              name="message-circle-outline"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
    height: 140,
    backgroundColor: 'white',
    flexDirection: 'row',
    position: 'relative',
  },
  profile: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  right: {
    padding: 5,
    position: 'relative',
    flex: 1,
  },
  chip: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  sports: {
    flexDirection: 'row',
  },
  chat: {
    height: 32,
    width: 32,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginLeft: 5,
    border: 1,
  },
});

export default ProfileCard;
