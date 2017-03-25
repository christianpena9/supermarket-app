/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
  Switch,
  Platform,
  TextInput
} from 'react-native';
import "./UserAgent";
import io from "socket.io-client/dist/socket.io";

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

export default class SuperMarketApp extends Component {
  constructor(){
    super();
    this.socket = io('http://localhost:3000', {jsonp: false})
    this.state = {
      isSwitchOn:false,
      text: null
    }
}

  handleChange(event){
    this.setState({
      text: event.nativeEvent.text
    });
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>
          ARE YOU AVALIABLE?
        </Text>

        <Switch
          onValueChange={(value) => this.setState({isSwitchOn: value})}
          value= {this.state.isSwitchOn}
         />

        <Button
            onPress={onButtonPress}
            title="Call!"
            color="#841585"
            disabled={!this.state.isSwitchOn}
        />

        <TextInput
          style={styles.input}
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    text: {
        fontSize: 50,
        color: 'red'
    },
    button: {
        width: 500,
        height: 500
    },
    input:{
      width: 600,
      fontSize: 50,
      color: 'yellow'
    }


});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
