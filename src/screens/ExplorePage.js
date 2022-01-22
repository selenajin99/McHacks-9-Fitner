import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
import {Input} from '@ui-kitten/components';

const ExplorePage = () => {
  const [username, setUsername] = useState([]);
  const [value, setValue] = useState('');
  const [filteredusers, setFilteredusers] = useState([]);
  const users = firestore().collection('Users');
  const chats = [];

  const getMatchedUsers = () => {
    firestore()
      .collection('Users')
      .get()
      .then(docs => {
        var tempUsers = [];
        docs.forEach(doc => {
          tempUsers.push(doc._data);
        });
        setFilteredusers(tempUsers);
      });
  };
  const search = () => {
    const bob = firestore();
    users.where('Name', 'array-contains', value).onSnapshot(snapshot => {
      setFilteredusers(
        snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
      );
    });
    return bob;
  };

  useEffect(() => {
    getMatchedUsers();
    //   firestore()
    //     .collection('Users')
    //     .doc(auth().currentUser.uid)
    //     .get()
    //     .then(doc => {
    //       setUsername(doc.data().Name);
    //     });
    console.log('filtered shitt');
    console.log(filteredusers);
  }, []);

  return (
    <View>
      {/* <Text>Hello, {username}</Text> */}
      <Input
        style={styles.searchbar}
        placeholder="Search"
        value={value}
        onChangeText={nextValue => {
          setValue(nextValue);
          search();
        }}
      />
      <FlatList
        data={filteredusers}
        renderItem={item => {
          return <ProfileCard name={item.item.Name} />;
        }}
      />
      <ProfileCard name={'Pussy Cat'} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default ExplorePage;
