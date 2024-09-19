import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  InteractionManager,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import globalStyles from '../global/styles';
import styles from './style';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider, normalize } from 'react-native-elements';
import { height } from '../../assets/constants/config';
import Fuzzyset from 'fuzzyset.js';
import Loader from '../../assets/elements/Loader';
import { useSelector } from 'react-redux';

export default function SPVDataEntry({ route }) {
  const [ready, setReady] = useState(false);
  const [labelArray, setLabelArray] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const spvResult = useSelector((state) => state.spv.params);

  useEffect(() => {
    // StatusBar.setBarStyle('light-content');
    // StatusBar.setBackgroundColor('white');
    InteractionManager.runAfterInteractions(() => setReady(true));
    getTableArray();
    // console.log(spvResult);
  }, [])

  const getTableArray = () => {
    let tableArray = [];
    spvResult.data.result.forEach((result) => {
      result.tabledef.columns.forEach((column) => {
        tableArray = [
          ...tableArray,
          column.label
        ]
      })
      setLabelArray(tableArray);
    })
  }

  const renderItem = ({ item }) => {
    const fuzzy = Fuzzyset(labelArray);
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
      <View style={{ marginVertical: height * 0.025, elevation: 7, borderWidth: 0.4, borderColor: '#e1e8ee', marginHorizontal: '1.5%' }} >
        {newArray.map((obj, index) => {
          const fix = fuzzy.get(obj)
          const textAlign = !isNaN(item[obj]) ? "left" : "left"
          const backgroundColor = index % 2 == 0 ? '#cccccc' : 'white'
          if (obj == 'periodtime') {
            return null
          }
          if (obj == 'period' || obj == 'item') {
            return (
              <View key={index} style={[styles.rowListDataEntry, { backgroundColor }]}>
                <View style={styles.dataEntryContainer}>
                  <Text style={styles.dataEntryText} >{fix[0][1] ? fix[0][1] : obj}</Text>
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
                  <Text style={styles.dataEntryText} >{fix[0][1] ? fix[0][1] : obj}</Text>
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
        <Divider style={{ backgroundColor: '#CCCCCC', marginVertical: height * 0.01 }} />
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

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  if (!ready) {
    return <Loader visible={!ready} />
  }
  // const { params } = route;
  // console.log("Params: " + params);
  return (
    <View style={globalStyles.container}>
      <ScrollView style={{height: '100%'}}>
        <Accordion
          activeSections={activeSections}
          sections={spvResult.data.result}
          renderHeader={renderHeader}
          renderContent={renderContent}
          touchableComponent={TouchableOpacity}
          onChange={_updateSections}
        />
      </ScrollView>
    </View>

  )
}