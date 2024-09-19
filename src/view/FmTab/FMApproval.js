import React, { Component, useEffect, useState } from 'react';
import { View, Text, Alert, Modal, FlatList, ScrollView, StatusBar, Dimensions, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { FormInput, Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/constants/colors';
import globalStyles from '../global/styles';
import TouchableItem from '../global/Touchable';
import configUrl from '../../assets/constants/config';
import axios from 'axios';
import { StackActions } from '@react-navigation/routers';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
// import { StackActions } from 'react-navigation';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const height = screenHeight < screenWidth ? screenWidth : screenHeight;
const width = screenWidth < screenHeight ? screenWidth : screenHeight;

export default function FMApproval({ navigation }) {
	const [loading, setLoading] = useState(false);
	const [people, setPeople] = useState([]);
	const [reject, setReject] = useState(false);
	const [selected, setSelected] = useState('');
	const [op_comment, setOp_comment] = useState('');
	const [idgroupuiasm, setIdgroupuiasm] = useState('');
	const fmResult = useSelector((state) => state.fm.params);


	useEffect(() => {
		getUserReject();
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#abc236');
	}, [])




	const onApprovePress = () => {
		Alert.alert(
			'Notification',
			'Confirm Approve ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						setLoading(true);
						onApproveProccess();
					}
				},
			]
		)
	}

	const onApproveProccess = async () => {
		const { date, orgid } = fmResult;
		
		const body = {
			script_name: "api/v2/api_fmapprove",
			data: {
				orgid: orgid,
				prod_date: date,
				op_comment: op_comment,
				idgroupui: fmResult.idgroupui,
				userid: fmResult.user.username
			}
		}
		try {
			const result = await axios.post(`${configUrl.https}`, body, {
				timeout: 20000,
				headers: {
					'Cookie': fmResult.sessionId
				}
			})
			const json = result.data;
			setLoading(false);
			if (json.status == "0000") {
				Alert.alert("Notification", "Approve Success");
				const popAction = StackActions.pop(1);
                navigation.dispatch(popAction);
				Toast.showWithGravity("Approve Success", Toast.LONG, Toast.BOTTOM);
			} else {
				setLoading(false);
				Alert.alert("Error", "Failed to approve, Please try again")
			}
		} catch (err) {
			setLoading(false);
			Alert.alert("Error", "Failed to approve, Please try again")
		}
	}

	const onRejectPress = () => {
		Alert.alert(
			'Notification',
			'Are you sure reject this data ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						onRejectProccess()
					}
				},
			]
		)
	}

	const onRejectProccess = async () => {
		const body = {
			script_name: "api/v2/api_fmreject",
			data: {
				orgid: fmResult.orgid,
				prod_date: fmResult.date,
				op_comment: op_comment,
				idgroupui: fmResult.idgroupui,
				userid: fmResult.user.username,
				idgroupuiasm: idgroupuiasm
			}
		}
		
		try {
			const result = await axios.post(`${configUrl.https}`, body, {
				timeout: 20000,
				headers: {
					'Cookie': fmResult.sessionId
				}
			})
			const json = result.data;
			setLoading(false);
			if (json.status == "0000") {
				Alert.alert("Notification", "Reject Success")
                navigation.dispatch(popAction);
				Toast.showWithGravity("Reject Success", Toast.LONG, Toast.BOTTOM);
			} else {
				setLoading(false);
				Alert.alert("Error", "Failed to reject, Please try again")
			}
		} catch (err) {
			setLoading(false);
			Alert.alert("Error", "Failed to reject, Please try again")
		}
	}

	const getUserReject = async () => {
		const body = {
			script_name: "api/v2/api_fmreject_selectgroup",
			data: {
				orgid: fmResult.orgid,
				prod_date: fmResult.date,
				idgroupui: fmResult.idgroupui,
				userid: fmResult.user.username
			}
		}
			try{
				const result = await axios.post(`${configUrl.https}`, body, {
					timeout: 20000,
					headers: {
						'Cookie': fmResult.sessionId
					}
				})
				const json = result.data;
				setLoading(false);
				json.groups.forEach(group => {
					group.elmts.forEach(result => {
						setPeople([
							...people,
							result
						])
					})
				});
			}catch(err){
				setLoading(false);
			}
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
		if (fmResult.status != "FINAL APPROVED" && fmResult.status != "SPV APPROVED" && fmResult.status == "ASM APPROVED") {
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
						<Button
							title="Approve"
							buttonStyle={{ borderRadius: 10, backgroundColor: colors.green }}
							onPress={onApprovePress}
							containerStyle={{ marginVertical: 20, width: '40%', marginHorizontal: 20 }}
						/>
						<Button
							title="Reject"
							buttonStyle={{ borderRadius: 10, backgroundColor: colors.red }}
							onPress={() => setReject(!reject)}
							containerStyle={{ marginVertical: 20, width: '40%', marginHorizontal: 20 }}
						/>
					</View>
				</View>
			)
		}
		return null
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
										<TouchableItem onPress={() => onSelect(item.groupname, item.idgroupui)} >
											<View style={globalStyles.peopleListContainer}>
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

	const onSelect = (param, param1) => {
		setSelected(param);
		setIdgroupuiasm(param1);
	}

	return (
		<ScrollView style={styles.container}>
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
					data={fmResult.historyapproval}
					renderItem={renderItem}
					keyExtractor={(item, index) => item[0].toString()}
				/>
			</View>
		</ScrollView>
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
		justifyContent: 'space-between',
		flexShrink: 1
	},
	listContent: {
		width: '50%',
		borderColor: '#e1e8ee',
		borderWidth: 0.4,
		justifyContent: 'center',
		flexShrink: 1
	},
})