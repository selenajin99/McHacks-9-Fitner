/* eslint-disable react-hooks/exhaustive-deps */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
import {Input} from '@ui-kitten/components';
import {useIsFocused} from '@react-navigation/native';

const ExplorePage = () => {
  const [value, setValue] = useState('');
  const [filteredusers, setFilteredusers] = useState([]);
  const [currentUserSports, setCurrentUserSports] = useState([]);
  const [currentUserTimes, setCurrentUserTimes] = useState([]);
  const getMatchedUsers = () => {
    setFilteredusers([]);
    firestore()
      .collection('Users')
      .get()
      .then(docs => {
        var tempUsers = [];
        docs.forEach(doc => {
          if (auth().currentUser.uid === doc.ref.id) {
            setCurrentUserSports(doc._data.activities);
            setCurrentUserTimes(doc._data.avalibilities);
          } else {
            tempUsers.push(doc._data);
          }
        });
        setFilteredusers(tempUsers);
      });
  };

  const isMatched = user => {
    // check matched sports
    console.log(user.Name);
    if (
      user.activities &&
      user.activities.some(item => currentUserSports.includes(item))
    ) {
      console.log(' MATHCED');
      console.log(user.activities);
      return true;

      // check avalibility
    } else {
      console.log('NOT MATHCED');
      console.log(user.activities);
      return false;
    }
  };

  const search = nextValue => {
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
  };

  useEffect(() => {
    getMatchedUsers();
  }, [useIsFocused()]);

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
        style={{height: '100%'}}
        onRefresh={getMatchedUsers}
        refreshing={!filteredusers}
        ListFooterComponent={() => {
          return <View style={{margin: '10%'}}></View>;
        }}
        data={filteredusers.filter(item => {
          if (isMatched(item)) return true;
          else return false;
        })}
        renderItem={item => {
          return (
            <ProfileCard
              imageUri={item.item.imageUri}
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
