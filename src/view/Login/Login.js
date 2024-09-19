import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Alert,
    Text,
    Modal,
    FlatList,
    TextInput,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Button,
    Divider
} from 'react-native-elements';
import axios from 'axios';
// import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import CryptoJS from "react-native-crypto-js";
import globalStyles from '../global/styles';
import styles from './LoginStyle';
import colors from '../../assets/constants/colors';
import configUrl from '../../assets/constants/config';
import SplashScreen from '../../view/SplashScreen';
import TouchableItem from '../global/Touchable';
import { useRef } from 'react';
import { CommonActions } from '@react-navigation/routers';
import { useDispatch } from 'react-redux';
import { userSuccess } from '../../controller/actionUser';
let pinch;

export default function Login({ navigation }) {
    const [hidePassword, setHidePassword] = useState(true)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showRole, setShowRole] = useState(false);
    const [roles, setRoles] = useState([]);
    const [cookie, setCookie] = useState('');
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const dispatch = useDispatch();



    useEffect(() => {
        let isMounted = true;
        checkSession();
        return () => { isMounted = false };
    }, [showSplash])



    const checkSession = async () => {
        try {
            const isLogin = await AsyncStorage.getItem("isLogin");
            if (isLogin === null) {
                setLogin(false);
                // console.log("Session null: " + isLogin);
                setShowSplash(false);
            } else {
                if (isLogin === "YES") {
                    setLogin(true);
                    // console.log("Session hasLogin: " + isLogin);
                    const getUserDataValue = await AsyncStorage.getItem("isUserData");
                    const isUserData = JSON.parse(getUserDataValue);
                    const isRoles = await AsyncStorage.getItem("isRoles");
                    const isSelected = await AsyncStorage.getItem("isSelected");
                    if (isUserData !== null && isRoles !== null && isSelected !== null) {
                        setShowSplash(false);
                        autoGoNavigate(isUserData, isRoles, isSelected);
                    }
                } else {
                    setLogin(false);
                    setShowSplash(false);
                    // console.log("Session hasLogout");
                }
            }
        } catch (err) {
            console.log(err)
        }

    }

    const managePasswordVisibility = () => {
        setHidePassword(!hidePassword);
    }

    //PRODUCTION
    const onSubmit = async () => {
        var timestamp = new Date().toISOString();

        if (username == "" && password == "") {
            Alert.alert("Error", "Username and Password cannot be empty")
        } else {
            pinch = require('react-native-pinch')
            setLoading(true);
            const body = {
                script_name: "api/v2/api_login_ldap",
                data: {
                    username: username,
                    timestamp: timestamp,
                    userpass: CryptoJS.AES.encrypt(password, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(timestamp)).substring(0, 32)).toString(), noldap: !1,
                    corporate_id: "1"
                }
            }

            try {
                const result = await axios.post(`${configUrl.https}`, body, {
                    timeout: 2000
                })
                const json = result.data;
                setLoading(false);
                if (json.status == "0000" && json.role2.length == 1) {
                    saveData(result);
                    return goNavigate(json);
                } else if (json.status == "0000" && json.role2.length > 1) {
                    saveData(result);
                    setRoles(result.data);
                    setShowRole(!showRole);

                } else {
                    return Alert.alert("Oops", "Invalid Username or Password")
                }
            } catch (err) {
                setLoading(false);
                return Alert.alert("Error", "Something went wrong with your internet connection. Please check your internet connection")
            }
        }


    }

    const saveData = async (res) => {
        const json = res.data;
        // console.log("Save Data: " + JSON.stringify(json));
        res.headers['set-cookie'].map((e) => {
            // console.log("Set Generic: Yes");
            setCookie(e);
            setGenericThisPassword(e, json);
        })



    }

    const setGenericThisPassword = async (cookie, json) => {
        try {
            await Keychain.setGenericPassword(cookie, JSON.stringify(json));
            // console.log("Set Generic: Yes");
        } catch (error) {
            console.log(error);
        }
    }

    const goNavigate = async (res) => {
        const userDataValue = JSON.stringify(res);
        const roles = res.roles;

        AsyncStorage.setItem("isUserData", userDataValue);

        // console.log("This is roles: " + roles);
        // console.log("This is selected: " + selected);

        if (res.role2.length > 1 && selected == "") {
            Alert.alert("Error", "Please select role")
        } else {
            AsyncStorage.setItem("isLogin", "YES");
            AsyncStorage.setItem("isSelected", selected);
            AsyncStorage.setItem("isRoles", roles);
            let routeName = "NoApproval";
            if (roles.search("ASM") > -1 || selected == "ASM") {
                routeName = "Dashboard"
            }
            if (roles.search("FM") > -1 || selected == "FM") {
                routeName = "Dashboard"
            }
            if (roles.search("SPV") > -1 || selected == "SPV") {
                routeName = "Dashboard"
            }
            if (selected == "VEW" || roles == "VEW" || roles == "ADM" || selected == "ADM") {
                routeName = "DashboardVew"
            }
            if (selected == "OPR" || roles == "OPR") {
                routeName = "NoApproval"
            }
            const params = { user: res, roles: selected };
            dispatch(userSuccess(params));
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: routeName }]
                })
            );
        }
    }

    const autoGoNavigate = async (isUserData, isRoles, isSelected) => {
        let routeName = "NoApproval";
        if (isRoles.search("ASM") > -1 || isSelected == "ASM") {
            routeName = "Dashboard"
        }
        if (isRoles.search("FM") > -1 || isSelected == "FM") {
            routeName = "Dashboard"
        }
        if (isRoles.search("SPV") > -1 || isSelected == "SPV") {
            routeName = "Dashboard"
        }
        if (isSelected == "VEW" || isRoles == "VEW" || isRoles == "ADM" || isSelected == "ADM") {
            routeName = "DashboardVew"
        }
        if (isSelected == "OPR" || isRoles == "OPR") {
            routeName = "NoApproval"
        }
        const params = { user: isUserData, roles: isSelected }
        dispatch(userSuccess(params));
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: routeName }]
            })
        );
    }

    const onSelect = (item) => {
        AsyncStorage.setItem("isSelected", item)
        setSelected(item)
    }

    const renderRoles = (res) => {
        return (
            <Modal
                transparent
                visible={showRole}
                onRequestClose={() => setShowRole(false)}
            >
                <TouchableItem onPress={() => setShowRole(false)}>
                    <View style={globalStyles.opacityContainer}>
                        <View style={{ maxHeight: "70%", marginHorizontal: '3%' }}>
                            <FlatList
                                data={roles.role2}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={() => <Divider />}
                                renderItem={({ item }) => {
                                    const color = selected == item ? colors.blue : 'black'
                                    return (
                                        <TouchableItem onPress={() => onSelect(item)}>
                                            <View style={globalStyles.peopleListContainer}>
                                                <Text style={{ color }} >{item}</Text>
                                            </View>
                                        </TouchableItem>
                                    )
                                }}
                            />
                        </View>
                        <Button
                            title="LOGIN"
                            buttonStyle={{ backgroundColor: colors.red, margin: 10, marginTop: -3 }}
                            onPress={() => goNavigate(res)}
                            containerStyle={{ marginVertical: '2%', marginHorizontal: 7 }}
                        />
                    </View>
                </TouchableItem>
            </Modal>
        )
    }

    const emailInput = useRef(null);
    const passwordInput = useRef(null)

    if (showSplash) {
        return <SplashScreen />
    }
    return (
        <View style={globalStyles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View style={styles.logoContainer}>
                <Image resizeMode="contain" source={require('../../assets/images/ic_logo.jpg')} style={styles.imageLogo} />
            </View>
            <View style={styles.form}>
                <View style={styles.formInput}>
                    <Icon name="ios-mail" size={25} color="#000000" style={styles.icon} />
                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                        inputStyle={{ color: 'black' }}
                        underlineColorAndroid={colors.blue}
                        // ref={input => emailInput = input}
                        onChangeText={username => setUsername(username)}
                    />
                </View>
                <View style={styles.formInput}>
                    <Icon name="ios-lock" size={25} color="#000000" style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        style={styles.inputPassword}
                        keyboardType="default"
                        inputStyle={{ color: '#000000' }}
                        underlineColorAndroid={colors.blue}
                        secureTextEntry={hidePassword}
                        // ref={input => passwordInput = input}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <TouchableOpacity style={styles.viewIcon} onPress={managePasswordVisibility}>
                        <Icon name={hidePassword ? "ios-eye-off" : "ios-eye"} size={25} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <Button
                    loading={loading}
                    disabled={loading}
                    title="Login"
                    buttonStyle={{ backgroundColor: colors.blue, margin: 10, marginTop: -3 }}
                    onPress={onSubmit}
                />
                {renderRoles(roles)}
            </View>
            <View style={styles.version}>
                <Text>Version 1.1</Text>
            </View>
        </View>
    )
}

