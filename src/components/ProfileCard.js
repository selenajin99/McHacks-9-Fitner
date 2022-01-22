import React from 'react';
import {Card, Text, Avatar, Button} from '@ui-kitten/components';
import {View, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileCard = props => {
  return (
    <Card
      style={{
        margin: 10,
        borderRadius: 15,
      }}>
      <View style={styles.card}>
        <Avatar
          style={styles.profile}
          source={{
            uri: 'https://i.pinimg.com/originals/b3/ff/3a/b3ff3accc46377d013a80eb9519c8c1c.jpg',
          }}
        />
        <View style={styles.right}>
          <Text style={{fontSize: 30, marginBottom: 10}}>{props.name}</Text>
          <View style={styles.sports}>
            <Text style={styles.chip}>Soccer</Text>
            <Text style={styles.chip}>More</Text>
          </View>
          <Button
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
            Chat
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
  },
  profile: {
    height: 120,
    width: 120,
  },
  right: {
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
  chip: {
    borderRadius: 10,
    borderColor: ' black',
    borderWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  sports: {
    flexDirection: 'row',
  },
});

export default ProfileCard;
