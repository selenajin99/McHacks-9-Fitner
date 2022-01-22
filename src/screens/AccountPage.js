import React, { useState } from 'react'
import { View, Text } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { CheckBox } from '@ui-kitten/components'

const AccountPage = () => {
	const [monday, setMonday] = useState([0, 1, 2])
	const [mondayChecked, setMondayChecked] = useState
	const refreshMonday = () => {}
	return (
		<View>
			<Text></Text>
			<CheckBox
				checked={monday[0] && monday[1] && monday[2]}
				// indeterminate={monday.morning || monday.afternoon || monday.evening}
			>
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
