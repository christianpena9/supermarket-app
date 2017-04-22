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

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

/* CLIENT SCREEN BELOW */
class ClientScreen extends React.Component {
    constructor() {
        super();

        this.socket = io('http://192.168.0.6:3000', {jsonp: false});

        this.state = {
            testData: false
        }

        //data comes back and you can use it for anything
        // this.socket.on('client-data', (data) => {
        //     this.setState({ testData: data });
        // });

        //this.socket.emit('client-data', this.state.testData);
        this.socket.on('client-data', (data) => {
            this.setState({ testData: data });
        });
    }

    render() {
        const { params } = this.props.navigation.state;

        return(
            <View style={styles.view}>
                <Button
                    title = 'Call Now!'
                    onPress = {onButtonPress}
                    disabled = { !this.state.testData }
                />
            </View>
        );
    }
}

export default ClientScreen;
