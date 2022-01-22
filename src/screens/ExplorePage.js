/* eslint-disable react-hooks/exhaustive-deps */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
import {Input} from '@ui-kitten/components';

const ExplorePage = () => {
  const [value, setValue] = useState('');
  const [filteredusers, setFilteredusers] = useState([]);
  const [currentUserSports, setCurrentUserSports] = useState([]);
  const getMatchedUsers = () => {
    firestore()
      .collection('Users')
      .get()
      .then(docs => {
        var tempUsers = [];
        docs.forEach(doc => {
          if (auth().currentUser.uid === doc.ref.id) {
            setCurrentUserSports(doc._data.activities);
          } else {
            tempUsers.push(doc._data);
          }
        });
        setFilteredusers(tempUsers);
      });
  };

  const isMatched = user => {
    var matchedSports = [];
    // check matched sports

    // check avalibility

    return matchedSports;
  };

  const search = nextValue => {
    const bob = firestore();
    if (nextValue.length !== 0) {
      // TODO implement search for sports function
      firestore()
        .collection('Users')
        .where('Name', '>=', nextValue)
        .where('Name', '<=', nextValue + '\uf8ff')
        .get()
        .then(docs => {
          var tempUsers = [];
          docs.forEach(doc => {
            tempUsers.push(doc._data);
          });
          setFilteredusers(tempUsers);
        });
    } else {
      getMatchedUsers();
    }
    return bob;
  };

  useEffect(() => {
    getMatchedUsers();
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
          search(nextValue);
        }}
      />
      <FlatList
        ListFooterComponent={() => {
          return <View style={{margin: '10%'}}></View>;
        }}
        data={filteredusers}
        renderItem={item => {
          console.log('PERSON X');
          console.log(item.item.activities);
          return (
            <ProfileCard
              currSports={currentUserSports}
              name={item.item.Name}
              sports={item.item.activities}
              bio={item.item.bio}
            />
          );
        }}
      />
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
