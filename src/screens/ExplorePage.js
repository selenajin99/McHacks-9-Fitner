import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

const ExplorePage = () => {
	const [username, setUsername] = useState([])

	useEffect(() => {
		const bob = firestore().collection('Users').doc('tDywtpawk5ReOYza0Lpo').get()
	}, [])

	return (
		<View>
			<Text>{username}</Text>
		</View>
	)
}

export default ExplorePage
