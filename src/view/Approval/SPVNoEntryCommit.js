import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { Divider } from 'react-native-elements';
import { useSelector } from 'react-redux';


export default function SPVNoEntryCommit({ route }) {
    // const [data] = useState(route.params);
    const [checked] = useState(false);
    const spvResult = useSelector((state) => state.spv.params);

    const renderItem = ({ item, index }) => {
        const backgroundColor = index % 2 == 0 ? 'white' : '#cccccc'
        return (
            <View style={{ flexDirection: 'row', backgroundColor }}>
                <View style={{ width: '10%', borderRightWidth: 0.7, borderColor: '#e1e8ee', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#222' }}>{index + 1}</Text>
                </View>
                <View style={{ paddingHorizontal: '2%', paddingVertical: 10, flexShrink: 1, }}>
                    <Text style={{ color: '#222' }} >{item[1]}</Text>
                </View>
            </View>
        )
    }
    
    const thisData = spvResult.data;
    return (
        <View style={styles.container}>
            {
                thisData.noentrylist.length > 0 ?
                    <FlatList
                        // extraData={props}
                        data={thisData.noentrylist}
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