import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Alert, FlatList, ScrollView, Dimensions, TextInput, StyleSheet, StatusBar, } from 'react-native';
import { FormInput, Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/constants/colors';
import Axios from 'axios';
import configUrl from '../../assets/constants/config';
// import { StackActions } from 'react-navigation';
import globalStyles from '../global/styles';
import TouchableItem from '../global/Touchable';
import { StackActions } from '@react-navigation/routers';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const height = screenHeight < screenWidth ? screenWidth : screenHeight;
const width = screenWidth < screenHeight ? screenWidth : screenHeight;

export default function SPVApproval({ navigation, route }) {
	const [people, setPeople] = useState([]);
	const [reject, setReject] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedValue, setSelectedValue] = useState('');
	const [op_comment, setOp_comment] = useState('');
	const [selected, setSelected] = useState('');
	const [idgroupui, setIdgroupui] = useState('');
	const spvResult = useSelector((state) => state.spv.params);

	useEffect(() => {
		getPeopleReject();
	}, [])


	const onApprovePress = () => {
		// const { date } = route.params;
		// const { params } = route;
		const date = spvResult.date;
		const params = spvResult;
		Alert.alert(
			'Notification',
			'Confirm Approve ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						const body = {
							script_name: "api/v2/api_spvapprove",
							data: {
								prod_date: date,
								op_comment: op_comment,
								idgroupui: params.idgroupui,
								userid: params.user.username
							}
						}
						Axios.post(`${configUrl.https}`, body, {
							timeout: 20000,
							headers: {
								'Cookie': params.sessionId
							},
						})
							.then((res) => {
								const json = res.data;
								setLoading(false);
								if (json.status == "0000") {
									Alert.alert("Notification", "Approve Success")
									const popAction = StackActions.pop(1);
									navigation.dispatch(popAction);
									Toast.showWithGravity("Approve Success", Toast.LONG, Toast.BOTTOM);
								} else {
									setLoading(false);
									Alert.alert("Error", "Failed to approve, Please try again")
								}
							})
							.catch((err) => {
								setLoading(false);
								Alert.alert("Error", "Failed to approve, Please try again")
							})
					}
				},
			]
		)
	}

	const renderItem = ({ item, index }) => {
		const number = index + 1
		return (
			<View style={styles.listContainer}>
				<View style={[styles.listRowWrapper, { backgroundColor: '#cccccc' }]}>
					<View style={[styles.listContent, { borderBottomWidth: 0.8 }]}>
						<Text style={{ color: 'black' }} > No </Text>
					</View>
					<View style={[styles.listContent, { borderBottomWidth: 0.8 }]}>
						<Text style={{ color: 'black', }} > {number} </Text>
					</View>
				</View>
				<View style={[styles.listRowWrapper, { backgroundColor: 'white' }]}>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > Date </Text>
					</View>
					<View style={styles.listContent}>
						<Text style={{ color: 'black', }} > {item[1]} </Text>
					</View>
				</View>
				<View style={[styles.listRowWrapper, { backgroundColor: '#cccccc' }]}>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > Status </Text>
					</View>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > {item[2]} </Text>
					</View>
				</View>
				<View style={[styles.listRowWrapper, { backgroundColor: 'white' }]}>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > User </Text>
					</View>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > {item[3]} </Text>
					</View>
				</View>
				<View style={[styles.listRowWrapper, { backgroundColor: '#cccccc' }]}>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > Remark </Text>
					</View>
					<View style={styles.listContent}>
						<Text style={{ color: 'black' }} > {item[4]} </Text>
					</View>
				</View>
				<View style={[styles.listRowWrapper, { backgroundColor: 'white' }]}>
					<View style={[styles.listContent, { borderBottomWidth: 0.8 }]}>
						<Text style={{ color: 'black' }} > Assigned to </Text>
					</View>
					<View style={[styles.listContent, { borderBottomWidth: 0.8 }]}>
						<Text style={{ color: 'black' }} > {item[5]} </Text>
					</View>
				</View>
			</View>
		)
	}

	const renderStatusApprove = () => {
		// const { params } = route;
		if (spvResult.status != "FINAL APPROVED" && spvResult.status != "SPV APPROVED" && spvResult.status == "COMMITTED" || spvResult.status == "REJECTED BY ASM") {
			return (
				<View style={styles.headerContainer}>
					<Text style={{ margin: 15 }}>Comment</Text>
					<View>
						<TextInput
							style={styles.inputComment}
							multiline={true}
							// ref={c => this.field = c}
							placeholder="Input Comment"
							placeholderTextColor="#c1c1c1"
							underlineColorAndroid="transparent"
							onChangeText={(op_comment) => setOp_comment(op_comment)}
						/>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						{
							spvResult.data.err1 === false && spvResult.data.err2 == false && spvResult.data.err4 == false || spvResult.status == "REJECTED BY ASM" ?
								<Button
									title="Approve"
									buttonStyle={{ borderRadius: 10, backgroundColor: colors.green }}
									onPress={onApprovePress}
									containerStyle={{ marginVertical: 20, width: '40%', marginHorizontal: 20 }}
								/> : null
						}
						<Button
							title="Reject"
							buttonStyle={{ borderRadius: 10, backgroundColor: colors.red }}
							onPress={() => setReject(reject)}
							containerStyle={{ marginVertical: 20, marginHorizontal: 20, width: spvResult.data.err1 === false && spvResult.data.err2 == false && spvResult.data.err4 == false || spvResult.status == "REJECTED BY ASM" ? '40%' : '90%' }}
						/>
					</View>
				</View>
			)
		}
		return null
	}

	const getPeopleReject = () => {
		// const { params } = route;
		const body = {
			script_name: "api/v2/api_spvreject_selectgroup",
			data: {
				prod_date: spvResult.date,
				idgroupui: spvResult.idgroupui,
				userid: spvResult.user.username
			}
		}
		Axios.post(`${configUrl.https}`, body, {
			timeout: 20000,
			headers: {
				'Cookie': spvResult.sessionId
			}
		})
			.then((res) => {
				const json = res.data;
				setLoading(false);
				json.groups.forEach(group => {
					group.elmts.forEach(result => {
						setPeople(...people, result)
					})
				});
			})
			.catch((err) => {
				setLoading(false);
			})
	}

	const renderPeople = () => {
		return (
			<Modal
				transparent
				visible={reject}
				onRequestClose={() => setReject(false)}
			>
				<TouchableItem onPress={() => setReject(false)}>
					<View style={globalStyles.opacityContainer}>
						<View style={{ maxHeight: "70%", marginHorizontal: '3%' }}>
							<FlatList
								data={people}
								keyExtractor={(item, index) => index.toString()}
								ItemSeparatorComponent={() => <Divider />}
								renderItem={({ item }) => {
									const color = selected == item.groupname ? colors.blue : 'black'
									return (
										<TouchableItem onPress={() => onSelect({ idgroupui: item.idgroupui, groupname: item.groupname })} >
											<View style={styles.peopleListContainer}>
												<Text style={{ color }} >{item.groupname}</Text>
											</View>
										</TouchableItem>
									)
								}}
							/>
						</View>
						<Button
							title="REJECT"
							buttonStyle={{ borderRadius: 7, marginHorizontal: 0, backgroundColor: colors.red }}
							onPress={onRejectPress}
							containerStyle={{ marginVertical: '2%', marginHorizontal: 10 }}
						/>
					</View>
				</TouchableItem>
			</Modal>
		)
	}

	const onSelect = (item) => {
		setSelected(item.groupname);
		setIdgroupui(item.idgroupui);
	}

	const onRejectPress = () => {
		// const { params } = route;
		Alert.alert(
			'Notification',
			'Are you sure reject this data ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						const body = {
							script_name: "api/v2/api_spvreject",
							data: {
								prod_date: spvResult.date,
								op_comment: op_comment,
								idgroupui: spvResult.idgroupui,
								userid: spvResult.user.username,
								idgroupuiopr: idgroupui
							}
						}
						Axios.post(`${configUrl.https}`, body, {
							timeout: 20000,
							headers: {
								'Cookie': spvResult.sessionId
							}
						})
							.then((res) => {
								const json = res.data;
								setLoading(false);
								if (json.status == "0000") {
									Alert.alert("Notification", "Reject Success");
									const popAction = StackActions.pop(1);
									navigation.dispatch(popAction);
									Toast.showWithGravity("Reject Success", Toast.LONG, Toast.BOTTOM);
								} else {
									setLoading(false);
									Alert.alert("Error", "Failed to reject, Please try again")
								}
							})
							.catch((err) => {
								setLoading(false);
								Alert.alert("Error", "Failed to reject, Please try again")
							})
					}
				},
			]
		)
	}
	// const { params } = route;

	return (
		// <ScrollView style={styles.container}>
			<View style={styles.container}>
				{renderStatusApprove()}
				{renderPeople()}
				<View style={styles.historyContainer}>
					<View style={styles.headerTitleContainer}>
						<Icon name="ios-person" size={18} style={styles.icon} />
						<Text style={styles.title}>History Approval</Text>
					</View>
				</View>
				<FlatList
					data={spvResult.data.historyapproval}
					renderItem={renderItem}
					keyExtractor={(item, index) => item[0].toString()}
				/>
			</View>
		// </ScrollView>
	)

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	headerContainer: {
		flexDirection: 'column',
		backgroundColor: '#ffffff'
	},
	headerTitleContainer: {
		alignItems: 'center',

		flexDirection: 'row'
	},
	textKet: {
		marginTop: 15,
		marginBottom: 15
	},
	icon: {
		marginLeft: 10,
		marginRight: 15,
		alignItems: 'center',
	},
	inputComment: {
		height: 100,
		borderWidth: 1,
		marginLeft: 15,
		marginRight: 15,
		borderColor: '#cccccc',
		textAlignVertical: 'top'
	},
	historyContainer: {
		marginTop: 15,
		marginBottom: 15,
		flexDirection: 'column',
		backgroundColor: '#ffffff'
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	listContainer: {
		height: height * 0.3,
		marginHorizontal: 15
	},
	listRowWrapper: {
		width: '100%',
		height: '15%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	listContent: {
		width: '50%',
		borderColor: '#e1e8ee',
		borderWidth: 0.8,
		justifyContent: 'center'
	},
	peopleListContainer: {
		padding: 15,
		justifyContent: 'center',
		backgroundColor: 'white',
	}
})