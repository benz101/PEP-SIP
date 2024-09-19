import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
	StatusBar,
	Modal
} from 'react-native';
import moment from 'moment';
import { ListItem, Button } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import TouchableItem from '../global/Touchable';
import axios from 'axios';
import configUrl, { height } from '../../assets/constants/config';
import Loader from '../../assets/elements/Loader';
import globalStyles from '../global/styles';
import { ActivityIndicator } from 'react-native';
import { SPVSuccess } from '../../controller/actionSPV';
import { useDispatch } from 'react-redux';
import { ASMSuccess } from '../../controller/actionASM';
import { FMSuccess } from '../../controller/actionFM';

export default function SPVListApproval({ navigation, route }) {
	const [approvalList, setApprovalList] = useState([]);
	const [commit, setCommit] = useState('');
	const [cgroup, setCgroup] = useState('');
	const [selected, setSelected] = useState("");
	const [cgroupspv, setCgroupspv] = useState('');
	const [spvapprove, setSpvapprove] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingList, setLoadingList] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const dispatch = useDispatch();

	const renderItem = (item) => {
		return (
			<TouchableOpacity style={[styles.item, { height: item.height }]}>
				<Text>{item.name}</Text>
			</TouchableOpacity>
		)
	}

	useEffect(() => {
		StatusBar.setBarStyle('dark-content');
		StatusBar.setBackgroundColor('white');
		onLoadList();
	}, [])

	useEffect(() => {
		approvalList.reverse()
	}, [])


	const onLoadList = async () => {
		const { params } = route;
		// console.log("Params: "+JSON.stringify(params));
		setLoadingList(true);
		const data = params.user.roles == "ASM" || params.roles == "ASM" ? {
			script_name: "api/v2/api_fieldapprovallist",
			data: {
				prod_date: params.prod_date,
				idgroupui: params.idgroupui,
				userid: params.user.username,
				orgid: params.orgid
			}
		} : params.user.roles == "FM" || params.roles == "FM" ? {
			script_name: "api/v2/api_finalapprovallist",
			data: {
				prod_date: params.prod_date,
				idgroupui: params.idgroupui,
				userid: params.user.username,
				orgid: params.orgid
			}
		} :
			{
				script_name: "api/v2/api_approvallist",
				data: {
					prod_date: params.prod_date,
					idgroupui: params.idgroupui,
					userid: params.user.username
				}
			}

		// console.log("sessionid: " + params.user.username)


		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				timeout: 20000,
				headers: {
					'Cookie': params.sessionId
				}
			})
			const json = result.data;

			setApprovalList(json.result);
			setLoadingList(false);
			setCgroup(json.cgroup);
			setCgroupspv(json.cgroupspv);
			setCommit(json.commits);
			setSpvapprove(json.spvapprove);
		} catch (err) {
			setLoadingList(false);
			Alert.alert("Error", "Failed to get data, Please check your internet connections in SpvListApproval")
		}
	}

	const onSelect = async (item) => {
		setLoading(true);
		const { params } = route;
		// console.log("This is roles: " + JSON.stringify(params.user.roles));
		const forASM = {
			script_name: "api/v2/api_fieldapprovaldata2",
			data: {
				prod_date: item.sdate,
				idgroupui: params.idgroupui,
				userid: params.user.username,
				orgid: item.orgid,
				limit: 13
			}
		}

		const forFM = {
			script_name: "api/v2/api_finalapprovaldata",
			data: {
				prod_date: item.sdate,
				idgroupui: params.idgroupui,
				userid: params.user.username,
				orgid: item.orgid
			}
		}

		const forOther = {
			script_name: "api/v2/api_approvaldata",
			data: {
				prod_date: item.sdate,
				idgroupui: params.idgroupui,
				userid: params.user.username
			}
		}

		console.log('data: ' + JSON.stringify(forOther));
		console.log('session id:' + params.sessionId);

		const data = params.user.roles == "ASM" || params.roles == "ASM" ? forASM :
			params.user.roles == "FM" || params.roles == "FM" ? forFM : forOther

		// console.log("result: " + JSON.stringify(data));
		// setLoading(false);
		setShowLoading(true);


		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				headers: {
					'Cookie': params.sessionId
				},
			});
			// const result = await axios.post(`${configUrl.https}`, data);
			const json = result.data;

			console.log("This is rezult on select: " + JSON.stringify(json.isreject));
			if (json.historyapproval.length === 0) {
				setLoadingL(false);
				alert('Load Data Error');
			} else {
				goToNavigate(params, json, item);
				setLoadingL(false);
			}

			// Alert.alert(
			// 	'Message',
			// 	'Go To Detail ?',
			// 	[
			// 		{
			// 			text: 'Cancel',
			// 			onPress: () => setShowLoading(false),
			// 			style: 'No',
			// 		},
			// 		{
			// 			text: 'Yes',
			// 			onPress: () => goToNavigate(params, json, item)
			// 		},
			// 	],
			// 	{ cancelable: false },
			// );

		} catch (err) {
			setLoading(false);
			if (err.status == 500) {
				return Alert.alert("Error", "Please check your internet connections")
			}
		}
	}

	const goToNavigate = (param, json, item) => {
		setShowLoading(false);
		if (param.user.roles == "ASM" || param.roles == "ASM") {
			const params = {
				user: param.user,
				data: json,
				date: item.sdate,
				orgid: item.orgid,
				status: item.statusinfo,
				cgroupspv: cgroupspv,
				sessionId: param.sessionId,
				idgroupui: param.idgroupui
			};
			dispatch(ASMSuccess(params));
			return navigation.navigate("ASMTab");
		} else if (param.user.roles == "FM" || param.roles == "FM") {
			const params = {
				user: param.user,
				data: json,
				date: item.sdate,
				status: item.statusinfo,
				orgid: item.orgid,
				sessionId: param.sessionId,
				idgroupui: param.idgroupui
			}
			dispatch(FMSuccess(params));
			return navigation.navigate("FMTab")
		} else if (param.user.roles == "SPV" || param.roles == "SPV") {
			const params = {
				user: param.user,
				data: json,
				date: item.sdate,
				status: item.statusinfo,
				cgroup: cgroup,
				sessionId: param.sessionId,
				idgroupui: param.idgroupui
			};
			console.log('This is SPV Params: ' + JSON.stringify(params));
			dispatch(SPVSuccess(params));
			return navigation.navigate("SPVTab");
		} else {
			Alert.alert("Error")
		}
	}

	const showLoadingIndicator = () => {
		return (
			<Modal
				transparent
				visible={showLoading}
				onRequestClose={() => setShowLoading(false)}
			>
				<View style={globalStyles.opacityContainer}>
					<ActivityIndicator size="large" color="#0000ff" animating={showLoading} />
				</View>
			</Modal>
		)
	}

	const renderData = ({ item }) => {
		const date = moment(item.sdate, "DD-MM-YYYY").format("DD MMM YYYY");
		let backgroundColor = colors.blue;
		if (item.statusinfo == "COMMITTED") {
			backgroundColor = colors.yellow
		}
		if (item.statusinfo.search("APPROVED") > -1) {
			backgroundColor = colors.purple
		}
		if (item.statusinfo.search("REJECTED") > -1) {
			backgroundColor = colors.red
		}

		const title = item.statusinfo == "COMMITTED" && item.role === "SPV" ? item.statusinfo + " " + ("(" + (item.n_commit) + "/" + cgroup + ")") : item.statusinfo == "SPV APPROVED" && item.role == "ASM" ? item.statusinfo + " " + ("(" + (item.n_approve) + "/" + cgroupspv + ")") : item.statusinfo;
		return (
			<TouchableItem onPress={() => onSelect(item)} >
				<ListItem
					containerStyle={{
						marginTop: 10,
						marginBottom: 10,
						width: '95%',
						flex: 1,
						alignSelf: 'center',
						borderWidth: 0,
						borderRadius: 10,
						elevation: 6,
						backgroundColor,
						height: height * 0.095
					}}
					title={title}
					titleStyle={{ color: 'white' }}
					subtitleStyle={{ color: 'white' }}
					subtitle={date}
					chevronColor='white'
				/>
			</TouchableItem>
		)

	}

	const renderEmptyDate = () => {
		return (
			<View style={styles.emptyDate}>
				<Text>This is empty date</Text>
			</View>
		)
	}

	const rowHasChanged = (r1, r2) => {
		return r1.name !== r2.name;
	}


	if (loadingList) {
		return <Loader visible={true} />
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={approvalList.reverse()}
				renderItem={renderData}
				keyExtractor={(item, index) => index.toString()}
				ListEmptyComponent={() => (
					<View style={styles.listEmptyContainer}>
						<Text style={styles.textEmptyData}>Data is empty. Please try again</Text>
						<Button
							onPress={onLoadList}
							title="Reload"
							buttonStyle={{ borderRadius: 10, backgroundColor: colors.blue, marginLeft: 10, marginRight: 10 }}
						/>
					</View>
				)}
			/>
			{/* <Loader
				visible={loading}
			/> */}
			{showLoadingIndicator()}
		</View>
	)



}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	item: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	emptyDate: {
		height: 15,
		flex: 1,
		paddingTop: 30
	},
	listEmptyContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	textEmptyData: {
		marginTop: 10,
		marginBottom: 10,
		textAlign: 'center'
	}
})

