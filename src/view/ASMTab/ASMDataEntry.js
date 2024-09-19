import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  InteractionManager,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import globalStyles from '../global/styles';
import styles from './style';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider, normalize } from 'react-native-elements';
import Loader from '../../assets/elements/Loader';
import { useSelector } from 'react-redux';

export default function ASMDataEntry() {
  const [ready, setReady] = useState(false);
  const asmResult = useSelector((state) => state.asm.params);

  useEffect(() => {
    // StatusBar.setBarStyle('light-content');
    // StatusBar.setBackgroundColor('white');
    InteractionManager.runAfterInteractions(() => setReady(true));
  }, [])


  const renderItem = ({ item }) => {
    const objKeys = Object.keys(item);
    let newArray = [];
    objKeys.forEach((obj) => {
      if (obj == 'periodtime') {
        return false
      }
      if (obj == 'period' || obj == 'item') {
        return false
      }
      newArray = [
        ...newArray,
        obj
      ]
    })
    newArray.unshift("item", "period")
    return (
      <View style={styles.contentContainer} >
        {newArray.map((obj, index) => {
          const textAlign = !isNaN(item[obj]) ? "left" : "left"
          const backgroundColor = index % 2 == 0 ? '#cccccc' : 'white'
          if (obj == 'periodtime') {
            return null
          }
          if (obj == 'period' || obj == 'item') {
            return (
              <View key={index} style={[styles.rowListDataEntry, { backgroundColor }]}>
                <View style={styles.dataEntryContainer}>
                  <Text style={styles.dataEntryText} >{obj}</Text>
                </View>
                <View style={styles.dataEntryContainer}>
                  <Text style={styles.dataEntryText} >{item[obj]}</Text>
                </View>
              </View>
            )
          }
          if (obj !== 'period' || obj !== 'item') {
            return (
              <View key={index} style={[styles.rowListDataEntry, { backgroundColor }]}>
                <View style={styles.dataEntryContainer}>
                  <Text style={styles.dataEntryText} >{obj}</Text>
                </View>
                <View style={styles.dataEntryContainer}>
                  <Text style={styles.dataEntryText} >{item[obj]}</Text>
                </View>
              </View>
            )
          }
        })}
      </View>
    )
  }

  const renderHeader = (section) => {
    return (
      <View style={{ padding: '2%', }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontWeight: '700' }} >{section.tabledef.tableTitle}</Text>
          <Icon name="ios-arrow-down" size={normalize(24)} />
        </View>
        <Divider style={styles.divider} />
      </View>
    )
  }

  const renderContent = (section) => {
    return (
      <FlatList
        data={section.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  if (!ready) {
    return <Loader visible={!ready} />
  }
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={globalStyles.container}>
        <Accordion
          activeSections={activeSections}
          sections={asmResult.data.result}
          renderHeader={renderHeader}
          renderContent={renderContent}
          touchableComponent={TouchableOpacity}
          onChange={_updateSections}
        />
      </View>
    </ScrollView>
  )

}
