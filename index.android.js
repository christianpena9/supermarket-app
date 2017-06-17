import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
  Image,
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

const videoStream = {};

export default class HomeScreen extends Component {
  constructor() {
    super();
    //has to listen to localhost but with actual IP Address
    // Jimmy IP address 192.168.0.3
    // Christian IP address 172.28.45.126

    this.socket = io('http://192.168.0.21:3000', {jsonp: false});
    this.state = {
      isSwitchOn: false,
      backColor: "rgb(245,245,245)",
      callPage: false,
      videoURL : null,
      answerCallButton: true,
      endCallButton: false,
      videoURL2 : null
    }

    //--------------------INCOMING DATA---------------------------
    this.socket.on('isSwitchOn-server', (data) => {
      console.log("incoming data from server switch-stat =>", data);
      this.setState({ isSwitchOn: data });
    });

    this.socket.on("calling-server", (data)=> {
      console.log("incoming data from server to update callPage =>", data);
      this.setState({ callPage: data });
    });

    this.socket.on("hangUpClient-server", (data)=> {
      console.log("incoming data from server to update callPage =>", data);
      this.setState({
        videoURL: null,
        callPage: data,
        answerCallButton: true,
        endCallButton: false
      });
    });

    this.socket.on('videoURL2-server', (data) =>{
      console.log("incoming data from server videoURL2-server => ", data);
      this.setState({ videoURL2: data });
    });

    // --------------------------OUTGOING DATA------------------------
    this.socket.emit('isSwitchOn-client', this.state.isSwitchOn);
  }


  //---------------------------RTC REQUIREMENTS---------------------------
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

    var successCallback = (stream) => {
      if (videoStream.run === undefined) {
        this.setState({
          videoURL : stream.toURL(),
          answerCallButton:!this.state.answerCallButton,
          endCallButton: !this.state.endCallButton
        });
        videoStream = stream;
        videoStream.run = true;
        this.socket.emit('videoURL-client', this.state.videoURL);
      }
      else{
        this.setState({
          videoURL : videoStream.toURL(),
          answerCallButton:!this.state.answerCallButton,
          endCallButton: !this.state.endCallButton
        });
        this.socket.emit('videoURL-client', this.state.videoURL);
      }
    }

    var errorCallback = (error) => {
      console.log("Oooops we got an error!", error.message);
      throw error;
    }

    getUserMedia(constraints, successCallback, errorCallback);
  }
  // end of startCall


  //-----------------------FUNCTIONS-----------------------------
  componentDidUpdate(){
    console.log(
      "is switch on = ", this.state.isSwitchOn,
      "call page is = ", this.state.callPage,
      "videoURL is  = ", this.state.videoURL,
      "answer call button is  = ", this.state.answerCallButton,
      "end call button is  = ", this.state.endCallButton
    );
  }

  hangUp() {
    this.setState({
      videoURL: null,
      callPage: false,
      answerCallButton: true,
      endCallButton: false
    });
    this.socket.emit('hangUpHome-client', false);
  }

  updateSwitch = (value) => {
    console.log("running updateSwitch function");
    this.setState({isSwitchOn: value});
    this.socket.emit('isSwitchOn-client', value);
  }

  render() {
    const { navigate } = this.props.navigation;

    // Updates messaging for Receiver
    let available;
    (this.state.isSwitchOn) ? available = 'ARE' : available = 'ARE NOT';

    // variables to store TouchableOpacity component
    let answerCall  = null;
    let declineCall = null;
    let endCall     = null;

    // checking the status, if true then take TouchableOpacity
    // and save it to the variable
    if(this.state.answerCallButton) {
      answerCall =
      <TouchableOpacity style={styles.answerCall} onPress = { () => this.startCall() } >
        <Text style={styles.butText}>Answer</Text>
      </TouchableOpacity>;
      declineCall =
      <TouchableOpacity style={styles.declineCall} onPress={ () => this.setState({callPage: false}) }>
        <Text style={styles.butText}>Decline</Text>
      </TouchableOpacity>;
    }if(this.state.endCallButton) {
      endCall =
      <TouchableOpacity style={styles.endCall} onPress={ () => this.hangUp() }>
        <Text style={styles.butText}>End</Text>
      </TouchableOpacity>;
    }

    // -------------------MAIN PAGE-----------------------
    if (!this.state.callPage) {
      callPage =
      <View style={{flex: 1, justifyContent: 'center', width: window.width, alignItems: 'center', backgroundColor: this.state.backColor}}>

        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('./styles/fine_fare_logo.png')}
          />
        </View>

        <View style={styles.center}>
          <Text style={styles.text}>
            YOU { available } AVALIABLE
          </Text>

          <Switch
            style={styles.switch}
            onValueChange={this.updateSwitch}
            value={this.state.isSwitchOn}
           />

          <TouchableOpacity
            onPress = {() => navigate('ClientScreen', { isSwitchOn: this.state.isSwitchOn })}
            style = {styles.touch}>
            <Text style={styles.sendText}>Client</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    }else {
      // -----------------CALL PAGE------------------------
      callPage =
      <View style={styles.container}>
        <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/>
        <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
        {answerCall}
        {endCall}
        {declineCall}
      </View>
    }

    return (
      // did inline styling to test incoming socket data
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: this.state.backColor}}>

        {callPage}

      </View>
    );
  }
} // end of HomeScreen

/* -------------------CUSTOM ROUTE BELOW-------------------- */
const SuperMarketApp = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
        header: null
    },
  },
  ClientScreen: {
    screen: ClientScreen,
    navigationOptions: {
        header: null
    },
  },
  ReceiverScreen: {
    screen: ReceiverScreen,
    navigationOptions: {
        header: null
     },
    },
});

AppRegistry.registerComponent('SuperMarketApp', () => SuperMarketApp);
