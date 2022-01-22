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
                    console.log('ALL SPORTS' + props.sports);
                    if (props.currSports.includes(item)) {
                      console.log(props.currSports + ' HAS ' + item);
                      return true;
                    } else {
                      console.log(props.currSports + ' does not have ' + item);
                      return false;
                    }
                  })
                : []
            }
            renderItem={item => {
              console.log('HI');
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
                .add({chatName: 'New group'})
                .then(doc => {
                  doc.update({
                    chatCode: doc.id.substring(
                      doc.id.length - 4,
                      doc.id.length,
                    ),
                    members: [auth().currentUser.uid, 'tomsid'],
                  });
                  //navigate to chat that was created
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
    marginTop: 1,
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
