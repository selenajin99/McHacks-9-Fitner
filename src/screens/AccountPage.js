import React, { useState } from 'react'
import { View, Text } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { CheckBox } from '@ui-kitten/components'

const AccountPage = () => {
	const [monday, setMonday] = useState([false, false, true])
	const [mondayChecked, setMondayChecked] = useState
	const refreshMonday = () => {}
	return (
		<View>
			<Text></Text>
			<CheckBox
				checked={monday[0] && monday[1] && monday[2]}
				indeterminate={monday[0] || monday[1] || monday[2]}>
				Monday
			</CheckBox>
			{/* <CheckBox
				checked={() => {
					if (monday.morning) {
						return true
					}
				}}
				onChange={() => {
					console.log(monday)
					setMonday({ ...monday, morning: !monday.morning })
				}}>
				Morning
			</CheckBox> */}
		</View>
	)
}

export default AccountPage
