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
import { StackNavigator } from 'react-navigation';
import "./UserAgent";
import io from "socket.io-client/dist/socket.io";

/* CUSTOM IMPORT SCREENS BELOW */
import ReceiverScreen from './screens/ReceiverScreen';
import ClientScreen from './screens/ClientScreen';

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from './styles/mainStyle';

export default class HomeScreen extends Component {
    constructor() {
        super();
        //has to listen to localhost but with actual IP Address
        this.socket = io('http://172.28.45.126:3000', {jsonp: false});
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

    handleChange(event) {
        this.setState({
            text: event.nativeEvent.text
        });
    }

    sendMe() {
        this.socket.emit("client-send", this.state.text);
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            // did inline styling to test incoming socket data
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',
backgroundColor: this.state.backColor}}>

                <Text style={styles.text}>
                    ARE YOU AVALIABLE?
                </Text>

                <TouchableOpacity
                    onPress = {() => navigate('ReceiverScreen')}
                    style = {styles.touch}>
                    <Text style={styles.sendText}>Receiver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress = {() => navigate('ClientScreen', { isSwitchOn: this.state.isSwitchOn })}
                    style = {styles.touch}>
                    <Text style={styles.sendText}>Client</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={this.state.text}
                    // onChangeText={(text)=> this.setState({text})}
                    onChange={this.handleChange.bind(this)}
                />

                <TouchableOpacity
                    onPress = {() => {this.sendMe()}}
                    style = {styles.touch}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>

                <Text style={styles.text}>
                    ServerSaid--->{this.state.incomingText}
                </Text>
            </View>
        );
    }
}

/* CUSTOM ROUTE BELOW */
const SuperMarketApp = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Welcome',
            header: {
                visible: false
            }
        }
    },
    ClientScreen: {
        screen: ClientScreen,
        navigationOptions: {
            title: 'Client Screen',
            header: {
                visible: false
            }
        }
    },
    ReceiverScreen: {
        screen: ReceiverScreen,
        navigationOptions: {
            title: 'Receiver Screen',
            header: {
                visible: false
            }
        }
    }
});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
