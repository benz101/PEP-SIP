import React, { PureComponent } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet
} from "react-native";
// import { StackActions, NavigationActions } from 'react-navigation';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../assets/constants/colors';
import * as Keychain from 'react-native-keychain';
import { CommonActions } from '@react-navigation/routers';
import { useSelector } from 'react-redux';

export default function Account({ navigation }) {
	const resultUser = useSelector((state) => state.user.params);
	
	const onLogout = async () => {
		try {
			// const remove_account = await AsyncStorage.removeItem("user")
			// const remove = await Keychain.resetGenericPassword()
			// const remove_roles = await AsyncStorage.removeItem("roles")
			await Keychain.resetInternetCredentials();
			await AsyncStorage.removeItem("isLogin");
			await AsyncStorage.removeItem("isUserData");
			await AsyncStorage.removeItem("isRoles");
			await AsyncStorage.removeItem("isSelected");
			return goNavigate()
		} catch (error) {
			goNavigate()
		}
	}

	const goNavigate = (res) => {
		// navigation.dispatch(StackActions.reset({
		// 	index: 0,
		// 	actions: [
		// 		NavigationActions.navigate({ routeName: "Login" })
		// 	]
		// }))
		navigation.dispatch(
			CommonActions.reset({
			  index: 1,
			  routes: [{ name: "Login" }]
			})
		  );
	}

	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<Image source={require('../../../src/assets/images/profile.png')} style={{ width: 100, height: 100 }} />
				<Text style={{ marginTop: 10, fontSize: 18 }}>{resultUser.user.username}</Text>
				<Text style={{ marginTop: 10 }}>{resultUser.user.roles}</Text>
			</View>
			<Button
				buttonStyle={styles.btn}
				title="Log Out"
				onPress={onLogout}
			/>
			<View style={styles.version}>
				<Text>Version 1.1</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	imgContainer: {
		margin: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btn: {
		margin: 10,
		marginTop: -5,
		backgroundColor: colors.blue,
	},
	version: {
		flex: 1,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'flex-end'
	}
})