/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */
import 'react-native-gesture-handler'
import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import {
	ApplicationProvider,
	BottomNavigation,
	BottomNavigationTab,
	Button,
	Icon,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as eva from '@eva-design/eva'
import ProfilePage from './src/screens/ProfilePage'
import AccountPage from './src/screens/AccountPage'
import ExplorePage from './src/screens/ExplorePage'
import ChatsListPage from './src/screens/ChatsListPage'

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const HeartIcon = (props) => <Icon {...props} name='heart' />

const { Navigator, Screen } = createBottomTabNavigator()

const BottomTabBar = ({ navigation, state }) => (
	<BottomNavigation
		selectedIndex={state.index}
		onSelect={(index) => navigation.navigate(state.routeNames[index])}>
		<BottomNavigationTab title='Explore' icon={<Icon name='search-outline'></Icon>} />
		<BottomNavigationTab title='Chats' icon={<Icon name='message-circle-outline'></Icon>} />
		<BottomNavigationTab title='Account' icon={<Icon name='person-outline'></Icon>} />
	</BottomNavigation>
)

const TabNavigator = () => (
	<Navigator tabBar={(props) => <BottomTabBar {...props} />}>
		<Screen name='Explore' component={ExplorePage} />
		<Screen name='Chats' component={ChatsListPage} />
		<Screen name='Account' component={AccountPage} />
	</Navigator>
)

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={eva.light}>
			<NavigationContainer>
				<TabNavigator />
			</NavigationContainer>
		</ApplicationProvider>
	</>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		textAlign: 'center',
	},
	likeButton: {
		marginVertical: 16,
	},
})
