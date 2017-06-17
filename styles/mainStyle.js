import { StyleSheet } from 'react-native';
const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(240,240,240)'
  },
  container: {
  flex: 1,
  borderWidth : 1,
  backgroundColor: 'rgb(30,30,30)',
  borderColor : 'rgb(0,0,0)',
  },
  logo: {
    height: 150,
    width: 450,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowOpacity: 1.0,
    shadowRadius: 11
  },
  header: {
    flex: 1,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height:150,
    width: window.width,
    backgroundColor: 'rgb(230,230,230)',
    borderBottomColor: 'rgb(170,170,170)',
    borderBottomWidth: 2
  },
  order: {
    fontSize: 40,
    color: "rgb(10,165,255)"
  },
  text: {
    fontSize: 35,
    color: 'rgb(10,165,255)',
    paddingBottom: 30
  },
  switch: {
    paddingBottom: 60
  },
  center: {
    // flex: 1,
    // justifyContent: 'space-around',
    alignItems: 'center',
    // height: 100,
    width: window.width
  },
  sendText: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white'
  },
  butText: {
  fontSize: 35,
  color: 'white'
  },
  button: {
    width: 500,
    height: 500
  },
  input: {
    width: 400,
    fontSize: 50,
    color: 'rgb(30,30,30)'
  },
  touch: {
    width: 110,
    height: 50,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: 'rgb(0,165,255)'

  },
  answerCall: {
    flex:1,
    height:128,
    width: 128,
    borderWidth: 3,
    borderRadius: 64,
    borderColor: 'white',
    backgroundColor: 'rgb(0,165,0)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: window.height-155,
    left: 0,
  },
  declineCall: {
    position: 'absolute',
    top: window.height-155,
    left: window.width-130,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: 'rgb(255,25,50)',
    height:128,
    width: 128,
    borderRadius: 64,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCall: {
    position: 'absolute',
    top: window.height-155,
    left: 0,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: 'rgb(255,25,50)',
    height:128,
    width: window.width-1,
    borderRadius: 64,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLarge : {
    flex: 1,
    width: window.width,
    height: window.height,
  },
  videoSmall : {
    position:'absolute',
    height:200,
    width: 200,
    left: window.width-164,
    top: 0,
  }
});
