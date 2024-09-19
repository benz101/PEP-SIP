import React, { PureComponent, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList
} from 'react-native';
import globalStyles from '../global/styles';

export default function DetailApproval({ route}) {

  const [detailList, setDetailList] = useState([]);

  useEffect(() => {
   getDetailList();
  }, [])

  const getDetailList = () => {
    setDetailList(route.params);
  }


  const renderItem = ({ item }) => {
    const prodFloat = parseFloat(item.prod)
    const fixProd = prodFloat.toFixed(3)
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 0.7, borderColor: '#e1e8ee', }}>
        <View style={{ paddingHorizontal: '2%', width: '50%', borderRightWidth: 0.7, borderColor: '#e1e8ee', justifyContent: 'center' }}>
          <Text style={{ color: '#222', fontSize: 11 }}>{item.name}</Text>
        </View>
        <View style={{ paddingHorizontal: '2%', width: '30%', paddingVertical: 5, flexShrink: 1, }}>
          <Text style={{ color: '#222', fontSize: 11 }} >{item.status}</Text>
        </View>
        <View style={{ paddingHorizontal: '2%', width: '20%', borderLeftWidth: 0.7, borderColor: '#e1e8ee', paddingVertical: 5, flexShrink: 1, }}>
          <Text style={{ color: '#222', fontSize: 11 }} >{fixProd}</Text>
        </View>
      </View>
    )
  }

  const renderFooter = () => {

    const { params } = route;
    const total = params.reduce((total, item) => total + item.prod, 0)
    const totalFloat = parseFloat(total)
    const total_prod = totalFloat.toFixed(3)
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 0.7, borderColor: '#e1e8ee', }}>
        <View style={{ paddingHorizontal: '2%', width: '80%', borderColor: '#e1e8ee', justifyContent: 'center' }}>
          <Text style={{ color: '#222', fontSize: 11, textAlign: 'center' }}>Total</Text>
        </View>
        <View style={{ paddingHorizontal: '2%', width: '20%', borderLeftWidth: 0.7, borderColor: '#e1e8ee', paddingVertical: 5, flexShrink: 1, }}>
          <Text style={{ color: '#222', fontSize: 11 }} >{total_prod}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
          data={detailList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.name + index }
          extraData={props}
          ListHeaderComponent={() => (
            <View style={{ flexDirection: 'row', borderBottomWidth: 0.7, borderColor: '#e1e8ee', backgroundColor: 'rgb(237, 237, 237)' }}>
              <View style={{ width:'50%', borderRightWidth: 0.7, borderColor: '#e1e8ee', justifyContent: 'center' }}>
                <Text style={{ color: '#222', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Name</Text>
              </View>
              <View style={{ width: '30%', paddingVertical: 5, flexShrink: 1, }}>
                <Text style={{ color: '#222', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }} >Status</Text>
              </View>
              <View style={{ width: '20%', borderLeftWidth: 0.7,borderColor: '#e1e8ee', paddingVertical: 5, flexShrink: 1, }}>
                <Text style={{ color: '#222', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }} >Prod</Text>
              </View>
            </View>
          )}
          ListFooterComponent={renderFooter}
        />
    </View>
  )
}