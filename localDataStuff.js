import firebase from "firebase";
import { Alert } from "react-native";

var localData = {
    user: {
        saveToDb: (alertIfNotSignedIn, callback) => {
            if (firebase.auth().currentUser) {
                firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/userData").update(localData.userData).then(() => {
                    callback();
                });
            }
            else {
                if (alertIfNotSignedIn) {
                    Alert.alert("You're not signed in.", "You have to be signed in to save your presets to your account.");
                }
            }
        },
        loadFromDb: (alertIfNotSignedIn, callback) => {
            if (firebase.auth().currentUser) {
                firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/userData").get().then((data) => {
                    callback();
                    localData.updateUserData(data.val());
                })
            }
            else {
                if (alertIfNotSignedIn) {
                    Alert.alert("You're not signed in.", "You have to be signed in to load your presets from your account.");
                }
            }
        }
    },
    updateUserData: (newData) => {
        localData.userData = newData;

        if (localData.editPresetScreen)
        {
            localData.editPresetScreen.forceUpdate(() => {
                console.log("updated edit preset screen");
            });
        } else { console.log("no edit preset screen in localData"); }
        if (localData.startTimerScreen)
        {
            localData.startTimerScreen.forceUpdate(() => {
                console.log("updated start timer screen");
            });
        } else { console.log("no start timer screen in localData"); }
    },
    userData: {
        schedulePresets: {}
    },
    editPresetScreen: null,
    startTimerScreen: null
}

export default localData;