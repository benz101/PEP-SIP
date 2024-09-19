import React, { PureComponent } from 'react';
import {
  View,
  Text
} from "react-native";

export default class CustomeDatePicker extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      title: props.title
    }
  }

  render(){
    return(
      <View style={{ paddingHorizontal: 15, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }} >
        <Text style={{ color: 'black', }} >{this.state.title} {this.props.date}</Text>
        <Text style={{ color: 'blue', textDecorationLine: 'underline', }} onPress={this.props.onChangeDate} >Change Date </Text>
      </View>
    )

  }
}