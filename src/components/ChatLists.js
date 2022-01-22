import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, Button, ListItem, Divider} from '@ui-kitten/components';

const ChatLists = ({id, chatName, enterChat}) => {
  console.log(chatName);
  console.log(id);

  const ItemImage = props => (
    <Avatar
      {...props}
      style={[props.style, {tintColor: null}]}
      source={'../../assets/icon.png'}
    />
  );
  return (
    <View>
      <ListItem
        key={id}
        title={chatName}
        description={id}
        accessoryLeft={ItemImage}
      />
      <Divider />
    </View>
  );
};

export default ChatLists;

const styles = StyleSheet.create({});
