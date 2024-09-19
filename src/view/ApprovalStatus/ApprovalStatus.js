import React, { PureComponent, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList
} from "react-native";
import moment from 'moment';
import axios from 'axios';
import globalStyles from '../global/styles';
import { Card, normalize } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import styles from './ApprovalStatusStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../../assets/constants/colors'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import pinch from 'react-native-pinch';
import TouchableItem from '../global/Touchable';
import configUrl from '../../../assets/constants/config';
// import CustomDatePicker from '../../../assets/elements/DatePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../../assets/elements/Loader';
import Toast from 'react-native-simple-toast';

const { height, width } = Dimensions.get('window');
const layoutHeight = height * 0.135;
const layoutWidth = width * 0.2
const position = {
  bottom: layoutHeight - (layoutHeight * 0.55),
  right: layoutWidth - (layoutWidth * 0.82)
}
const bgColors = ['#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893']
const darkBgColors = ['#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65']
const day = new Date().getDate();
const month = new Date().getMonth();
const year = new Date().getFullYear();
const todayString = `${day}-${month + 1}-${year}`

export default function ApprovalStatus({ navigation }) {

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('PEP');
  const [selectedAsset, setSelectedAsset] = useState('SELECT ASSET');
  const [selectedAssetForField, setSelectedAssetForField] = useState('SELECT ASSET');
  const [selectedBP, setSelectedBP] = useState('SELECT DATA');
  const [summary, setSummary] = useState({});
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorSummary, setErrorSummary] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [fieldList, setFieldList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState({
    fieldname: "SELECT FIELD",
    idpfunit: 0
  });
  const [loadingField, setLoadingField] = useState(false);
  const [approvalstats, setApprovalStatus] = useState([]);
  const [date, setDate] = useState(todayString);
  const [value] = useState(new Date());
  const [loadingDetail] = useState(false);

  useEffect(() => {
    getFetch();
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('black');
    console.log('This is approval status');
  }, [])


  const getFetch = async () => {
    try {
      await onFetch();
    }
    catch (err) {
      console.log(err);
    }
  }


  const onChangeDate = (event, date) => {
    if (date === undefined) {
      setVisible(false);
    } else {
      setVisible(false);
      setValue(date);
      onFetch()
    }
  }

  const onLoadField = async () => {
    const body = {
      script_name: "api/v2/api_getField",
      data: {
        asset: selectedAssetForField
      }
    }
    setLoadingField(true);

    try {
      const result = await axios.post(`${configUrl.https2}`, body, {
        timeout: 2000000
      })
      const json = result.data;
      if (json) {
        setFieldList();
        setLoadingField(false);
      }
    } catch (error) {
      setLoadingDetail(false);
      setErrorField("Failed To Load Field")
      Toast.showWithGravity("Please check your internet connections in ApprovalStatus", Toast.LONG, Toast.BOTTOM);
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

  const convertStats = (json) => {
    let approvalstats = [];
    let newObj = new Object();
    const objKeys = Object.keys(json.status_approval);
    objKeys.forEach((item, index) => {
      newObj = {
        ...newObj,
        asset: item,
        ...json.status_approval[item]
      }
      approvalstats.push(newObj);
    })
    setApprovalStats(approvalstats.reverse());
  }

  const setRenderFieldList = (param) => {
    setSelectedField(param)
    setShowModal(false)
    onFetch()
  }

  const renderFieldList = ({ item }) => {
    let color = colors.grey3;
    if (item.fieldname === selectedField.fieldname) color = "black"
    return (
      <TouchableItem
        onPress={() => setRenderFieldList({ ...item })}
      >
        <View style={{ width: '90%', alignSelf: 'center', padding: 15, alignItems: 'center', backgroundColor: 'white' }}>
          <Text style={{ color }} >{item.fieldname}</Text>
        </View>
      </TouchableItem>
    )
  }

  const onFetch = async () => {
    setLoaingSummary(true);

    // const api = this.state.selected == 'PEP' ? `${configUrl.https}` : `${configUrl.https2}`
    let date = `${moment(new Date(value)).format('D-M-YYYY')}`
    let data = new Object({
      script_name: "api/v2/api_approval_status",
      data: {
        tgl: date
      }
    });
    if (selected === "ASSET") {
      data = {
        script_name: "api/v2/api_approval_status_asset",
        data: {
          asset: selectedAsset,
          tgl: date
        }
      }
    }

    if (selected === "FIELD") {
      data = {
        script_name: "api/v2/api_approval_status_field",
        data: {
          idpfunit: selectedField.idpfunit,
          tgl: date
        }
      }
    }

    try {
      const result = await axios.post(`${configUrl.https2}`, data, {
        timeout: 2000000
      })
      const json = result.data;
      if (json) {
        convertStats(json)
        setLoadingSummary(false);
      }
    } catch (err) {
      setLoadingSummary(false);
      setErrorField("Failed To Load Data");
      Toast.showWithGravity("Please check your internet connections ApprovalStatus", Toast.LONG, Toast.BOTTOM);
    }
  }

  const onNavigateDetail = async (item) => {
    setLoadingDetail(true);
    let date = `${moment(new Date(value)).format('D-M-YYYY')}`
    if (selected === "PEP") {
      const asset = item.asset.replace(' ', '-')
      data = {
        script_name: "api/v2/api_detail_approval_status",
        data: {
          asset: asset,
          tgl: date,
        }
      }
    }

    if (selected === "ASSET") {
      data = {
        script_name: "api/v2/api_detail_approval_status_asset",
        data: {
          idpfunit: item.idpfunit,
          tgl: date
        }
      }
    }

    try {
      const result = await axios.post(`${configUrl.https2}`, data, {
        timeout: 200000
      })
      const json = result.data;
      setLoadingDetail(false);
      navigation.navigate("DetailApproval", json.detail_status)
    } catch (err) {
      setLoadingDetail(false);
      setErrorField("Failed To Load Data");
      Toast.showWithGravity( "Please check your internet connections ApprovalStatus", Toast.LONG, Toast.BOTTOM);
    }
  }

  const renderApprovalStats = ({ item, index }) => {
    return (
      <TouchableItem
        onPress={() => selected === "PEP" ||
          selected === "ASSET" ?
          onNavigateDetail(item) : Alert.alert("There is no Data for it")}
      >
        <Card
          containerStyle={[styles.swipeCardContainer, { backgroundColor: bgColors[index] }]}
        >
          <View style={[styles.cardContainerHeader, { backgroundColor: darkBgColors[index], justifyContent: 'center' }]}>
            <Text style={[styles.titleText, { textAlign: 'center' }]}>{item.asset}</Text>
          </View>
          <Text style={styles.contentText}>Review On Progress : {item["Review On Progress"] ? item["Review On Progress"] : "-"}</Text>
          <Text style={styles.contentText}>No Entry : {item["No Entry"] ? item["No Entry"] : "-"}</Text>
          <Text style={styles.contentText}>Approved Finalize : {item["Approved Finalize"] ? item["Approved Finalize"] : "-"} </Text>
        </Card>
      </TouchableItem>
    )
  }

  const renderLoadingSummary = () => {
    return (
      <Card
        containerStyle={styles.swipeCardContainer}
      >
        <View style={[styles.cardContainerHeader, { justifyContent: 'center' }]}>
          <View style={{ backgroundColor: '#cccccc', height: height * 0.01, width: '40%' }} />
        </View>
        <Text style={styles.contentText}>Review On Progress : {item["Review On Progress"] ? item["Review On Progress"] : "-"}</Text>
        <Text style={styles.contentText}>No Entry : {item["No Entry"] ? item["No Entry"] : "-"}</Text>
        <Text style={styles.contentText}>Approved Finalize : {item["Approved Finalize"] ? item["Approved Finalize"] : "-"} </Text>
      </Card>
    )
  }

  const renderFlatList = () => {
    if (loadingSummary) {
      return (
        <ActivityIndicator size="large" color="red" />
      )
    }
    return (
      <FlatList
        data={approvalstats}
        keyExtractor={(item, index) => item.asset + index}
        renderItem={renderApprovalStats}
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  const setThisSelected = (value) => {
    setSelected(value, () => {
      selected === "PEP" ? onFetch() : false
    });
  }

  const setThisSelectedAsset = (value) => {
    selected == "FIELD" ? setSelectedAssetForField(value, {
      onLoadField()
    }) : setSelectedAsset(value, {
      onFetch()
    })
  } 

  if (loadingDetail) {
    return <Loader visible={true} />
  }
  if (selected === "BUSINESS PARTNERSHIP") {
    setLoadingSummary(false);
    Alert.alert("Error", "No Data Available");
  }
  return (
    <ScrollView style={globalStyles.container}>

      <View style={globalStyles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ModalDropdown
            style={{ flex: 1 }}
            defaultIndex={0}
            defaultValue="PEP"
            textStyle={{ color: '#000000', fontSize: normalize(16) }}
            options={['PEP', 'ASSET', 'FIELD', 'BUSINESS PARTNERSHIP']}
            dropdownStyle={{ height: 'auto', width: '100%' }}
            showsVerticalScrollIndicator={false}
            renderSeparator={() => null}
            onSelect={(idx, value) => setThisSelected(value)}
          >
            <View style={{ paddingHorizontal: '2.5%', marginVertical: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ color: '#000000', fontSize: 12, marginLeft: selected == "ASSET" || selected == "FIELD" ? 5 : 5 }}>{selected}</Text>
              <Icon name="caret-down" size={20} color="#000000" style={{ marginRight: '2.5%' }} />
            </View>
          </ModalDropdown>
          {
            selected == "ASSET" || selected == "FIELD" ?
              <ModalDropdown
                style={{ width: selected == "ASSET" ? '50%' : '30%' }}
                defaultIndex={0}
                defaultValue="ASSET-1"
                textStyle={{ color: '#000000', fontSize: 16 }}
                options={['ASSET-1', 'ASSET-2', 'ASSET-3', 'ASSET-4', 'ASSET-5', 'TAC & KSO']}
                dropdownStyle={{ height: 'auto', width: width }}
                showsVerticalScrollIndicator={false}
                renderSeparator={() => null}
                onSelect={(idx, value) => setThisSelectedAsset(value)}
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
                    Toast.showWithGravity("Loading Field...", Toast.LONG, Toast.BOTTOM);
                  }
                  else {
                    setShowModal(true);
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
                textStyle={{ color: '#000000', fontSize: 16 }}
                options={['SUMATERA 1', 'SUMATERA 2', 'JAWA & KTI']}
                dropdownStyle={{ height: 'auto', width: width }}
                showsVerticalScrollIndicator={false}
                renderSeparator={() => null}
                onSelect={(idx, value) => setSelectedBP(value)}
              >
                <View style={{ paddingHorizontal: '2.5%', marginVertical: '3%', paddingHorizontal: '3%', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text style={{ color: '#000000', fontSize: 12 }}>{selectedBP}</Text>
                  <Icon name="caret-down" size={20} color="#000000" style={{ marginRight: '2.5%' }} />
                </View>
              </ModalDropdown> : null
          }
        </View>
        <View style={{ paddingHorizontal: 15, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }} >
          <Text style={{ color: 'black', }} >Summary for {moment(new Date(value)).format('D-M-YYYY')}</Text>
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
        {renderFlatList()}
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
                  extraData={fieldList}
                  data={fieldList}
                  renderItem={renderFieldList}
                  keyExtractor={(item, index) => item + index}
                />
              </View>
            </View>
          </TouchableItem>
        </Modal>
      </View>
    </ScrollView>
  )
}