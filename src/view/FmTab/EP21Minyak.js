import React, { useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';

const width = Dimensions.get('window').width;

export default function EP21Minyak () {

    const fmResult = useSelector((state) => state.fm.params);

    // useEffect(() => {
        // StatusBar.setBarStyle('light-content');
        // StatusBar.setBackgroundColor('white');
    // }, [])


    const renderItem = ({ item }) => {

        const newValue = parseFloat(item.value).toFixed(3)

        return (
            <View style={styles.container}>
                <View style={styles.dataContainer}>
                    <Text style={{ flexShrink: 1 }}>{item.remark}</Text>
                    <TextInput
                        value={newValue}
                        style={styles.input}
                        editable={false}
                        underlineColorAndroid="transparent"
                    />
                </View>
            </View>
        )
    }


        return (
            <View style={styles.container}>
                <FlatList
                    data={fmResult.result.EP21}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() =>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Not Found</Text>
                        </View>
                    }
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
    dataContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        color: 'grey',
        borderWidth: 1,
        borderRadius: 2,
        width: width / 3,
        textAlign: 'right',
        borderColor: '#c1c1c1'
    }
})