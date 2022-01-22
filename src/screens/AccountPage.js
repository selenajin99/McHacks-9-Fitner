import React, {useState} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {CheckBox} from '@ui-kitten/components';

const DayCheckboxes = ({day, setDay}) => {
  return (
    <>
      <CheckBox
        checked={day.morning && day.afternoon && day.evening}
        indeterminate={
          (day.morning || day.afternoon || day.evening) &&
          !(day.morning && day.afternoon && day.evening)
        }
        onChange={() => {
          if (day.morning || day.afternoon || day.evening) {
            setDay({
              morning: false,
              afternoon: false,
              evening: false,
              name: day.name,
            });
          } else {
            setDay({
              morning: true,
              afternoon: true,
              evening: true,
              name: day.name,
            });
          }
        }}>
        {day.name}
      </CheckBox>
      <View style={{marginLeft: 25}}>
        <CheckBox
          checked={day.morning}
          onChange={() => {
            setDay({...day, morning: !day.morning});
          }}>
          Morning
        </CheckBox>
        <CheckBox
          checked={day.afternoon}
          onChange={() => {
            setDay({...day, afternoon: !day.afternoon});
          }}>
          Afternoon
        </CheckBox>
        <CheckBox
          checked={day.evening}
          onChange={() => {
            setDay({...day, evening: !day.evening});
          }}>
          Evening
        </CheckBox>
      </View>
    </>
  );
};

const AccountPage = () => {
  const [monday, setMonday] = useState({
    name: 'Monday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [tuesday, setTuesday] = useState({
    name: 'Tuesday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [wednesday, setWednesday] = useState({
    name: 'Wednesday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [thursday, setThursday] = useState({
    name: 'Thursday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [friday, setFriday] = useState({
    name: 'Friday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [saturday, setSaturday] = useState({
    name: 'Saturday',
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [sunday, setSunday] = useState({
    name: 'Sunday',
    morning: false,
    afternoon: false,
    evening: false,
  });

  return (
    <View style={{alignSelf: 'center'}}>
      <Text></Text>
      <DayCheckboxes day={monday} setDay={setMonday} />
      <DayCheckboxes day={tuesday} setDay={setTuesday} />
    </View>
  );
};

export default AccountPage;
