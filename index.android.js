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
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';
import { StackNavigator } from 'react-navigation';
import "./UserAgent";
import io from "socket.io-client/dist/socket.io";

/* CUSTOM IMPORT SCREENS BELOW */
import ReceiverScreen from './screens/ReceiverScreen';
import ClientScreen from './screens/ClientScreen';

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from './styles/mainStyle';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');


export default class HomeScreen extends Component {
  startCall() {

      const constraints = {
          audio: true,
          video: {
              mandatory: {
                  width: 0,
                  height: 0,
                  minFrameRate: 30
              }
          }
      };

      var successCallback = () => {
          this.setState({
              videoURL : "hello videoURL"
          });
          console.log(stream.toURL());
      }

      var errorCallback = (error) => {
          console.log("Oooops we got an error!", error.message);
          throw error;
      }

      getUserMedia(constraints, successCallback, errorCallback);

  } // end of startCall
    constructor() {
        super();
        //has to listen to localhost but with actual IP Address
        // Jimmy IP address 192.168.0.3
        // Christian IP address 172.28.45.126
        this.socket = io('http://192.168.0.21:3000', {jsonp: false});
        this.state = {
          isSwitchOn: false,
          text: "enter color",
          incomingText: null,
          backColor: "rgb(245,245,245)",
          callPage: false,
          homePage: true,
          videoURL : null,
          status: true,
          endCallStatus: true
        }

        //INCOMING DATA

        this.socket.on('isSwitchOn-server', (data) => {
          console.log(data);
          this.setState({ isSwitchOn: data });
        });

        this.socket.on("calling-server", (data)=> {
            console.log(data);
            this.setState({ homePage: data });
        });


        // OUTGOING DATA
        this.socket.emit('isSwitchOn-client', this.state.isSwitchOn);
    }



    //RTC REQUIREMENTS
    toggleStatus() {
      this.setState({
        status:!this.state.status, endCallStatus: false
      });
      this.startCall();
  }



  hangUp() {
    this.setState({videoURL:null});
    this.setState({status:true});
    this.setState({endCallStatus:true});
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
      console.log(this);
      console.log(this.props.navigation);
        // variables to store TouchableOpacity component
        let answerCall  = null;
        let declineCall = null;
        let endCall     = null;

        // checking the status, if true then take TouchableOpacity
      // and save it to the variable
      if(this.state.status) {
          answerCall =
            <TouchableOpacity style={styles.answerCall} onPress = { () => this.toggleStatus() } >
                <Text style={styles.butText}>Answer</Text>
            </TouchableOpacity>;
          declineCall =
            <TouchableOpacity style={styles.declineCall} onPress={ () => this.setState({homePage: true}) }>
                <Text style={styles.butText}>Decline</Text>
            </TouchableOpacity>;
      }

      if(!this.state.endCallStatus) {
          endCall =
          <TouchableOpacity style={styles.endCall} onPress={ () => this.hangUp() }>
              <Text style={styles.butText}>End</Text>
          </TouchableOpacity>;
      }

        const { navigate } = this.props.navigation;
        let available;

        // Updates messaging for Receiver
        (this.state.isSwitchOn) ? available = 'ARE' : available = 'NOT';

        if (this.state.homePage) {
          homePage =
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

          </View>
        } else {
          homePage =
          <View style={styles.container}>
            <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/>
            <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
            {endCall}
            {answerCall}
            {declineCall}
          </View>
        }

        if (this.state.callPage) {
          callPage =
          <View style={styles.container}>
            <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/>
            <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
            {endCall}
            {answerCall}
            {declineCall}
          </View>

        }
        return (
            // did inline styling to test incoming socket data
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: this.state.backColor}}>

              {homePage}
            </View>
        );
    }
}

/* CUSTOM ROUTE BELOW */
const SuperMarketApp = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    ClientScreen: {
        screen: ClientScreen
    },
    ReceiverScreen: {
        screen: ReceiverScreen
    }
});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
