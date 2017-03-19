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
  Platform
} from 'react-native';

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

export default class SuperMarketApp extends Component {

  constructor(){
    super();
    this.state = {
      isSwitchOn:false
    }
}

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>
          ARE YOU AVALIABLE?
        </Text>

        <Switch
          onValueChange={(value) => this.setState({isSwitchOn: value})}
          //onValueChange= {Alert.alert( "value is: " + this.state.isSwitchOn )}
          value= {this.state.isSwitchOn}
         />

        <Text style={styles.text}>Hello World</Text>

        <Button
            onPress={onButtonPress}
            title="Press Here!"
            color="#841584"
            disabled={!this.state.isSwitchOn}
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
    }
});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
