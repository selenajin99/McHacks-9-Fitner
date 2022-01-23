/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Switch} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import auth from '@react-native-firebase/auth';
import {Input} from '@ui-kitten/components';
import {useIsFocused} from '@react-navigation/native';

const ExplorePage = ({navigation}) => {
  const isMounted = useRef(false);
  const [value, setValue] = useState('');
  const [filteredusers, setFilteredusers] = useState([]);
  const [currentUserSports, setCurrentUserSports] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const getMatchedUsers = () => {
    if (isMounted.current) {
      setFilteredusers([]);
      firestore()
        .collection('Users')
        .get()
        .then(docs => {
          var tempUsers = [];
          docs.forEach(doc => {
            if (auth().currentUser.uid === doc.ref.id) {
              setCurrentUserSports(doc._data.activities);
            } else {
              tempUsers.push({...doc._data, id: doc.ref.id});
            }
          });
          setFilteredusers(tempUsers);
        });
    }
  };

  const isMatched = user => {
    // check matched sports
    if (
      user.activities &&
      user.activities.some(item => currentUserSports.includes(item))
    ) {
      return true;
    } else {
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
    isMounted.current = true;
    getMatchedUsers();
    return () => (isMounted.current = false);
  }, [useIsFocused()]);

  return (
    <View>
      {/* <Text>Hello, {username}</Text> */}
      <View style={{flexDirection: 'row'}}>
        <Input
          style={styles.searchbar}
          placeholder="Search"
          value={value}
          style={{flex: 6, margin: '1%'}}
          onChangeText={nextValue => {
            setValue(nextValue);
            search(nextValue);
          }}
        />
        <Switch
          trackColor={{false: '#ffffff', true: '#000000'}}
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          style={{alignSelf: 'center', margin: '1%'}}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <FlatList
        style={{height: '100%'}}
        onRefresh={getMatchedUsers}
        refreshing={!filteredusers}
        ListFooterComponent={() => {
          return <View style={{margin: '10%'}}></View>;
        }}
        data={filteredusers.filter(item => {
          if (isEnabled) {
            if (isMatched(item)) return true;
            else return false;
          } else {
            return true;
          }
        })}
        renderItem={item => {
          return (
            <ProfileCard
              id={item.id}
              navigation={navigation}
              user={item.item}
              currSports={currentUserSports}
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
