import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    Button
} from "react-native";
import moment from 'moment';
import globalStyles from '../global/styles';
import { Card } from 'react-native-elements';
import styles from './style';
import colors from '../../assets/constants/colors'
import axios from 'axios';
import TouchableItem from '../global/Touchable';
import configUrl from '../../assets/constants/config';
import DateTimePicker from "react-native-modal-datetime-picker";
import Loader from '../../assets/elements/Loader';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

const bgColors = ['#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893']
const darkBgColors = ['#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65']
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

export default function ProgressInput({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selected] = useState('PEP');
    const [fieldList] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedField, setSelectedField] = useState("SELECT FIELD");
    const [progress_input, setProgress_input] = useState([]);
    const [date, setDate] = useState(moment(yesterday).format('D-M-YYYY'));
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [idunit] = useState(null);
    const [errorField, setErrorField] = useState("Failed To Load Field");
    const [selectedAsset, setSelectedAsset] = useState('SELECT ASSET');
    const spvResult = useSelector((state) => state.spv.params);



    useEffect(() => {
        onFetch();
        console.log('This is approval status');
    }, [])


    const onFetch = async () => {
        console.log("Resulting" + JSON.stringify(spvResult));
        setLoadingSummary(true);

        let prod_date = moment(date, 'D-M-YYYY').format('DD-MM-YYYY');

        let data = new Object({
            script_name: "api/v2/api_progress_input_field",
            data: {
                by_unit: "asset",
                idunit: "2475",
                date: date
            }
        });


        if (selected === "ASSET") {
            data = {
                script_name: "api/v2/api_progress_input_field",
                data: {
                    by_unit: "asset",
                    idunit: idunit,
                    date: date
                }
            }
        }

        if (selected === "FIELD") {
            data = {
                script_name: "api/v2/api_progress_input_field",
                data: {
                    by_unit: "field",
                    idunit: selectedField.idpfunit,
                    date: date
                }
            }
        }

        try {
            const result = await axios.post(`${configUrl.https}`, data, {
                timeout: 200000
            })
            const json = result.data;

            if (json !== null) {
                console.log("JSON is: " + JSON.stringify(json));
                convertStats(json);
                setLoadingSummary(false);
            }
        } catch (err) {
            setLoadingSummary(false);
            setErrorField("Failed To Load Data");

        }
    }

    const onChangeDate = (newDate) => {
        try {
            let dayString = `${moment(new Date(newDate)).format('D-M-YYYY')}`
            setVisible(false);
            setDate(dayString)
            onFetch();
        } catch ({ code, message }) {
            ('Cannot open date picker', message);
        }
    }

    const convertStats = (json) => {
        let new_progress_input = [];
        let newObj = new Object();
        let objKeys = Object.keys(json.data)
        objKeys.forEach((item, index) => {
            newObj = {
                ...newObj,
                ...json.data[item]
            }
            new_progress_input.push(newObj)
        })
        setProgress_input(new_progress_input);
    }

    const setChangeRenderField = (param) => {
        setSelectedField(param);
        setShowModal(false, () => {
            onFetch();
        });
        // setIdpfunit(0);

    }

    const renderFieldList = ({ item }) => {
        let color = colors.grey3;
        if (item.fieldname === selectedField.fieldname) color = "black"

        return (
            <TouchableItem
                onPress={() => { () => setChangeRenderField(...item) }}
            >
                <View style={{ width: '90%', alignSelf: 'center', padding: 15, alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ color }} >{item.fieldname}</Text>
                </View>
            </TouchableItem >
        )
    }



    const renderApprovalStats = ({ item, index }) => {
        return (
            <TouchableItem
                onPress={() => selected === "PEP" ? onNavigateDetail(item) : null}
            >
                <Card
                    containerStyle={[styles.swipeCardContainer, { backgroundColor: bgColors[index] }]}
                >
                    <View style={[styles.cardContainerHeader, { backgroundColor: darkBgColors[index], justifyContent: 'center' }]}>
                        <Text style={[styles.titleText, { textAlign: 'center' }]}>{item.field_name}</Text>
                    </View>
                    <Text style={styles.contentText}>COMMITTED : {item.OPR.commit} / {item.OPR.n_group}</Text>
                    <Text style={styles.contentText}>SPV APPROVED : {item.SPV.spv_approve} / {item.SPV.n_group}</Text>
                    <Text style={styles.contentText}>ASM APPROVED : {item.ASM.asm_approve} / {item.ASM.n_group}</Text>
                    <Text style={styles.contentText}>FM APPROVED : {item.FM.fm_approve} / {item.FM.n_group}</Text>
                </Card>
            </TouchableItem>
        )
    }

    const onNavigateDetail = async (item) => {
        let idunit;
        if (item.field_name === "ASSET-1") {
            idunit = 2471
        } else if (item.field_name === "ASSET-2") {
            idunit = 2472
        } else if (item.field_name === "ASSET-3") {
            idunit = 2473
        } else if (item.field_name === "ASSET-4") {
            idunit = 2474
        } else if (item.field_name === "ASSET-5") {
            idunit = 2475
        } else if (item.field_name === "BUSINESS PARTNERSHIP") {
            idunit = "TAC & KSO"
        }

        setLoadingDetail(true);
        const data = {
            script_name: "api/v2/api_progress_input_field",
            data: {
                by_unit: "asset",
                idunit: idunit,
                date: date,
            }
        }

        try {
            const result = await axios.post(`${configUrl.https}`, data, {
                timeout: 200000
            })
            const json = result.data;
            console.log(json);
            setLoadingDetail(false);
            navigation.navigate("DetailProgressInput", json.data)
        } catch (err) {
            setLoadingDetail(false);
            setErrorField("Failed To Load Data");
            Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);

        }
    }


    const renderFlatList = () => {
        if (loadingSummary) {
            return (
                <ActivityIndicator size="large" color="red" />
            )
        }
        return (
            <FlatList
                data={progress_input}
                keyExtractor={(item, index) => item + index}
                renderItem={renderApprovalStats}
                showsHorizontalScrollIndicator={false}
            />
        )
    }

    if (loadingDetail) {
        return <Loader visible={true} />
    }
    if (selected === "BUSINESS PARTNERSHIP") {
        setLoadingSummary(false);
        Alert.alert("Error", "No Data Available")
    }


    return (
        <View style={globalStyles.container}>
            <View style={{ paddingHorizontal: 15, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={{ color: 'black', }} >Production Date : {date}</Text>
                <Text style={{ color: 'blue', textDecorationLine: 'underline', }} onPress={() => setVisible(true)} >Change Date </Text>
            </View>
            <DateTimePicker
                titleIOS="Select date"
                maximumDate={new Date()}
                isVisible={visible}
                onConfirm={onChangeDate}
                onCancel={() => setVisible(false)}
            />
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
    )
}