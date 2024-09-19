import React, { Component, useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    Modal,
    FlatList,
    ScrollView,
    Dimensions,
    TextInput,
    StatusBar
} from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/constants/colors';
import styles from './style';
import globalStyles from '../global/styles';
import configUrl from '../../assets/constants/config';
import axios from 'axios';
// import { StackActions } from 'react-navigation';
import TouchableItem from '../global/Touchable';
import { StackActions } from '@react-navigation/routers';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const height = screenHeight < screenWidth ? screenWidth : screenHeight;
const width = screenWidth < screenHeight ? screenWidth : screenHeight;

export default function ASMFieldApproval({ navigation }) {


    const [people, setPeople] = useState([]);
    const [reject, setReject] = useState(false);
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [op_comment, setOp_comment] = useState('');
    const [productionDate, setProductionDate] = useState('');
    const [idgroupuispv, setIdgroupuispv] = useState('');
    const asmResult = useSelector((state) => state.asm.params);
    
    useEffect(() => {
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
                        onApproveProccess()
                    }
                },
            ]
        )
    }

    const onApproveProccess = async () => {
        const { date, orgid } = asmResult;
        const body = {
            script_name: "api/v2/api_asmapprove",
            data: {
                orgid: orgid,
                prod_date: date,
                op_comment: op_comment,
                idgroupui: asmResult.idgroupui,
                userid: asmResult.user.username
            }
        }

        try {
            const result = await axios.post(`${configUrl.https}`, body, {
                timeout: 20000,
                headers: {
                    'Cookie': asmResult.sessionId
                }
            })
            const json = result.data;

            setLoading(false);
            if (json.status == "0000") {
                Alert.alert("Notification", "Approve Success")
                // const popAction = StackActions.pop({
                //     n: 1,
                // });
                // navigation.dispatch(popAction);
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
    
        if (asmResult.status != "FINAL APPROVED" && asmResult.status == "SPV APPROVED" && asmResult.status != "COMMITTED" || asmResult.status == "REJECTED BY FM") {
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
                            asmResult.data.err2 == false && asmResult.data.err3 == false || asmResult.status == "REJECTED BY FM" ?
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
                            onPress={() => setReject(!reject)}
                            containerStyle={{ marginVertical: 20, marginHorizontal: 20, width: asmResult.data.err2 == false && asmResult.data.err3 == false || asmResult.status == "REJECTED BY FM" ? '40%' : '90%' }}
                        />
                    </View>
                </View>
            )
        }
        return null
    }

    const getUserReject = async () => {
        const body = {
            script_name: "api/v2/api_asmreject_selectgroup",
            data: {
                orgid: asmResult.orgid,
                prod_date: asmResult.date,
                idgroupui: asmResult.idgroupui,
                userid: asmResult.user.username
            }
        }

        try {
            const result = axios.post(`${configUrl.https}`, body, {
                timeout: 20000,
                headers: {
                    'Cookie': asmResult.sessionId
                }
            })
            const json = result.data;
            setLoading(false);
            json.groups.forEach(group => {
                group.elmts.forEach(result => {
                    setPeople([...people, result])
                })
            });

        } catch (err) {
            setLoading(false);
        }
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

    const onSelect = (user) => {
        setSelected(user.groupname);
        setIdgroupuispv(user.idgroupui);
    }

    const onRejectPress = async () => {
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
            script_name: "api/v2/api_asmreject",
            data: {
                prod_date: asmResult.date,
                op_comment: op_comment,
                idgroupui: asmResult.idgroupui,
                userid: asmResult.user.username,
                idgroupuispv: idgroupuispv,
            }
        }

        try {
            const result = await axios.post(`${configUrl.https}`, body, {
                timeout: 20000,
                headers: {
                    'Cookie': asmResult.sessionId
                }
            })
            const json = result.data;

            setLoading(false);
            if (json.status == "0000") {
                Alert.alert("Notification", "Reject Success")
                // const popAction = StackActions.pop({
                //     n: 1,
                // });
                // navigation.dispatch(popAction);
                const popAction = StackActions.pop(1);
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                {renderStatusApprove}
                {renderPeople}
                {
                    asmResult.data.historyapproval != null ?
                        <View style={styles.historyContainer}>
                            <View style={styles.headerTitleContainer}>
                                <Icon name="ios-person" size={18} style={styles.icon} />
                                <Text style={styles.title}>History Approval</Text>
                            </View>
                        </View> :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Not Found</Text>
                        </View>
                }
                <FlatList
                    data={asmResult.data.historyapproval}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item[0].toString()}
                />
            </View>
        </ScrollView>
    )
}