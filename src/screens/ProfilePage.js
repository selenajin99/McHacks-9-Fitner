import React from 'react';
import {Avatar, Card} from '@ui-kitten/components';
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ProfilePage = ({route}) => {
  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <Avatar
            style={styles.profile}
            source={{
              uri: route.params.user.imageUri,
            }}
          />
        </View>
        <View>
          <Text style={styles.name}>{route.params.user.Name}</Text>
          <Text style={styles.categories}>Bio</Text>
          <Card
            style={{
              marginHorizontal: 20,
              borderRadius: 30,
              height: 90,
              borderStyle: 'dotted',
            }}>
            <Text>{route.params.user.bio}</Text>
          </Card>
        </View>
        <View>
          <Text style={styles.categories}>Activities</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: '5%',
            }}>
            {route.params.user.activities.map((activity, index) => {
              return (
                <View style={styles.chip}>
                  <Text key={index}>{activity}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <ScrollView nestedScrollEnabled={true}>
          <Text style={styles.categories}>Availability</Text>
          {/* availability on Monday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>MONDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Monday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Monday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Monday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Tuesday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>TUESDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Tuesday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Tuesday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Tuesday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Wednesday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>WEDNESDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Wednesday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Wednesday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Wednesday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Thursday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>THURSDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Thursday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Thursday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Thursday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Friday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>FRIDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Friday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Friday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Friday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Saturday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>SATURDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Saturday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Saturday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Saturday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>

          {/* availability on Sunday */}
          <View
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flexDirection: 'row',
              marginHorizontal: '10%',
              marginVertical: '3%',
            }}>
            <View style={{flex: 4, alignSelf: 'stretch'}}>
              <Text>SUNDAY</Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Sunday[0] ? '⏰' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Sunday[1] ? '☀️' : ' '}
              </Text>
            </View>
            <View style={styles.tablecells}>
              <Text>
                {route.params.user.availability.Sunday[2] ? '🌙' : ' '}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
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
    // top: 30,
    // width: Dimensions.get('window').width * 0.55,
    // height: Dimensions.get('window').width * 0.55,
    // alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 10,
  },
  right: {
    padding: 5,
    // position: 'relative',
    // flex: 1,
  },
  name: {
    fontSize: 40,
    marginHorizontal: '6%',
    alignSelf: 'flex-start',
  },
  categories: {
    fontSize: 20,
    marginTop: '5%',
    marginBottom: 13,
    marginHorizontal: '6%',
    alignSelf: 'flex-start',
  },
  daysofweek: {},
  bio: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderRadius: 10,
    width: '90%',
    height: '30%',
    padding: '2%',
    marginHorizontal: '5%',
  },
  chip: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: '2%',
  },
  sports: {
    flexDirection: 'row',
  },
  tablecells: {
    flex: 1.5,
    alignSelf: 'stretch',
  },
  chat: {
    height: 32,
    width: 32,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginLeft: 5,
    // border: 1,
  },
});

export default ProfilePage;
