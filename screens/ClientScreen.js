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

/* CLIENT SCREEN BELOW */
class ClientScreen extends React.Component {
  constructor() {
    super();

    this.socket = io('http://172.20.10.10:3000', {jsonp: false});
    this.state = {
      callButton: false,
      callPage: false,
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
    })

  }


    render() {
      const { params } = this.props.navigation.state;

      onButtonPress = () => {
        this.socket.emit('calling-client', false);
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
          <RTCView streamURL={this.state.videoURL2} style={styles.videoLarge}/>
          <TouchableOpacity style={styles.endCall} onPress={ () => this.setState({callPage: !this.state.callPage}) }>
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
