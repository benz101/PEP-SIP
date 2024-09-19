import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	Alert,
	TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	Button,
	normalize
} from 'react-native-elements';
import MonthPicker from '../../assets/elements/MonthPicker';
import TouchableItem from '../global/Touchable';
import globalStyles from '../global/styles';
import styles from './style';
import colors from '../../assets/constants/colors';
import * as Keychain from 'react-native-keychain';
import configUrl from '../../assets/constants/config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'

export default function Approval({ navigation }) {

	const [data, setData] = useState([]);
	const [month, setMonth] = useState('');
	const [productionDate, setProductionDate] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [fullDate, setFullDate] = useState('')
	const [formColor, setFormColor] = useState('black');
	const [groupColor, setGroupColor] = useState('black');
	const [fieldList, setFieldList] = useState([]);
	const [fieldListFM, setFieldListFM] = useState([])
	const [groupList, setGroupList] = useState([])
	const [orgid, setOrgid] = useState('');
	const [orgname, setOrgname] = useState('');
	const [sessionId, setSessionId] = useState('');
	const [groupname, setGroupname] = useState('');
	const [idgroupui, setIdgroupui] = useState('');
	const [grupname, setGrupname] = useState('');
	const resultUser = useSelector((state) => state.user.params);
	const [selectedItem, setSelectedItem] = useState(null);
	const [visibleGroupList, setVisibleGroupList] = useState(false);
	const [itemGroup, setItemGroup] = useState(null); 



	useEffect(() => {
		onFetch();
		loadGroupData();
	}, [])

	useEffect(() => {
		if (groupColor) {
			loadGroupData();
		}
	}, [groupColor])


	const renderAsmen = () => {
		if (resultUser.user.roles == "ASM" || resultUser.roles == "ASM" || resultUser.user.roles == "FM" || resultUser.roles == "FM") {
			return (
				<View style={{ marginHorizontal: '5%' }}>
					<Text style={styles.labelStyle}>Field</Text>
					<View style={[styles.formContainer, { borderColor: formColor }]}>
						<View style={styles.iconContainer}>
							<Icon name="md-search" size={normalize(20)} color={formColor} />
						</View>
						<View style={{ width: '95%' }} >
							<TextInput
								placeholder="Field"
								// ref={c => this.field = c }
								onFocus={() => setFormColor(colors.blue, () => onFetch())}
								onChangeText={(orgname) => setOrgname(orgname)}
								value={orgname}
								onBlur={() => setFormColor('black')}
								inputStyle={{ color: formColor }}
								underlineColorAndroid="transparent"
								containerStyle={{ margin: 0, padding: 0 }}
							/>
						</View>
					</View>
					{renderField()}
				</View>
			)
		}
		return null
	}

	const renderField = () => {
		if (formColor !== 'black') {
			return (
				<View style={styles.flatListContainer}>
					<FlatList
						data={fieldList}
						keyboardShouldPersistTaps='handled'
						// extraData={props}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderItem}
						ListEmptyComponent={<Text style={styles.subtitle}>No Result Found, Please Try Again</Text>}
					/>
				</View>
			)
		}
	}

	const renderGroup = () => {
		if (groupColor !== 'black') {
			return (
				<View style={styles.flatListContainer}>
					<FlatList
						data={groupList}
						keyboardShouldPersistTaps='handled'
						// extraData={props}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderItemGroup}
						ListEmptyComponent={<Text style={styles.subtitle}>No Result Found, Please Try Again</Text>}
					/>
				</View>
			)
		}
	}

	const renderItemGroup = ({ item }) => {
		
		console.log("This is item: "+JSON.stringify(item.elmts));
		return (
			visibleGroupList?
			<View>
				<Text style={styles.subtitle}>{item.label}</Text>
				<FlatList
					data={item.elmts}
					keyExtractor={(item, index) => index.toString()}
					keyboardShouldPersistTaps='handled'
					extraData={item}
					renderItem={({ item }) => {
						return (
							<TouchableItem
								onPress={() => {
									setRenderItemGroup(item), setVisibleGroupList(false)}}
							>
								<View style={styles.orgListContainer} >
									<Text style={styles.orgListText} >{item.groupname}</Text>
								</View>
							</TouchableItem>
						)
					}}
				/>
			</View>:null
		)
	}

	const onSubmit = async () => {
		if (productionDate == "" || groupname == "") {
			console.log("Groupname:" + groupname);
			return Alert.alert("Error", "Production Date And Group is required");
		} else {
			setIsLoading(true);
			navigation.navigate("ApprovalList", {
				user: resultUser.user,
				roles: resultUser.roles,
				orgid: orgid,
				idgroupui: idgroupui,
				prod_date: fullDate,
				sessionId: sessionId
			})
			console.log('session id: '+sessionId);
		}
	}

	const setRenderItem = (param) => {
		setOrgid(`${param.orgid}`);
		setOrgname(param.orgname)
	}

	const renderItem = ({ item }) => {
		return (
			<View>
				<Text style={styles.subtitle}>{item.label}</Text>
				<FlatList
					data={item.elmts}
					keyExtractor={(item, index) => index.toString()}
					keyboardShouldPersistTaps='handled'
					extraData={item}
					renderItem={({ item }) => {
						return (
							<TouchableItem
								onPress={() => setRenderItem(item)
								}>
								<View style={styles.orgListContainer} >
									<Text style={styles.orgListText} >{item.orgname}</Text>
								</View>
							</TouchableItem>
						)
					}}
				/>
			</View>
		)
	}

	const setRenderItemGroup = (param) => {
		setIdgroupui(`${param.idgroupui}`);
		setGroupname(param.groupname);
	}

	

	const onFetch = async () => {
		try {
			const value = await Keychain.getGenericPassword();
			const data = resultUser.user.roles == "ASM" || resultUser.roles == "ASM" ? {
				script_name: "api/v2/api_getListOrgASM",
				data: {}
			} :
				{
					script_name: "api/v2/api_getListOrgFM",
					data: {}
				}

			console.log("From Generic: " + JSON.stringify(value));
			onFetchProcces(data, value);
		} catch (error) {
			console.log(error);
		}

	}

	const onFetchProcces = async (data, value) => {
		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				timeout: 20000,
				headers: {
					'Cookie': value.username
				}
			})
			const json = result.data;
			setFieldList(json.groups);
			setSessionId(value.username)
		} catch (error) {
			console.log(error);
		}
	}

	const loadGroupData = () => {
		try {
			const value = Keychain.getGenericPassword();
			const data = resultUser.user.roles == "ASM" || resultUser.roles == "ASM" ? {
				script_name: "api/v2/api_select_groupasm",
				data: {
					userid: resultUser.user.username
				}
			} : resultUser.user.roles == "FM" || resultUser.roles == "FM" ? {
				script_name: "api/v2/api_select_groupfm",
				data: {
					userid: resultUser.user.username
				}
			} :
				{
					script_name: "api/v2/api_select_groupspv",
					data: {
						userid: resultUser.user.username
					}
				}
			console.log("From Generics: " + JSON.stringify(value));
			groupLoadDataProccess(data, value);
		} catch (error) {
			console.log(error);
		}



	}

	const groupLoadDataProccess = async (data, value) => {
		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				timeout: 20000,
				headers: {
					'Cookie': value.username
				}
			})
			const json = result.data;
			console.log("group list: "+JSON.stringify(json.groups));
			setGroupList(json.groups);
			setSessionId(value.username);
		} catch (err) {
			console.log(err)
		}
	}



	const setMonthPicker = (param, param2) => {
		setProductionDate(param);
		setFullDate(param2);
		setIsVisible(false);
	}


	return (
		<View style={globalStyles.container}>
			{/* {renderAsmen()} */}
			<View style={{ marginHorizontal: '5%', marginTop: '5%' }}>
				<Text style={styles.labelStyle}>Group</Text>
				<View style={[styles.formContainer, { borderColor: groupColor }]}>
					<View style={styles.iconContainer}>
						<Icon name="md-search" size={normalize(20)} color={groupColor} />
					</View>
					<View style={{ width: '95%' }} >
						<TextInput
							placeholder="Group"
							// ref={c => this.group = c }
							onChangeText={(groupname) => {setGroupname(groupname), setVisibleGroupList(true)}}
							onFocus={() => {setGroupColor(colors.blue), setVisibleGroupList(true)}}
							value={groupname}
							onBlur={() => setGroupColor('black')}
							inputStyle={{ color: groupColor }}
							underlineColorAndroid="transparent"
							containerStyle={{ margin: 0, padding: 0 }}
						/>
					</View>
				</View>
				{renderGroup()}
			</View>
			<View style={{ marginHorizontal: '5%', marginTop: '5%' }}>
				<Text style={styles.labelStyle}>Production Date</Text>
				<View style={styles.formContainer}>
					<View style={styles.iconContainer}>
						<Icon name="ios-calendar" size={normalize(20)} color='black' />
					</View>
					<TouchableItem onPress={() => setIsVisible(true)} >
						<View style={{ width: '95%' }} >
							<TextInput
								placeholder="Production Date"
								editable={false}
								value={productionDate}
								underlineColorAndroid="transparent"
								containerStyle={{ margin: 0, padding: 0 }}
							/>
						</View>
					</TouchableItem>
				</View>
			</View>
			<Button
				containerStyle={{ marginTop: '5%', marginLeft: '5%', marginRight: '5%' }}
				buttonStyle={{ backgroundColor: colors.blue }}
				title="VIEW"
				onPress={onSubmit}
			/>
			<MonthPicker
				onRequestClose={() => setIsVisible(false)}
				visible={isVisible}
				onChangeDate={(fullDate, monthYear) => setMonthPicker(monthYear, fullDate)}
			/>
		</View>
	)
}
