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

var videoStream = {};

export default class HomeScreen extends Component {
  constructor() {
    super();
    //has to listen to localhost but with actual IP Address
    // Jimmy IP address 192.168.0.3
    // Christian IP address 172.28.45.126
    this.socket = io('http://192.168.23.217:3000', {jsonp: false});
    this.state = {
      isSwitchOn: false,
      backColor: "rgb(245,245,245)",
      homePage: true,
      videoURL : null,
      status: true,
      endCallButton: false
    }

    //INCOMING DATA
    this.socket.on('isSwitchOn-server', (data) => {
      console.log("incoming data from server switch-stat =>", data);
      this.setState({ isSwitchOn: data });
    });

    this.socket.on("calling-server", (data)=> {
      console.log("incoming data from server to update homePage =>", data);
      this.setState({ homePage: data });
    });


    // OUTGOING DATA
    this.socket.emit('isSwitchOn-client', this.state.isSwitchOn);
  }


  //RTC REQUIREMENTS
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
          status:!this.state.status,
          endCallStatus: false
        });
        videoStream = stream;
        videoStream.run = true;

        console.log("1st if stat/ new URL is = ", this.state.videoURL);
        console.log(stream.toURL);
        console.log(stream.run);
      }
      else{
        this.setState({
          videoURL : videoStream.toURL(),
          status:!this.state.status,
          endCallStatus: false
        });
        console.log("else stat/ new URL is = ", this.state.videoURL);
        console.log(videoStream.toURL);
        console.log(videoStream.run);
      }
    }

    var errorCallback = (error) => {
      console.log("Oooops we got an error!", error.message);
      throw error;
    }

    getUserMedia(constraints, successCallback, errorCallback);
  }
  // end of startCall



  //FUNCTIONS
  componentDidMount(){
    console.log(
      "is switch on = ", this.state.isSwitchOn,
      "home page is = ", this.state.homePage,
      "videoURL is  = ", this.state.videoURL,
      "status is  = ", this.state.status,
      "end call button is  = ", this.state.endCallButton
    );
  }

  // Function to disabled the call
  hangUp() {
    this.setState({videoURL:null});
    this.setState({status:true});
    this.setState({endCallStatus:true});
  }

  // Function to interchange answer/decline/end buttons and ...
  // calls the fucntion to start call
  toggleStatus() {
    this.setState({
      status:!this.state.status
    });
    this.startCall();
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

    // Updates messaging for Receiver
    let available;
    (this.state.isSwitchOn) ? available = 'ARE' : available = 'NOT';

    // variables to store TouchableOpacity component
    let answerCall  = null;
    let declineCall = null;
    let endCall     = null;

    // checking the status, if true then take TouchableOpacity
    // and save it to the variable
    if(this.state.status) {
      callButtons =
      <TouchableOpacity style={styles.answerCall} onPress = { () => this.toggleStatus() } >
        <Text style={styles.butText}>Answer</Text>
      </TouchableOpacity>;

      <TouchableOpacity style={styles.declineCall} onPress={ () => this.setState({homePage: true}) }>
        <Text style={styles.butText}>Decline</Text>
      </TouchableOpacity>;
    }else {
      callButtons =
      <TouchableOpacity style={styles.endCall} onPress={ () => this.hangUp() }>
        <Text style={styles.butText}>End</Text>
      </TouchableOpacity>;
    }

    // -------------------MAIN PAGE-----------------------
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
    }else {
      // -----------------CALL PAGE------------------------
      homePage =
      <View style={styles.container}>
        <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/>
        <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
        {callButtons}
        {callButtons}
      </View>
    }

    // if (this.state.callPage) {
    //   callPage =
    //   <View style={styles.container}>
    //     <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/>
    //     <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
    //     {endCall}
    //     {answerCall}
    //     {declineCall}
    //   </View>
    // }

    return (
      // did inline styling to test incoming socket data
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: this.state.backColor}}>

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
