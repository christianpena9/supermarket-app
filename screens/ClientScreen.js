import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Switch,
} from 'react-native';

/* CUSTOM IMPORT STYLES BELOW */
import { styles } from '../styles/mainStyle';

const onButtonPress = () => {
    Alert.alert('Button was pressed!');
};

/* CLIENT SCREEN BELOW */
class ClientScreen extends React.Component {
    render() {
        const { params } = this.props.navigation.state;
        return(
            <View style={styles.view}>
                <Button
                    title = 'Call Now!'
                    onPress = {onButtonPress}
                    disabled = { !params.isSwitchOn }
                />
            </View>
        );
    }
}

export default ClientScreen;
