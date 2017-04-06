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
    constructor(props) {
        super(props);
        this.state = {
          isSwitchOn: false
        }
    }
    updateSwitch2 = (value) => {
      this.setState({isSwitchOn: value});
    }

    render() {
      const { params } = this.props.navigation.state;
      console.log(this.state.isSwitchOn);
      console.log(params.updateSwitch);
        return(
            <View style={styles.view}>
                <Text>Receiver Screen</Text>
                {/* <Text>this is the value= {params.isSwitchOn}</Text> */}
                <Switch
                  onValueChange={params.updateSwitch}
                  // onValueChange={this.updateSwitch2}
                  value={params.isSwitchOn}
                 />
            </View>
        );
    }
}

export default ReceiverScreen;
