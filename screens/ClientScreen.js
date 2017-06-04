import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Switch,
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
import io from "socket.io-client/dist/socket.io";

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from '../styles/mainStyle';

const videoStream2 = {};

/* CLIENT SCREEN BELOW */
class ClientScreen extends React.Component {
  constructor() {
    super();

    this.socket = io('http://192.168.86.94:3000', {jsonp: false});
    this.state = {
      callButton: false,
      callPage: false,
      videoURL: null,
      videoURL2: null
    }

    // --------------INCOMING DATA------------------
    this.socket.on('isSwitchOn-server', (data) => {
      this.setState({ callButton: data });
    });

    this.socket.on('videoURL-server', (data) =>{
      console.log("incoming data from server videoURL-server => ", data);
      this.setState({
        videoURL2: data,
        callPage: !this.state.callPage
      })
      this.startCall();
    });

    this.socket.on("hangUpAll-server", (data)=> {
      console.log("incoming data from server to update callPage =>", data);
      this.setState({ callPage: data });

    });

  }

  //------------------RTC REQUIREMENTS-------------------------
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
      if (videoStream2.run === undefined) {
        this.setState({
          videoURL : stream.toURL(),
          answerCallButton:!this.state.answerCallButton,
          endCallButton: !this.state.endCallButton
        });
        videoStream2 = stream;
        videoStream2.run = true;
        this.socket.emit('videoURL-client', this.state.videoURL);
      }
      else{
        this.setState({
          videoURL : videoStream2.toURL(),
          // answerCallButton:!this.state.answerCallButton,
          // endCallButton: !this.state.endCallButton
        });
        // this.socket.emit('videoURL-client', this.state.videoURL);
      }
    }

    var errorCallback = (error) => {
      console.log("Oooops we got an error!", error.message);
      throw error;
    }

    getUserMedia(constraints, successCallback, errorCallback);
  }
  // end of startCall


  // -------------------FUNCTIONS----------------------------
  hangUp(){
    this.setState({
      videoURL:null
    });
    this.socket.emit('hangUpAll-client', false);
  }

// ------------------------VIEW-----------------------------
    render() {
      const { params } = this.props.navigation.state;

      onButtonPress = () => {
        this.socket.emit('calling-client', true);
      };

      // -------------------MAIN PAGE-----------------------
      if (!this.state.callPage) {
        homePage =
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.backColor}}>
          <Text style={styles.order}>
            Place your order now!
          </Text>
          <Button
              style={styles.touch}
              title = 'Call Now!'
              onPress = {onButtonPress}
              disabled = { !this.state.callButton }
          />
        </View>
      }else {
        // -----------------CALL PAGE------------------------
        homePage =
        <View style={styles.container}>
          {/* <RTCView streamURL={this.state.videoURL} style={styles.videoSmall}/> */}
          <RTCView streamURL={this.state.videoURL} style={styles.videoLarge}/>
          <TouchableOpacity style={styles.endCall} onPress={ () => this.hangUp() }>
            <Text style={styles.butText}>End</Text>
          </TouchableOpacity>
        </View>
      }


        return(
            <View style={styles.view}>
              {homePage}
            </View>
        );
    }
}

export default ClientScreen;
