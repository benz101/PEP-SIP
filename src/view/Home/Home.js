import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	View,
	Image,
	Text,
	Dimensions,
	ActivityIndicator,
	Alert,
	RefreshControl,
	Modal,
	FlatList,
	StatusBar
} from "react-native";
import moment from 'moment';
import axios from 'axios';
import globalStyles from '../global/styles';
import { Card, normalize, Divider, colors } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown-v2';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './HomeStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import TouchableItem from '../global/Touchable';
import configUrl from '../../assets/constants/config';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';


const { height, width } = Dimensions.get('window');
const layoutHeight = height * 0.135;
const layoutWidth = width * 0.2
const position = {
	bottom: layoutHeight - (layoutHeight * 0.55),
	right: layoutWidth - (layoutWidth * 0.82)
}


export default function Home({ navigation }) {
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState('PEP');
	const [selectedAsset] = useState('SELECT ASSET');
	const [selectedAssetForField, setSelectedAssetForField] = useState('SELECT ASSET');
	const [selectedBP, setSelectedBP] = useState('SELECT DATA');
	const [bottom] = useState(position.bottom);
	const [right] = useState(position.right);
	const [width] = useState(0)
	const [summary, setSummary] = useState({});
	const [loadingSummary, setLoadingSummary] = useState(false);
	const [errorSummary, setErrorSummary] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [scrollHeight, setScrollHeight] = useState(height * 0.8);
	const [fieldList, setFieldList] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedField, setSelectedField] = useState({
		fieldname: "SELECT FIELD",
		idpfunit: 0
	});
	const [loadingField, setLoadingField] = useState(false);
	const [value, setValue] = useState(new Date());
	const [gas_sales, setGas_sales] = useState({});
	const [idunit, setIdunit] = useState(2471);
	const [errorField, setErrorField] = useState("");

	const resultUser = useSelector((state) => state.user.params);



	useEffect(() => {
		let isMounted = true;
		StatusBar.setBarStyle('dark-content');
		StatusBar.setBackgroundColor('white');
		console.log("Params: " + JSON.stringify(resultUser));
		onFetch();
		onLoadField();
		onLoadSalesGas();


		return () => {
			// navListener.remove()
			isMounted = false
		}

	}, [])

	useEffect(() => {
		if (selected) {
			onFetch();
			onLoadSalesGas();
		}

		if (selectedAssetForField) {
			onLoadField();
		}

		if (selectedBP) {
			onFetch();
			onLoadSalesGas();
		}
	}, [selected, selectedAssetForField, selectedBP]);


	useEffect(() => {
		onFetch();
		onLoadSalesGas();
	}, [value]);

	const onLayout = (e) => {
		const { width, height } = e.nativeEvent.layout;
	}

	const onLoadField = async () => {
		setLoadingField(true);
		const body = {
			script_name: "api/v2/api_getField",
			data: {
				asset: selectedAssetForField
			}
		}
		try {
			const result = await axios.post(`${configUrl.https2}`, body, {
				timeout: 2000000,
			})
			const json = result.data;
			if (json) {
				setFieldList(json.fieldList)
				setLoadingField(false)
			}
		} catch (err) {
			setLoadingField(false);
			setErrorField("Failed To Load Field");
			Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
		}
	}



	// const convertStats = (json) => {
	// 	let approvalstats = [];
	// 	let newObj = new Object();
	// 	const objKeys = Object.keys(json.status_approval);
	// 	objKeys.forEach((item, index) => {
	// 		newObj = {
	// 			...newObj,
	// 			asset: item,
	// 			...json.status_approval[item]
	// 		}
	// 		approvalstats.push(newObj);
	// 	})
	// 	setApprovalstats(approvalstats.reverse())
	// }

	const onChangeDate = (event, date) => {
		if (date === undefined) {
			setVisible(false);
		} else {
			setVisible(false);
			setValue(date);
		}
	}

	const valueConverter = (json) => {
		const objKeys = Object.keys(json)
		let data = {};
		objKeys.forEach((obj) => {
			const filterObj = obj.search("gas");
			let floatObj;
			if (filterObj < 0) {
				floatObj = json[obj].toFixed(3)
			}
			else {
				floatObj = json[obj].toFixed(4)
			}
			data = {
				...data,
				[obj]: floatObj
			}
			const splitObj = data[obj].split(".");
			splitObj[0] = splitObj[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			data[obj] = splitObj.join(".")
		})
		setSummary(data);
		setLoadingSummary(false);
		setRefreshing(false);
	}

	const onFetch = async () => {
		setLoadingSummary(true);
		let date = `${moment(new Date(value)).format('D-M-YYYY')}`
		let data = {
			script_name: "api/v2/test/api_summary",
			data: {
				tgl: date
			}
		};

		if (selected === "ASSET") {
			data = {
				script_name: "api/v2/test/api_summary_asset",
				data: {
					asset: selectedAsset,
					orgid: idunit,
					tgl: date
				}
			}
			if (selectedAsset == "SELECT ASSET") {
				setLoadingSummary(false);
			}
		}

		if (selected === "FIELD") {
			data = {
				script_name: "api/v2/test/api_summary_field",
				data: {
					idpfunit: selectedField.idpfunit,
					tgl: date
				}
			}
			if (selectedAssetForField == "SELECT ASSET") {
				setLoadingSummary(false);
			}
		}

		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				timeout: 20000
			})
			const json = result.data;
			if (json) {
				// console.log("Summary: "+JSON.stringify(json));
				valueConverter(json.summary[0])
			}
		} catch (err) {
			setLoadingSummary(false);
			setErrorSummary("Failed to get data, please try to refresh again");
			Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
		}
	}

	// const onRefresh = async () => {
	// 	setRefreshing(true)
	// 	let date = `${moment(new Date(value)).format('D-M-YYYY')}`
	// 	let data = {
	// 		script_name: "api/v2/api_summary",
	// 		data: {
	// 			tgl: date
	// 		}
	// 	};
	// 	if (selected === "ASSET") {
	// 		data = {
	// 			script_name: "api/v2/api_summary_asset",
	// 			data: {
	// 				asset: selectedAsset,
	// 				tgl: date
	// 			}
	// 		}
	// 		if (selectedAsset == "SELECT ASSET") {
	// 			setLoadingSummary(false)
	// 		}
	// 	}

	// 	if (selected === "FIELD") {
	// 		data = {
	// 			script_name: "api/v2/api_summary_field",
	// 			data: {
	// 				idpfunit: selectedField.idpfunit,
	// 				tgl: date
	// 			}
	// 		}
	// 		if (selectedAssetForField == "SELECT ASSET") {
	// 			setLoadingSummary(false);
	// 		}
	// 	}

	// 	if (selected === "BUSINESS PARTNERSHIP" && selectedBP !== "SELECT DATA") {
	// 		data = {
	// 			script_name: "api/v2/api_summary_bp",
	// 			data: {
	// 				bp: selectedBP,
	// 				tgl: date
	// 			}
	// 		}
	// 	}

	// 	if (selected === "BUSINESS PARTNERSHIP" && selectedBP === "SELECT DATA") {
	// 		data = {
	// 			script_name: "api/v2/api_summary_bp",
	// 			data: {
	// 				tgl: date
	// 			}
	// 		}
	// 	}

	// 	try {
	// 		const result = axios.post(`${configUrl.https2}`, data, {
	// 			timeout: 20000000
	// 		})
	// 		const json = res.data;
	// 		if (json) {
	// 			valueConverter(json.summary[0])
	// 		}
	// 	} catch (err) {
	// 		setRefreshing(false);
	// 		setLoadingSummary(false);
	// 		setErrorSummary("Failed to get data, please try to refresh again");
	// 		ToastAndroid.showWithGravityAndOffset(
	// 			"Please check your internet connections",
	// 			ToastAndroid.LONG,
	// 			ToastAndroid.BOTTOM,
	// 			0,
	// 			50
	// 		)
	// 	}
	// }

	const onLoadSalesGas = async () => {
		let date = `${moment(new Date(value)).format('D-M-YYYY')}`
		let data = {
			script_name: "api/v2/api_sales_gas_EP_mob",
			data: {
				date: date
			}
		};

		if (selected === "ASSET") {
			data = {
				script_name: "api/v2/api_sales_gas_all_mob",
				data: {
					date: date,
					idunit: idunit
				}
			}
		}

		if (selected === "FIELD") {
			data = {
				script_name: "api/v2/api_sales_gas_all_mob",
				data: {
					date: date,
					idunit: selectedField.idpfunit
				}
			}
		}

		if (selected === "BUSINESS PARTNERSHIP" && selectedBP === "SELECT DATA") {
			data = {
				script_name: "api/v2/api_sales_gas_bp",
				data: {
					date: date,
					unit: "BUSINESS PARTNERSHIP"
				}
			}
		}

		if (selected === "BUSINESS PARTNERSHIP" && selectedBP !== "SELECT DATA") {
			data = {
				script_name: "api/v2/api_sales_gas_bp",
				data: {
					date: date,
					unit: selectedBP
				}
			}
		}

		try {
			const result = await axios.post(`${configUrl.https}`, data, {
				timeout: 200000
			})
			const json = result.data;
			if (json) {
				let data = {}
				const objKeys = Object.keys(json.data)
				objKeys.forEach((obj) => {
					let floatObj = json.data[obj].toFixed(4)
					data = {
						...data,
						[obj]: floatObj
					}
					const splitObj = data[obj].split(".");
					splitObj[0] = splitObj[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					data[obj] = splitObj.join(".")
				})

				setGas_sales(data)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const onChangeDropdown = (value) => {
		setSelected(value);
	}

	const onChangeAsset = (value) => {
		let idunit = 2471;
		if (value == 'ASSET-2') {
			idunit = 2472
		}
		if (value == 'ASSET-3') {
			idunit = 2473
		}
		if (value == 'ASSET-4') {
			idunit = 2474
		}
		if (value == 'ASSET-5') {
			idunit = 2475
		}
		if (value == 'TAC & KSO') {
			idunit = 2476
		}
		setIdunit(idunit);
		setSelected(value);
	}

	const onRefreshList = () => {
		onFetch();
		onLoadSalesGas();
	}

	const onChangeBP = (item) => {
		setSelectedBP(item);
	}

	const renderSummary = () => {
		if (loadingSummary) {
			return (
				<Card
					containerStyle={[styles.blueCardContainer, { opacity: 0.5 }]}>
					<View style={styles.blueCardContainerHeader}>
						<Text style={styles.titleText}>Summary <MaterialCommunityIcons name="chart-bar-stacked" color='white' size={normalize(18)} /> </Text>
					</View>
					<ActivityIndicator color="white" size="large" style={{ marginVertical: '5%', marginBottom: '20%' }} />
				</Card>
			)
		}

		if (errorSummary) {
			return (
				<Card
					containerStyle={[styles.blueCardContainer, { opacity: 0.5, paddingBottom: '5%' }]}
				>
					<View style={styles.blueCardContainerHeader}>
						<Text style={styles.titleText}>Summary <MaterialCommunityIcons name="chart-bar-stacked" color='white' size={normalize(18)} /> </Text>
					</View>
					<View style={styles.errorSummaryContainer}>
						<Text style={styles.subtitleText}>{errorSummary}</Text>
					</View>
				</Card>
			)
		}

		return (
			<Card
				containerStyle={styles.blueCardContainer}
			>
				<View style={styles.blueCardContainerHeader}>
					<Text style={styles.titleText}>Summary <MaterialCommunityIcons name="chart-bar-stacked" color='white' size={normalize(18)} /> </Text>
				</View>
				<View style={styles.blueCardContainerContent}>
					<View style={styles.subtitleContainer}>
						<Text style={styles.subtitleText}>Oil Production </Text>
					</View>

					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Today</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.oil_prod_today}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  barrels'}
								</Text>
							</View>
						</View>
					</View>

					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Avg YTD</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.oil_prod_ytd}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  bopd'}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.blueCardContainerContent}>
					<View style={styles.subtitleContainer}>
						<Text style={styles.subtitleText}>Gas Production </Text>
					</View>
					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Today</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.gas_prod_today}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  mmscf'}
								</Text>
							</View>
						</View>
					</View>

					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Avg YTD</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.gas_prod_ytd}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  mmscfd'}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.blueCardContainerContent}>
					<View style={styles.subtitleContainer}>
						<Text style={styles.subtitleText}>Oil Lifting </Text>
					</View>
					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Today</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.oil_lifting_today}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  barrels'}
								</Text>
							</View>
						</View>
					</View>

					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Total YTD</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.oil_lifting_ytd}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  barrels'}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{
					selected == "PEP" || selected == "ASSET" ?
						<View style={styles.blueCardContainerContent}>
							<View style={styles.subtitleContainer}>
								<Text style={styles.subtitleText}>Gas Sales </Text>
							</View>
							<View style={globalStyles.rowSpaceBetweenContainer}>
								<View style={styles.contentContainer}>
									<Text style={styles.contentText}>Today</Text>
								</View>
								<View style={styles.contentContainer}>
									<View style={styles.valueContentContainer1}>
										<Text style={styles.contentTextValue}>
											{gas_sales.sales_gas_today}
										</Text>
									</View>
									<View style={styles.valueContentContainer2}>
										<Text style={[styles.contentText, { textAlign: 'left' }]}>
											{'  mmscf'}
										</Text>
									</View>
								</View>
							</View>

							<View style={globalStyles.rowSpaceBetweenContainer}>
								<View style={[styles.contentContainer, { borderBottomLeftRadius: 7 }]}>
									<Text style={styles.contentText}>Total YTD</Text>
								</View>
								<View style={[styles.contentContainer, { borderBottomRightRadius: 7 }]}>
									<View style={[styles.valueContentContainer1, { borderBottomRightRadius: 7 }]}>
										<Text style={styles.contentTextValue}>
											{gas_sales.sales_gas_ytd}
										</Text>
									</View>
									<View style={styles.valueContentContainer2}>
										<Text style={[styles.contentText, { textAlign: 'left' }]}>
											{'  mmscf'}
										</Text>
									</View>
								</View>
							</View>
						</View> : null
				}

				<View style={styles.blueCardContainerContent}>
					<View style={styles.subtitleContainer}>
						<Text style={styles.subtitleText}>Gas Delivered </Text>
					</View>
					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={styles.contentContainer}>
							<Text style={styles.contentText}>Today</Text>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.valueContentContainer1}>
								<Text style={styles.contentTextValue}>
									{summary.gas_delivered_today}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  mmscf'}
								</Text>
							</View>
						</View>
					</View>

					<View style={globalStyles.rowSpaceBetweenContainer}>
						<View style={[styles.contentContainer, { borderBottomLeftRadius: 7 }]}>
							<Text style={styles.contentText}>Total YTD</Text>
						</View>
						<View style={[styles.contentContainer, { borderBottomRightRadius: 7 }]}>
							<View style={[styles.valueContentContainer1, { borderBottomRightRadius: 7 }]}>
								<Text style={styles.contentTextValue}>
									{summary.gas_delivered_ytd}
								</Text>
							</View>
							<View style={styles.valueContentContainer2}>
								<Text style={[styles.contentText, { textAlign: 'left' }]}>
									{'  mmscf'}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</Card>
		)
	}

	const renderFieldListProccess = (param) => {
		setSelectedField(param, () => {
			onFetch();
		});
		setShowModal(false);
	}

	const renderFieldList = ({ item }) => {
		let color = colors.grey3;
		if (item.fieldname === selectedField.fieldname) color = "black"
		return (
			<TouchableItem
				onPress={renderFieldListProccess({ ...item })}
			>
				<View style={{ width: '90%', alignSelf: 'center', padding: 15, alignItems: 'center', backgroundColor: 'white' }}>
					<Text style={{ color }} >{item.fieldname}</Text>
				</View>
			</TouchableItem>
		)
	}

	const onLayoutScroll = (e) => {
		setScrollHeight(e.nativeEvent.layout.height)
	}

	const onProductionPress = () => {
		if (selected == "PEP" || selected == "ASSET" &&
			selectedAsset != 'SELECT ASSET' || selected == "FIELD" &&
			selectedField.fieldname != "SELECT FIELD" || selected == "BUSINESS PARTNERSHIP" &&
			selectedBP != "SELECT DATA") {
			navigation.navigate('OilProduction', { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit, selectedBP: selectedBP })
		} else {
			Alert.alert('Error', 'Please select Asset or Field Data')
		}
	}

	const onLiftingPress = () => {
		if (selected == "PEP" || selected == "ASSET" &&
			selectedAsset != 'SELECT ASSET' || selected == "FIELD" &&
			selectedField.fieldname != "SELECT FIELD" || selected == "BUSINESS PARTNERSHIP" &&
			selectedBP != "SELECT DATA") {
			navigation.navigate('OilLifting', { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit, selectedBP: selectedBP })
		} else {
			Alert.alert('Error', 'Please select Asset or Field Data')
		}
	}

	const onSPUPress = () => {
		if (
			selected == "PEP" || selected == "ASSET" &&
			selectedAsset != 'SELECT ASSET' || selected == "FIELD" &&
			selectedField.fieldname != "SELECT FIELD" || selected == "BUSINESS PARTNERSHIP" &&
			selectedBP != "SELECT DATA") {
			navigation.navigate('OilSPU', { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit, selectedBP: selectedBP })
		} else {
			Alert.alert('Error', 'Please select Asset or Field Data')
		}
	}

	const onGasProductionPress = () => {
		if (selected == "PEP" || selected == "ASSET" &&
			selectedAsset != 'SELECT ASSET' || selected == "FIELD" &&
			selectedField.fieldname != "SELECT FIELD" || selected == "BUSINESS PARTNERSHIP" &&
			selectedBP != "SELECT DATA") {
			navigation.navigate("GasProduction", { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit, selectedBP: selectedBP })
		} else {
			Alert.alert('Error', 'Please select Asset or Field Data')
		}
	}

	const onGasSalesPress = () => {
		if (selected == "PEP" || selected == "ASSET" && selectedAsset != 'SELECT ASSET') {
			navigation.navigate('GasSales', { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit })
		} else {
			Alert.alert('Error', 'No Data Available')
		}
	}

	const onGasDeliveredPress = () => {
		if (selected == "PEP" || selected == "ASSET" &&
			selectedAsset != 'SELECT ASSET' || selected == "FIELD" &&
			selectedField.fieldname != "SELECT FIELD" || selected == "BUSINESS PARTNERSHIP" &&
			selectedBP != "SELECT DATA") {
			navigation.navigate('GasDelivered', { level: selected, asset: selectedAsset, idpfunit: selectedField.idpfunit, selectedBP: selectedBP })
		} else {
			Alert.alert('Error', 'Please select Asset or Field Data')
		}
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					onRefresh={onRefreshList}
					refreshing={refreshing}
				/>}
			style={globalStyles.container}
			contentContainerStyle={{ minHeight: scrollHeight }}
		>
			<View onLayout={onLayoutScroll}>

				{/* LEVEL DROPDOWN */}
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ModalDropdown
						style={{ flex: 1 }}
						defaultIndex={0}
						defaultValue="PEP"
						textStyle={{ color: '#000000', fontSize: normalize(16) }}
						options={['PEP', 'ASSET', 'FIELD']}
						dropdownStyle={{ height: 'auto', width: '100%' }}
						showsVerticalScrollIndicator={false}
						renderSeparator={() => null}
						onSelect={(idx, value) => onChangeDropdown(value)}
					>
						<View style={{ paddingHorizontal: '2.5%', marginVertical: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text
								style={{
									color: "#000000",
									fontSize: 12,
									marginLeft:
										selected == "ASSET" ||
											selected == "FIELD"
											? 5
											: 5,
								}}
							>
								{selected}
							</Text>
							<Icon
								name='caret-down'
								size={20}
								color='#000000'
								style={{ marginRight: "2.5%" }}
							/>
						</View>
					</ModalDropdown>
					{
						selected == "ASSET" || selected == "FIELD" ?
							<ModalDropdown
								style={{ width: selected == "ASSET" ? '50%' : '30%' }}
								defaultIndex={0}
								defaultValue="ASSET-1"
								textStyle={{ color: '#000000', fontSize: normalize(16) }}
								options={[
									'ASSET-1',
									'ASSET-2',
									'ASSET-3',
									'ASSET-4',
									'ASSET-5',
									'TAC & KSO'
								]}
								dropdownStyle={{ height: 'auto', width: '100%' }}
								showsVerticalScrollIndicator={false}
								renderSeparator={() => null}
								onSelect={(idx, value) => selected == "FIELD" ? setSelectedAssetForField(value) : onChangeAsset(value)
								}
							>
								<View style={{ paddingHorizontal: '2.5%', marginVertical: '3%', paddingHorizontal: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
									<Text style={{ color: '#000000', fontSize: 12 }}>{selected == "FIELD" ? selectedAssetForField : selectedAsset}</Text>
									<Icon name="caret-down" size={20} color="#000000" style={{ marginRight: '2.5%' }} />
								</View>
							</ModalDropdown> : null
					}
					{
						selected == "FIELD" ?
							<TouchableItem
								onPress={() => {
									if (loadingField || fieldList < 1) {
										Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
									}
									else {
										setShowModal(true)
									}
								}}
								style={{ flex: 1 }}
							>
								<View style={{ paddingHorizontal: '2.5%', width: selected == "ASSET" ? '50%' : '30%', marginVertical: '3%', paddingHorizontal: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
									<Text style={{ color: '#000000', fontSize: 12 }}>{selectedField.fieldname}</Text>
									<Icon name="caret-down" size={20} color="#000000" style={{ marginRight: '2.5%' }} />
								</View>
							</TouchableItem>
							: null
					}
					{
						selected == "BUSINESS PARTNERSHIP" ?
							<ModalDropdown
								style={{ flex: 1 }}
								defaultIndex={0}
								defaultValue="ASSET"
								textStyle={{ color: '#000000', fontSize: normalize(16) }}
								options={['SUMATERA 1', 'SUMATERA 2', 'KTI & JAWA']}
								dropdownStyle={{ height: 'auto', width: '100%' }}
								showsVerticalScrollIndicator={false}
								renderSeparator={() => null}
								onSelect={(idx, value) => onChangeBP(value)}
							>
								<View style={{ paddingHorizontal: '2.5%', marginVertical: '3%', paddingHorizontal: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
									<Text style={{ color: '#000000', fontSize: 12 }}>{selectedBP}</Text>
									<Icon name="caret-down" size={20} color="#000000" style={{ marginRight: '2.5%' }} />
								</View>
							</ModalDropdown> : null
					}
				</View>

				{/* DATEPICKER */}
				<View style={{ paddingHorizontal: 15, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }} >
					<Text style={{ color: 'black', }} >Production Report for {moment(new Date(value)).format('D-M-YYYY')}</Text>
					<Text style={{ color: 'blue', textDecorationLine: 'underline', }} onPress={() => setVisible(true)} >Change Date </Text>
				</View>
				{
					visible &&
					<DateTimePicker
						mode='date'
						display='default'
						maximumDate={new Date()}
						value={value}
						onChange={onChangeDate}
					/>
				}

				{/* OIL CARD */}
				<Card
					containerStyle={styles.cardContainer}
				>
					<View style={styles.cardContainerHeader}>
						<Text style={styles.titleText}>Oil <MaterialCommunityIcons name="barrel" color='white' size={normalize(18)} /> </Text>
					</View>
					<View style={styles.cardContainerContent}>
						<TouchableItem onPress={onProductionPress}
							onLayout={onLayout}>
							<View
								accessibilityLiveRegion="assertive"
								style={styles.cardContainerIcon}
							>
								<Image
									source={require('../../assets/images/production.png')}
									resizeMode='contain'
								/>
								<Text style={styles.contentText}> Production </Text>
							</View>
						</TouchableItem>

						<TouchableItem onPress={onLiftingPress} >
							<View style={styles.cardContainerIcon}>
								<MaterialCommunityIcons name="ferry" size={normalize(46)} color='white' style={{ marginBottom: '5%' }} />
								<Text style={styles.contentText}> Lifting </Text>
							</View>
						</TouchableItem>

						<TouchableItem onPress={onSPUPress}
							onLayout={onLayout} >
							<View
								accessibilityLiveRegion="assertive"
								style={styles.cardContainerIcon}
							>
								<MaterialCommunityIcons name="tower-fire" size={normalize(46)} color='white' style={{ marginBottom: '5%' }}>
								</MaterialCommunityIcons>

								<Text style={styles.contentText}> Received at SPU </Text>
								<View zIndex={10} style={{ bottom: bottom, position: 'absolute', right: right }}>
									<MaterialCommunityIcons name="water" size={normalize(16)} color='white' style={{ marginBottom: '5%', }}></MaterialCommunityIcons>
								</View>
							</View>
						</TouchableItem>

						<TouchableItem onPress={() => Alert.alert('Notification', 'Coming Soon')}>
							<View style={styles.cardContainerIcon}>
								<FontAwesome name="money-check-alt" size={normalize(46)} color='white' style={{ marginBottom: '5%' }} />
								<Text style={styles.contentText}> Reconciliation </Text>
							</View>
						</TouchableItem>
					</View>
				</Card>

				{/* GAS CARD */}
				<Card
					containerStyle={styles.redCardContainer}
				>
					<View style={styles.redCardContainerHeader}>
						<Text style={styles.titleText}>Gas <MaterialCommunityIcons name="fire" color='white' size={normalize(18)} /> </Text>
					</View>
					<View style={styles.redCardContainerContent}>

						<TouchableItem onPress={onGasProductionPress} >
							<View style={styles.redCardContainerIcon}
								onLayout={onLayout}
							>
								<Image
									resizeMethod='resize'
									resizeMode='contain'
									style={{ width: '75%', height: '60%' }}
									source={require('../../assets/images/gas-well.png')} />
								<Text style={styles.contentText}> Production </Text>
							</View>
						</TouchableItem>

						<TouchableItem onPress={onGasSalesPress} >
							<View style={styles.redCardContainerIcon}>
								<Image
									source={require('../../assets/images/sales.png')}
									resizeMode='contain'
								/>
								<Text style={styles.contentText}> Sales </Text>
							</View>
						</TouchableItem>

						<TouchableItem onPress={onGasDeliveredPress} >
							<View style={styles.redCardContainerIcon}>
								<FontAwesome name="balance-scale" size={normalize(35)} color='white' style={{ marginBottom: 10 }} />
								<Text style={styles.contentText}> Gas Delivered </Text>
							</View>
						</TouchableItem>

						<TouchableItem onPress={() => Alert.alert('Notification', 'Coming Soon')} >
							<View style={styles.redCardContainerIcon}>
								<FontAwesome name="money-check-alt" size={normalize(46)} color='white' style={{ marginBottom: '5%' }} />
								<Text style={styles.contentText}> Reconciliation </Text>
							</View>
						</TouchableItem>
					</View>
				</Card>
			</View>

			{/* SUMMARY */}
			{renderSummary()}

			{/* MODAL */}
			<Modal
				onRequestClose={() => setShowModal(false)}
				visible={showModal}
				transparent
			>
				<TouchableItem
					onPress={() => setShowModal(false)}
				>
					<View style={globalStyles.opacityContainer}>
						<View>
							<FlatList
								style={{ height: '50%' }}
								ListEmptyComponent={(
									<View style={{ padding: 15 }}>
										<Text>{
											selectedAsset == "TAC & KASO" ? "There are no Field for BP"
												: errorField ? errorField : ""
										}</Text>
									</View>
								)}
								// extraData={fieldList}
								data={fieldList}
								renderItem={renderFieldList}
								keyExtractor={(item, index) => item + index}
							/>
						</View>
					</View>
				</TouchableItem>
			</Modal>
		</ScrollView>
	)
}