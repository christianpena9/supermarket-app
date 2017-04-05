import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
} from 'react-native';

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from '../styles/mainStyle';

/* RECEIVER SCREEN BELOW */
class ReceiverScreen extends React.Component {
    render() {
        return(
            <View style={styles.view}>
                <Text>Receiver Screen</Text>
            </View>
        );
    }
}

export default ReceiverScreen;
