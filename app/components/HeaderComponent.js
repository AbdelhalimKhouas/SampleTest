import React, { Component } from "react";
import {Header, Left, Right, Body, View} from "native-base";
import {Text, StatusBar } from "react-native";

export default class HeaderComponent extends Component {
  render() {
    return (
      <View>
        <Header style={{backgroundColor:'#FFFFFF'}}>
          <Body style={{alignItems:'center' }}>
            <Text>{this.props.screenTitle}</Text>
          </Body>
          
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#08d4fc" />
      </View>
    );
  }
}
