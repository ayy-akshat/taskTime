import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login_Screen from './AppNav/Login_Screen';
import MainDrawer_Nav from './AppNav/MainDrawer_Nav';
import Timer_Screen from './AppNav/Timer_Screen';
import firebase from 'firebase/app';
import firebaseConfig from './dbConfig';
import localData from './localDataStuff';

export default class App extends React.Component {
  componentDidMount()
  {
    console.log("trying to load data from database");
    // localData.user.loadFromDb(false, () => {
    //   console.log("loaded data from database");
    // })
  }

  render() {
    return (
      <NavigationContainer>
        <MainDrawer_Nav/>
      </NavigationContainer>
    );
  }
}

const app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);