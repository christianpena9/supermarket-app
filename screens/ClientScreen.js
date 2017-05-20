import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Switch,
} from 'react-native';
import io from "socket.io-client/dist/socket.io";

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from '../styles/mainStyle';

// const onButtonPress = () => {
//   this.socket.emit('calling-client', true);
// };

/* CLIENT SCREEN BELOW */
class ClientScreen extends React.Component {
    constructor() {
        super();

        this.socket = io('http://192.168.0.7:3000', {jsonp: false});

        this.state = {
            Data: false,
            testData: "false"
        }



        this.socket.on('isSwitchOn-server', (data) => {
          this.setState({ Data: data });
          this.setState({ testData: data });
        });
    }


    render() {
      onButtonPress = () => {
        this.socket.emit('calling-client', false);
      };
        const { params } = this.props.navigation.state;

        return(
            <View style={styles.view}>
                <Text style={styles.order}>
                  Place your order now!
                </Text>
                <Button
                    style={styles.touch}
                    title = 'Call Now!'
                    onPress = {onButtonPress}
                    disabled = { !this.state.Data }
                />
            </View>
        );
    }
}

export default ClientScreen;
