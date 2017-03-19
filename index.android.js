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
  Alert
} from 'react-native';
//import Call from './components/Call.js';

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

export default class SuperMarketApp extends Component {

  render() {
    return (
      <View style={styles.view}>

        <Text style={styles.text}>Hello World</Text>

        <Button
            onPress={onButtonPress}
            title="Press Here!"
            color="#841584"
            disabled={true}
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
        fontSize: 100,
        color: 'red'
    }
});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
