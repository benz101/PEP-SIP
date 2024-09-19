import React, { PureComponent } from 'react';
import {View, Dimensions, Text, Image} from "react-native";
import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";
import styles from './style';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class CustomListView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2
            }).cloneWithRows(this.props.data)
        }
        this.renderRow = this.renderRow.bind(this)
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.dataProvider.getDataForIndex(i)
        }, (type, dim) => {
            // console.log("TCL => constructor => type ", type)
            dim.width = SCREEN_WIDTH;
            dim.height = HEIGHT_SCREEN;
        })
    }

    renderRow(type, data) {
        const objKeys = Object.keys(data);
        let newArray = [];
        objKeys.forEach((obj) => {
          if(obj == 'periodtime'){
            return false
          }
          if(obj == 'period' || obj == 'item'){
            return false
          }
          newArray = [
            ...newArray,
            obj
          ]
        })
        newArray.unshift("item", "period")
        return(
          <View style={styles.contentContainer} >
            {newArray.map((obj, index) => {
            //   const textAlign = !isNaN(item[obj]) ? "left" : "left"
              const backgroundColor = index % 2 == 0 ? '#cccccc' : 'white'
              if(obj == 'periodtime'){
                return null
              }
              if(obj == 'period' || obj == 'item'){
                return (
                  <View key={index} style={[styles.rowListDataEntry, { backgroundColor }]}>
                    <View style={styles.dataEntryContainer}>
                      <Text style={styles.dataEntryText} >{obj}</Text>
                    </View>
                    <View style={styles.dataEntryContainer}>
                      <Text style={styles.dataEntryText} >{data[obj]}</Text>
                    </View>
                  </View>              
                )
              }
              if(obj !== 'period' || obj !== 'item'){
                return (
                  <View key={index} style={[styles.rowListDataEntry, { backgroundColor }]}>
                    <View style={styles.dataEntryContainer}>
                      <Text style={styles.dataEntryText} >{obj}</Text>
                    </View>
                    <View style={styles.dataEntryContainer}>
                      <Text style={styles.dataEntryText} >{data[obj]}</Text>
                    </View>
                  </View>              
                )
              }
            })}
          </View>
        )        
    }

    render() {
      console.log("TCL => render => this.state.dataProvider " , this.state.dataProvider.getDataForIndex)
      return (
            <View style={{ flex:1 , minWidth: 1, minHeight: 1 }}>
                <RecyclerListView
                    style={{ flex: 1 }}
                    rowRenderer={this.renderRow}
                    forceNonDeterministicRendering={true}
                    dataProvider={this.state.dataProvider}
                    layoutProvider={this.layoutProvider}
                />
            </View>
        )
    }
}