import pinch from 'react-native-pinch';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../constants';
import configUrl from '../assets/constants/config';
import {
    Alert,
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

export const LoginUser = ( username, password ) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        const body = {
            script_name: "api/v2/api_login",
            data : {
                username: username,
                userpass: password,
                corporate_id: ""
            }
        }
        pinch.fetch(configUrl.https, {
            method: 'POST',
            headers: { customHeader: 'customValue' },
            body: JSON.stringify(body),
            timeoutInterval: 10000, // timeout after 10 seconds
            sslPinning: {
                cert: 'certificate', // cert file name without the `.cer`
            }
        }, (err, res) => {
            if (err) {
                dispatch({ type: LOGIN_FAILURE, payload: err })
                return Alert.alert("Error", "Invalid Username or Password")
            }
            else {
                dispatch({ type: LOGIN_SUCCESS, payload: JSON.parse(res.bodyString) })
                dispatch(StackActions.reset({
                    index: 0,
                    action: [
                        NavigationActions.navigate({routeName: "Home"})
                    ]
                }))
            }
        }
    )}
}