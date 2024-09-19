import pinch from 'react-native-pinch';
import { NavigationActions } from 'react-navigation';
import {
    GET_OIL_REQUEST,
    GET_OIL_SUCCESS,
    GET_OIL_FAILURE
} from '../constants';
import configUrl from '../assets/constants/config';

export const getOilProduction = () => {
    return (dispatch) => {
        dispatch({ type: GET_OIL_REQUEST });
        const body = {
            script_name: "api/v2/api_oil_production",
            data: {}
        }
        pinch.fetch(configUrl.https, {
            method: 'POST',
            headers: { customHeader: 'customValue' },
            body: JSON.stringify(body),
            timeoutInterval: 10000,
            sslPinning: {
                cert: 'certificate'
            }
        }, (err, res) => {
            if (err) {
                dispatch({ type: GET_OIL_FAILURE, err: err })
                return null;
            }
            dispatch({ type: GET_OIL_SUCCESS, payload: res.data })
        })
    }
}