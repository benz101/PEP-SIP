import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

export default function SVPNoCommited({ route }) {
    const renderItem = ({ item, index }) => {
        const backgroundColor = index % 2 == 0 ? 'white' : '#cccccc'
        return (
            <View style={{ flexDirection: 'row', backgroundColor }}>
                <View style={{ width: '10%', borderRightWidth: 0.7, borderColor: '#e1e8ee', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#222' }}>{index + 1}</Text>
                </View>
                <View style={{ paddingHorizontal: '2%', paddingVertical: 10, flexShrink: 1, }}>
                    <Text style={{ color: '#222' }} >{item[0]}</Text>
                </View>
            </View>
        )
    }
    const thisData = route.params.data;

    return (
        <View style={styles.container}>
            {
                data.notcommittted.length > 0 ?
                    <FlatList
                        // extraData={props}
                        data={thisData.notcommittted}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: '#cccccc' }} />}
                        keyExtractor={(item, index) => item[0].toString()}
                        ListHeaderComponent={() => {
                            return (
                                <View style={{ flexDirection: 'row', backgroundColor: '#CCCCCC', borderColor: '#e1e8ee', borderBottomWidth: 1 }}>
                                    <View style={{ width: '10%', borderRightWidth: 0.7, borderColor: '#e1e8ee', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#222', fontWeight: 'bold' }}>No</Text>
                                    </View>
                                    <View style={{ paddingHorizontal: '2%', paddingVertical: 10, flex: 1, alignItems: 'center' }}>
                                        <Text style={{ color: '#222', textAlign: 'center', fontWeight: 'bold' }} >Entry</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Not Found</Text>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        padding: '2%'
    }
})