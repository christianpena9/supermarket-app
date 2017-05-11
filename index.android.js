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
        // Jimmy IP address 192.168.0.3
        // Christian IP address 172.28.45.126
        this.socket = io('http://192.168.0.3:3000', {jsonp: false});
        this.state = {
            isSwitchOn: false,
            text: "enter color",
            incomingText: null,
            backColor: "rgb(245,245,245)"
        }

        //INCOMING DATA
        this.socket.on("server-send", (data)=> {
            this.setState({ incomingText: data });
        });

        this.socket.on('isSwitchOn-server', (data) => {
          this.setState({ isSwitchOn: data });
        });

        this.socket.on("on-off", (data) =>{
          this.setState({isSwitchOn: data});
          this.setState({ incomingText: data });
        });


        // OUTGOING DATA
        this.socket.emit('isSwitchOn-client', this.state.isSwitchOn);
    }


    //FUNCTIONS
    handleChange(event) {
        this.setState({
            text: event.nativeEvent.text
        },this.sendMe);
    }

    checkSwitch() {
      this.socket.emit("switch-stat", this.state.isSwitchOn)
    }

    updateSwitch = (value) => {
        this.setState({isSwitchOn: value});
        this.socket.emit('isSwitchOn-client', value);
    }

    sendMe() {
        this.socket.emit("client-send", this.state.text);
    }

    render() {
        const { navigate } = this.props.navigation;
        let available;

        // Updates messaging for Receiver
        (this.state.isSwitchOn) ? available = 'ARE' : available = 'NOT';

        return (
            // did inline styling to test incoming socket data
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',
                          backgroundColor: this.state.backColor}}>

                <Text style={styles.text}>
                  YOU { available } AVALIABLE
                </Text>

                <Switch
                  onValueChange={this.updateSwitch}
                  value={this.state.isSwitchOn}
                 />


                <TouchableOpacity
                    onPress = {() => navigate('ClientScreen', { isSwitchOn: this.state.isSwitchOn })}
                    style = {styles.touch}>
                    <Text style={styles.sendText}>Client</Text>
                </TouchableOpacity>

                {/* <TextInput
                    style={styles.input}
                    value={this.state.text}
                    //onChangeText={(text)=> this.setState({text})}
                    onChange={this.handleChange.bind(this)}
                /> */}

                {/* <TouchableOpacity
                    onPress = {() => {this.sendMe()}}
                    style = {styles.touch}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>

                <Text style={styles.text}>
                    ServerSaid--->{this.state.incomingText}
                </Text> */}
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
