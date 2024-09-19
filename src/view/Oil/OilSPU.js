import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, processColor, ActivityIndicator, Platform } from 'react-native';
import { CombinedChart as BarChart } from 'react-native-charts-wrapper';
import axios from 'axios';
import url from '../../assets/constants/config';
import globalStyles from '../global/styles';
import Toast from 'react-native-simple-toast';

export default function OilSPU({ route }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(true);

    const [charts, setCharts] = useState({
        data: {
            dataSets: [{
                values: [],
                label: '',
                config: {
                    colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C')],
                    stackLabels: ['Asset 1', 'Asset 2', 'Asset 3'],
                    drawFilled: false,
                    drawValues: true,
                }
            }]
        }
    })

    const [legend, setLegend] = useState({
        enabled: true,
        textSize: 14,
        form: "SQUARE",
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true,
    })

    const [xAxis] = useState({
        valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Des'],
        position: 'BOTTOM',
        drawAxisLine: true,
        drawGridLines: false,
        axisMinimum: -0.5,
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: new Date().getMonth() + 0.5,
        spaceBetweenLabels: 0,
        labelRotationAngle: -45.0,
        limitLines: [{ limit: 115, lineColor: processColor('red'), lineWidth: 1 }]
    })

    const [yAxis] = useState({
        left: {
            axisMinimum: 0,
            labelCountForce: true,
            granularity: 5,
            granularityEnabled: true,
            drawGridLines: false
        },
        right: {
            axisMinimum: 0,
            labelCountForce: true,
            granularity: 5,
            granularityEnabled: true,
            enabled: false
        }
    })

    const handleSelect = (event) => {
        let entry = event.nativeEvent
    }


    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        const { params } = route;
        console.log("Result Params: "+params);
        if (params.level == "ASSET") {
            loadAssetData()
        } else if (params.level == "FIELD") {
            loadFieldData()
        } else if (params.level == "PEP") {
            loadPEPData()
        } else {
            loadBPData()
        }
    }

    const loadAssetData = async () => {
        setLoading(true);
        const { params } = route;
        const body = {
            script_name: "api/v2/api_received_spu_asset",
            data: {
                asset: params.asset
            }
        }

        try {
            const result = await axios.post(`${url.https2}`, body, {
                timeout: 20000
            });
            const json = result.data;
            if (json.status !== "0000") {
                setError(true);
                setLoading(false);
                return Alert.alert("Error", "Failed to get data")
            }
            else {
                let i = 1;
                const colors = [processColor('#ED4A7B'), processColor('#E8743B'), processColor('#5899DA'), processColor('#19A979'), processColor('#13A4B4'), processColor('#945ECF'), processColor('#6C8893')]
                let data = [];
                let chartsValue = [];
                let chartsLabel = [];
                let chartsValue5 = [];
                let chartsLabel5 = [];
                let totalData = [];
                let labelName = [];
                for (i; i <= 12; i++) {
                    let filtered = json.received_spu.filter((item) => item.mon == i)
                    filtered.forEach((item, index) => {
                        let newValue = parseFloat(`${item.avg_received_spu}`).toFixed(3)
                        newValue = newValue.split(".");
                        newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        newValue = newValue.join(".")
                        chartsValue = [...chartsValue, item.avg_received_spu]
                        chartsLabel = [...chartsLabel, `${item.ownership} \n ${newValue}`]
                        labelName = [...labelName, `${item.ownership}`]
                        if (chartsValue.length == json.c && chartsLabel.length == json.c) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                            chartsValue5 = chartsValue;
                            chartsValue = [];
                            data = [
                                ...data,
                                {
                                    y: chartsValue5,
                                    marker: chartsLabel5
                                }
                            ]
                            total = 0;
                            chartsValue5.forEach((value, index) => {
                                total = total + value;
                            })
                            let newTotalFormat = parseFloat(`${total}`).toFixed(3);
                            newTotalFormat = newTotalFormat.split(".");
                            newTotalFormat[0] = newTotalFormat[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            newTotalFormat = newTotalFormat.join(".")
                            totalData = [
                                ...totalData,
                                {
                                    y: total + 10,
                                    marker: `Total \n ${newTotalFormat}`
                                }
                            ]
                            chartsValue5 = [];
                            chartsLabel5 = [];
                        }
                        if (chartsLabel.length == json.c) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                        }
                    })
                }
                setLoading(false)
                setCharts({
                    data: {
                        barData: {
                            dataSets: [
                                {
                                    values: [...data],
                                    label: '',
                                    config: {
                                        colors: colors.slice(0, json.c),
                                        stackLabels: [...labelName],
                                        drawFilled: false,
                                        drawValues: false,
                                    },
                                }
                            ]
                        },
                        lineData: {
                            dataSets: [
                                {
                                    values: [...totalData],
                                    label: '',
                                    config: {
                                        drawVerticalHighlightIndicator: false,
                                        drawHorizontalHighlightIndicator: false,
                                        drawValues: false,
                                        lineWidth: 0,
                                        drawCircles: true,
                                        highlightColor: processColor('red'),
                                        color: processColor('transparent'),
                                        circleRadius: 3,
                                        drawFilled: false,
                                        fillColor: processColor('red'),
                                        fillAlpha: 60,
                                        valueTextSize: 15,
                                    }
                                },
                            ]
                        }
                    }
                })
            }
        } catch {
            setLoading(false);
            Alert.alert("Error", "Failed to get data");
            if (Platform.OS === 'android') {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            } else {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            }

        }
    }

    const loadFieldData = async () => {
        setLoading(true);
        // const { params } = props.navigation.state;
        const { params } = route;
        const body = {
            script_name: "api/v2/api_received_spu_field",
            data: {
                idpfunit: params.idpfunit
            }
        }

        try {
            const result = axios.post(`${url.https2}`, body, {
                timeout: 20000
            })
            const json = result.data
            if (json.status !== "0000") {
                setError(true);
                setLoading(false);
                return Alert.alert("Error", "Failed to get data")
            }
            else {
                let i = 1
                let data = [];
                let chartsValue = [];
                let chartsLabel = [];
                let chartsValue5 = [];
                let chartsLabel5 = [];
                let totalData = [];
                for (i; i <= 12; i++) {
                    let filtered = json.received_spu.filter((item) => item.mon == i)
                    filtered.forEach((item, index) => {
                        let newValue = parseFloat(`${item.avg_received_spu}`).toFixed(3)
                        newValue = newValue.split(".");
                        newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        newValue = newValue.join(".")
                        chartsValue = [...chartsValue, item.avg_received_spu]
                        chartsLabel = `${item.ownership} \n ${newValue}`
                        // if (chartsValue.length == 1 && chartsLabel.length == 1) {
                        chartsLabel5 = chartsLabel;
                        chartsLabel = [];
                        chartsValue5 = chartsValue;
                        chartsValue = [];
                        data = [
                            ...data,
                            {
                                y: chartsValue5,
                                marker: chartsLabel5
                            }
                        ]
                        total = 0;
                        chartsValue5.forEach((value, index) => {
                            total = total + value;
                        })
                        let newTotalFormat = parseFloat(`${total}`).toFixed(3);
                        newTotalFormat = newTotalFormat.split(".");
                        newTotalFormat[0] = newTotalFormat[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        newTotalFormat = newTotalFormat.join(".")
                        totalData = [
                            ...totalData,
                            {
                                y: total + 10,
                                marker: `Total \n ${newTotalFormat}`
                            }
                        ]
                        chartsValue5 = [];
                        chartsLabel5 = [];
                    })
                }
                setLoading(false);
                setCharts({
                    data: {
                        barData: {
                            dataSets: [
                                {
                                    values: [...data],
                                    label: '',
                                    config: {
                                        colors: [processColor('#5899DA')],
                                        // stackLabels: ['Asset 1', 'Asset 2', 'Asset 3', 'Asset 4', 'Asset 5', "BP"],
                                        drawFilled: false,
                                        drawValues: false,
                                    },
                                }
                            ]
                        },

                    }
                })
                setLegend({
                    enabled: false
                })
            }
        } catch {
            setLoading(false);
            Alert.alert("Error", "Failed to get data")
            if (Platform.OS === 'android') {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            } else {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            }
        }
    }

    const loadPEPData = async () => {
        setLoading(true);
        const body = {
            script_name: "api/v2/api_received_spu",
            data: {}
        }

        try {
            const result = await axios.post(`${url.https2}`, body, {
                timeout: 20000
            })
            let json = result.data;
            if (json.status !== "0000") {
                setLoading(false);
                return Alert.alert("Error", "Failed to get data")
            }
            else {
                let i = 1
                let data = [];
                let chartsValue = [];
                let chartsLabel = [];
                let chartsValue5 = [];
                let chartsLabel5 = [];
                let totalData = [];
                for (i; i <= 12; i++) {
                    let filtered = json.received_spu.filter((item) => item.mon == i)
                    filtered.forEach((item, index) => {
                        let newValue = parseFloat(`${item.avg_received_spu}`).toFixed(3)
                        newValue = newValue.split(".");
                        newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        newValue = newValue.join(".")
                        chartsValue = [...chartsValue, item.avg_received_spu]
                        chartsLabel = [...chartsLabel, `${item.ownership} \n ${newValue}`]
                        if (chartsValue.length == 6 && chartsLabel.length == 6) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                            chartsValue5 = chartsValue;
                            chartsValue = [];
                            data = [
                                ...data,
                                {
                                    y: chartsValue5,
                                    marker: chartsLabel5
                                }
                            ]
                            total = 0;
                            chartsValue5.forEach((value, index) => {
                                total = total + value;
                            })
                            let newTotalFormat = parseFloat(`${total}`).toFixed(3);
                            newTotalFormat = newTotalFormat.split(".");
                            newTotalFormat[0] = newTotalFormat[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            newTotalFormat = newTotalFormat.join(".")
                            totalData = [
                                ...totalData,
                                {
                                    y: total + 10,
                                    marker: `Total \n ${newTotalFormat}`
                                }
                            ]
                            chartsValue5 = [];
                            chartsLabel5 = [];
                        }
                        if (chartsLabel.length == 6) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                        }
                    })
                }
                setLoading(false);
                setCharts({
                    data: {
                        barData: {
                            dataSets: [
                                {
                                    values: [...data],
                                    label: '',
                                    config: {
                                        colors: [processColor('#ED4A7B'), processColor('#E8743B'), processColor('#5899DA'), processColor('#19A979'), processColor('#13A4B4'), processColor('#945ECF')],
                                        stackLabels: ['Asset 1', 'Asset 2', 'Asset 3', 'Asset 4', 'Asset 5', "BP"],
                                        drawFilled: false,
                                        drawValues: false,
                                    },
                                }
                            ]
                        },
                        lineData: {
                            dataSets: [
                                {
                                    values: [...totalData],
                                    label: '',
                                    config: {
                                        drawVerticalHighlightIndicator: false,
                                        drawHorizontalHighlightIndicator: false,
                                        drawValues: false,
                                        lineWidth: 0,
                                        drawCircles: true,
                                        highlightColor: processColor('red'),
                                        color: processColor('transparent'),
                                        circleRadius: 3,
                                        drawFilled: false,
                                        fillColor: processColor('red'),
                                        fillAlpha: 60,
                                        valueTextSize: 15,
                                    }
                                },
                            ]
                        }
                    }
                })
            }
        } catch (err) {
            setLoading(false);
            Alert.alert("Error", "Failed to get data");

            if (Platform.OS === 'android') {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            } else {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            }

        }
    }

    const loadBPData = async () => {
        setLoading(true);
        // const { params } = props.navigation.state;
        const { params } = route;
        console.log("From LoadBPData: " + params)
        const body = {
            script_name: "api/v2/api_received_spu_bp",
            data: {
                bp: params.selectedBP
            }
        }
        try {
            const result = await Axios.post(`${url.https2}`, body, {
                timeout: 20000
            })
            const json = result.data;
            if (json.status !== "0000") {
                setError(true);
                setLoading(false);
                return Alert.alert("Error", "Failed to get data")
            }
            else {
                let i = 1;
                let data = [];
                let chartsValue = [];
                let chartsLabel = [];
                let chartsValue5 = [];
                let chartsLabel5 = [];
                let totalData = [];
                let labelName = [];
                const colors = [
                    processColor('#ED4A7B'),
                    processColor('#E8743B'),
                    processColor('#5899DA'),
                    processColor('#19A979'),
                    processColor('#13A4B4'),
                    processColor('#BF399E'),
                    processColor('#6C8893'),
                    processColor('#EE6868'),
                    processColor('#2F6497'),
                    processColor('#945ECF'),
                    processColor('#dc0d0e'),
                    processColor('#f29b1d'),
                    processColor('#4cba6b'),
                    processColor('#cc4300'),
                    processColor('#848f94')
                ];
                for (i; i <= 12; i++) {
                    let filtered = json.received_spu.filter((item) => item.mon == i)
                    filtered.forEach((item, index) => {
                        let newValue = parseFloat(`${item.avg_received_spu}`).toFixed(3)
                        newValue = newValue.split(".");
                        newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        newValue = newValue.join(".")
                        chartsValue = [...chartsValue, item.avg_received_spu]
                        chartsLabel = [...chartsLabel, `${item.ownership} \n ${newValue}`]
                        labelName = [...labelName, `${item.ownership}`]
                        if (chartsValue.length == json.c && chartsLabel.length == json.c) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                            chartsValue5 = chartsValue;
                            chartsValue = [];
                            data = [
                                ...data,
                                {
                                    y: chartsValue5,
                                    marker: chartsLabel5
                                }
                            ]
                            total = 0;
                            chartsValue5.forEach((value, index) => {
                                total = total + value;
                            })
                            let newTotalFormat = parseFloat(`${total}`).toFixed(3);
                            newTotalFormat = newTotalFormat.split(".");
                            newTotalFormat[0] = newTotalFormat[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            newTotalFormat = newTotalFormat.join(".")
                            totalData = [
                                ...totalData,
                                {
                                    y: total + 10,
                                    marker: `Total \n ${newTotalFormat}`
                                }
                            ]
                            chartsValue5 = [];
                            chartsLabel5 = [];
                        }
                        if (chartsLabel.length == json.c) {
                            chartsLabel5 = chartsLabel;
                            chartsLabel = [];
                        }
                    })
                }

                setLoading(false);
                setCharts({
                    data: {
                        barData: {
                            dataSets: [
                                {
                                    values: [...data],
                                    label: '',
                                    config: {
                                        colors: colors.slice(0, json.c),
                                        stackLabels: [...labelName],
                                        drawFilled: false,
                                        drawValues: false,
                                    },
                                }
                            ]
                        },
                        lineData: {
                            dataSets: [
                                {
                                    values: [...totalData],
                                    label: '',
                                    config: {
                                        drawVerticalHighlightIndicator: false,
                                        drawHorizontalHighlightIndicator: false,
                                        drawValues: false,
                                        lineWidth: 0,
                                        drawCircles: true,
                                        highlightColor: processColor('red'),
                                        color: processColor('transparent'),
                                        circleRadius: 3,
                                        drawFilled: false,
                                        fillColor: processColor('red'),
                                        fillAlpha: 60,
                                        valueTextSize: 15,
                                    }
                                },
                            ]
                        }
                    }
                })
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Failed to get data");

            if (Platform.OS === 'android') {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            } else {
                Toast.showWithGravity("Please check your internet connections", Toast.LONG, Toast.BOTTOM);
            }

        }
    }


    if (loading) {
        return (
            <View style={globalStyles.centerContainer}>
                <ActivityIndicator size="large" color="red" />
            </View>
        )
    }
    if (error) {
        <View style={globalStyles.centerContainer}>
            <Text>Error</Text>
        </View>
    }
    return (
        <View style={styles.container}>
            <BarChart
                extraOffset={{ bottom: 150 }}
                style={styles.chart}
                xAxis={xAxis}
                yAxis={yAxis}
                data={charts.data}
                legend={legend}
                yAxisRight={{ enabled: false }}
                drawValueAboveBar={false}
                chartDescription={{ text: '' }}
                pinchZoom={false}
                doubleTapToZoomEnabled={false}
                marker={{
                    enabled: true,
                    markerColor: processColor('grey'),
                    textColor: processColor('white'),
                    markerFontSize: 14,
                    digits: 5,
                }}
                onSelect={handleSelect}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    chart: {
        flex: 1
    }
})