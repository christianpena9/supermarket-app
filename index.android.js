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
  TextInput,
  TouchableOpacity
} from 'react-native';
import "./UserAgent";
import io from "socket.io-client/dist/socket.io";

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

export default class SuperMarketApp extends Component {
  constructor(){
    super();
    //has to listen to localhost but with actual IP Address
    this.socket = io('http://192.168.0.6:3000', {jsonp: false});
    this.state = {
      isSwitchOn:false,
      text: "enter color",
      incomingText: "waiting",
      backColor: "pink"
    }
    console.log(this.socket);

    //data comes back and you can use it for anything
    this.socket.on("server-send", (data)=> {
      this.setState({ backColor: data });
      this.setState({ incomingText: data });
    });
  }

  handleChange(event){
    this.setState({
      text: event.nativeEvent.text
    });
  }

  sendMe(){
    this.socket.emit("client-send", this.state.text);
  }

  render() {
    return (
      // did inline styling to test incoming socket data
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',
backgroundColor: this.state.backColor}}>

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
          // onChangeText={(text)=> this.setState({text})}
          onChange={this.handleChange.bind(this)}
        />

        <TouchableOpacity
          onPress={()=> {this.sendMe()}}
          style={styles.touch}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>

        <Text style={styles.text}>
          ServerSaid--->{this.state.incomingText}
        </Text>
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
    sendText: {
      textAlign: "center",
      fontSize: 25,
      color: "white"
    },
    button: {
        width: 500,
        height: 500
    },
    input:{
      width: 400,
      fontSize: 50,
      color: 'yellow'
    },
    touch:{
      width: 100,
      height: 50,
      borderColor: "white",
      borderWidth: 3,
      backgroundColor: "rgb(0,165,255)"
    }


});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
