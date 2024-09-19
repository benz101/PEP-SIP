import React, { PureComponent, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList
} from 'react-native';
import styles from '../ProgressInput/style';
import globalStyles from '../global/styles';
import TouchableItem from '../global/Touchable';
import { Card, normalize } from 'react-native-elements';

const bgColors = ['#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893', '#ED4A7B', '#E8743B', '#5899DA', '#19A979', '#13A4B4', '#945ECF', '#6C8893']
const darkBgColors = ['#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65', '#b6004f', '#b0450c', '#156ba8', '#00794d', '#007584', '#63319d', '#405b65']

export default function DetailProgressInput({ route }) {
    const [detailList, setDetailList] = useState([]);

    useEffect(() => {
        getDetailList();
    }, []);

    const getDetailList = () => {
        let newObj = {}
        let detail = []
        const { params } = route;
        console.log("this is result: "+ JSON.stringify(params));
        let objKeys = Object.keys(params);
        objKeys.forEach((item, index) => {
            newObj = {
                ...newObj,
                ...params[item]
            }
            detail.push(newObj)
        })
        setDetailList(detail);
    }

    const renderItem = ({ item, index }) => {
        return (
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
        )
    }

    return (
        <View style={globalStyles.container}>
            <FlatList
                contentContainerStyle={{ marginTop: 10 }}
                data={detailList}
                renderItem={renderItem}
                keyExtractor={(item, index) => item + index}
                // extraData={props}
            />
        </View>
    )
}