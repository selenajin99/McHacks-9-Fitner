import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

const ExplorePage = () => {
	const [username, setUsername] = useState([])

	useEffect(() => {
		//how to pull from firestore
		const bob = firestore()
			.collection('Users')
			.doc('tDywtpawk5ReOYza0Lpo')
			.get()
			.then((bobb) => {
				setUsername(bobb.data().Name)
			})
	}, [])

	return (
		<View>
			<Text>{username}</Text>
		</View>
	)
}

export default ExplorePage
