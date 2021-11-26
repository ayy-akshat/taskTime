import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import mainAppStyles from '../../mainAppStyles';
import firebase from 'firebase';
import localData from '../../localDataStuff';

export default class Settings_Screen extends React.Component {
  constructor() {
    super();
    this.state = {
      showSignIn: 0
      /*
      0 = don't show log in or sign up
      1 = show log in
      2 = show sign up
      */,
      emailInput: "",
      passwordInput: "",
      confirmPasswordInput: "",
    }
  }

  render() {
    if (firebase.auth().currentUser) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            Settings
          </Text>
          <View style={styles.settingsSection}>
            <Text style={styles.subtitle}>
              Account
            </Text>
            <TouchableOpacity style={styles.settingButton} onPress={() => { Alert.alert("Account", "You are currently signed in with the email:\n" + firebase.auth().currentUser.email) }}>
              <Text style={styles.settingButtonText}>
                Reveal email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton} onPress={() => {
              localData.user.loadFromDb(true, () => {
                Alert.alert("Success", "Loaded data from account.\nTo see updates in the edit presets screen, press refresh.");
                console.log("loaded from acc");
              })
            }}>
              <Text style={styles.settingButtonText}>
                Load from account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton} onPress={() => {
              localData.user.saveToDb(true, () => {
                Alert.alert("Success", "Saved presets to account.");
                console.log("saved to acc");
              })
            }}>
              <Text style={styles.settingButtonText}>
                Save to account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton} onPress={this.signOut}>
              <Text style={styles.settingButtonText}>
                Sign out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            Settings
          </Text>
          <View style={styles.settingsSection}>
            <Text style={styles.subtitle}>
              Account
            </Text>
            {
              (() => {
                switch (this.state.showSignIn) {
                  case 0:
                    return (
                      <View>
                        <TouchableOpacity style={styles.settingButton} onPress={this.signInPrompt} onPress={() => { this.setState({ showSignIn: 1 }) }}>
                          <Text style={styles.settingButtonText}>
                            Log in
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingButton} onPress={this.signInPrompt} onPress={() => { this.setState({ showSignIn: 2 }) }}>
                          <Text style={styles.settingButtonText}>
                            Sign up
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )
                    break;

                  case 1:
                    return (
                      <View>

                        <TextInput
                          value={this.state.emailInput}
                          style={styles.signInInput}
                          onChangeText={(emailInput) => { this.setState({ emailInput }) }}
                          keyboardType="email-address"
                          placeholder="Enter email"
                        />

                        <TextInput
                          value={this.state.passwordInput}
                          style={styles.signInInput}
                          onChangeText={(passwordInput) => { this.setState({ passwordInput }) }}
                          secureTextEntry={true}
                          placeholder="Enter password"
                        />

                        <View style={styles.rowContainer}>
                          <TouchableOpacity style={styles.settingButton} onPress={() => { this.setState({ showSignIn: 0 }) }}>
                            <Text style={styles.settingButtonText}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.settingButton} onPress={this.signIn}>
                            <Text style={styles.settingButtonText}>
                              Sign in
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.settingButton} onPress={() => { this.setState({ showSignIn: 2 }) }}>
                          <Text style={styles.settingButtonText}>
                            Create account
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )
                    break;

                  case 2:
                    return (
                      <View>

                        <TextInput
                          value={this.state.emailInput}
                          style={styles.signInInput}
                          onChangeText={(emailInput) => { this.setState({ emailInput }) }}
                          keyboardType="email-address"
                          placeholder="Enter email"
                        />

                        <TextInput
                          value={this.state.passwordInput}
                          style={styles.signInInput}
                          onChangeText={(passwordInput) => { this.setState({ passwordInput }) }}
                          secureTextEntry={true}
                          placeholder="Enter password"
                        />

                        <TextInput
                          value={this.state.confirmPasswordInput}
                          style={styles.signInInput}
                          onChangeText={(confirmPasswordInput) => { this.setState({ confirmPasswordInput }) }}
                          secureTextEntry={true}
                          placeholder="Confirm password"
                        />

                        <View style={styles.rowContainer}>
                          <TouchableOpacity style={styles.settingButton} onPress={() => { this.setState({ showSignIn: 0 }) }}>
                            <Text style={styles.settingButtonText}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.settingButton} onPress={this.signUp}>
                            <Text style={styles.settingButtonText}>
                              Sign up
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.settingButton} onPress={() => { this.setState({ showSignIn: 1 }) }}>
                          <Text style={styles.settingButtonText}>
                            Existing account
                          </Text>
                        </TouchableOpacity>

                      </View>
                    )
                    break;

                  default:

                    break;
                }
              })()
            }
          </View>
        </View>
      );
    }
  }

  signIn = () => {
    console.log("attempting to log in");
    firebase.auth().signInWithEmailAndPassword(this.state.emailInput, this.state.passwordInput).catch((error) => {
      Alert.alert("Error", error.message);
    }).then(() => {
      this.clearInputs();
    });
  }

  signUp = () => {
    console.log("attempting to sign up");
    if (this.state.passwordInput === this.state.confirmPasswordInput) {
      firebase.auth().createUserWithEmailAndPassword(this.state.emailInput, this.state.passwordInput).catch((error) => {
        Alert.alert("Error", error.message)
      }).then(() => {
        this.forceUpdate();
      })
    }
    else {
      Alert.alert("Confirm password", "Passwords do not match.");
    }
  }

  signOut = () => {
    firebase.auth().signOut().catch((error) => {
      Alert.alert("Error", error.message);
    }).then(() => {
      this.forceUpdate();
    })
  }

  clearInputs = () => {
    this.setState({ emailInput: "", passwordInput: "", confirmPasswordInput: "" });
  }
}

const styles = StyleSheet.create({
  ...mainAppStyles,
  settingButton: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#6e9df5",
    alignSelf: 'center',
    alignItems: 'center',
  },
  settingButtonText: {
    color: "white",
    fontSize: 18,
  },
  signInInput: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#cccccc",
    padding: 20,
    marginVertical: 5,
  },
});
