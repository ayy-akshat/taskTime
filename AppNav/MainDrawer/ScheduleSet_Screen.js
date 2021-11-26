import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import funcs from '../../funcs';
import localData from '../../localDataStuff';
import mainAppStyles from '../../mainAppStyles';
import timer from '../../timer';

export default class ScheduleSet_Screen extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
      timerCurrentTask: {},
    };
  }

  componentDidMount() {
    console.log("componentDidMount set the timer start thing");
    localData.startTimerScreen = this;
  }

  render() {
    if (timer.running) {
      return (
        <View style={styles.timerContainer}>
          <View style={styles.timerButtonsContainer}>
            <TouchableOpacity style={styles.timerButton} onPress={this.previousTask}>
              <Text style={styles.timerButtonText}>
                Previous task
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerButton} onPress={this.nextTask}>
              <Text style={styles.timerButtonText}>
                Next task
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timerTaskText}>
            Complete "{timer.schedule.taskList[timer.schedule.currentTaskIndex].label}" in
          </Text>
          <Text style={styles.timerTimeText}>
            {
              timer.getTimeRemainingFormatted()
            }
          </Text>
          <Text style={styles.timerTaskText}>
            {
              (() => {
                if (timer.schedule.currentTaskIndex === timer.schedule.taskList.length - 1) {
                  return "Last task!";
                }
                else {
                  return "Next task: " + "\"" + timer.schedule.taskList[timer.schedule.currentTaskIndex + 1].label + "\"";
                }
              })()
            }
          </Text>
          <View style={styles.timerButtonsContainer}>
            <View style={styles.timerTimeButtonsContainer}>
              <TouchableOpacity style={styles.timerButtonTop} onPress={() => { this.increaseTime(60) }}>
                <Text style={styles.timerButtonText}>
                  +1 minutes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButtonBottom} onPress={() => { this.increaseTime(-60) }}>
                <Text style={styles.timerButtonText}>
                  -1 minutes
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.timerButton} onPress={() => { timer.stopTimer(true); this.forceUpdate(); }}>
              <Text style={styles.timerButtonText}>
                Stop timer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else {
      if (Object.keys(localData.userData.schedulePresets).length == 0) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>
              You have no schedule presets...
            </Text>
            <TouchableOpacity style={styles.otherBtn} onPress={() => {
              this.props.navigation.navigate("Edit Schedules");
            }}>
              <Text style={styles.otherBtnText}>
                Edit presets...
              </Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>
              Have presets that aren't showing? Press refresh.
            </Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={() => { this.forceUpdate() }}>
              <Text style={styles.refreshBtnText}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      var selectedPresetID = Object.keys(localData.userData.schedulePresets)[this.state.selectedIndex];
      console.log("this.state.selectedIndex", this.state.selectedIndex);
      return (
        <View style={[styles.container, { paddingHorizontal: 20 }]}>
          <Text style={styles.title}>
            Start Schedule Timer
          </Text>
          <Text style={styles.subtitle}>
            Start your schedule for today and get working!
          </Text>
          <Text style={styles.selectPresetLabel}>
            {"Select a schedule:"}
          </Text>
          <View style={styles.selectPresetButtonsContainer}>
            <TouchableOpacity style={styles.selectPresetButton} onPress={() => { this.changeSelctedPreset(-1) }}>
              <Text style={styles.selectPresetButtonText}>
                {"<"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.selectPresetText}>
              {
                (() => {
                  if (this.checkIfSelectedInRange(true)) {
                    return localData.userData.schedulePresets[selectedPresetID].name;
                  }
                  else {
                    return "...";
                  }
                })()
              }
            </Text>
            <TouchableOpacity style={styles.selectPresetButton} onPress={() => { this.changeSelctedPreset(1) }}>
              <Text style={styles.selectPresetButtonText}>
                {">"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={this.startButtonPressed}>
            <Text style={styles.startBtnText}>
              Start
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherBtn} onPress={() => {
            this.props.navigation.navigate("Edit Schedules");
          }}>
            <Text style={styles.otherBtnText}>
              Edit presets...
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  changeSelctedPreset = (increment) => {
    var s = this.state.selectedIndex;
    s += increment;
    while (s < 0) {
      s += Object.keys(localData.userData.schedulePresets).length;
    }
    s = s % Object.keys(localData.userData.schedulePresets).length;
    this.setState({ selectedIndex: s });
  }

  checkIfSelectedInRange = (changeIfFalse) => {
    if (this.state.selectedIndex > Object.keys(localData.userData.schedulePresets).length - 1) {
      if (changeIfFalse) {
        this.setState({ selectedIndex: 0 });
      }
      // console.log("checkIfSelectedInRange false");
      return false;
    }
    else {
      // console.log("checkIfSelectedInRange true");
      return true;
    }
  }

  getSelectedPreset = () => {
    return localData.userData.schedulePresets[
      Object.keys(localData.userData.schedulePresets)[this.state.selectedIndex]
    ];
  }

  startButtonPressed = () => {
    if (this.checkIfSelectedInRange(false)) {
      Alert.alert("Start Timer", "You have selected the preset, \"" + this.getSelectedPreset().name + "\".\nPress 'Start' to start.", [
        {
          text: "Nope",
        },
        {
          text: "Start",
          onPress: this.startTimer
        }
      ]);
    }
    else {
      Alert.alert("Change selection", "You may have modified some presets... Press the left/right arrows to select an existing preset.");
    }
  }

  startTimer = () => {
    timer.startTimer(this.getSelectedPreset());
    timer.interval.make(() => {
      timer.onTimer();
      this.onTimer();
    }, 500)
  }

  onTimer = () => {
    if (timer.schedule.taskList.length === 0) {
      return;
    }
    this.forceUpdate();
  }

  increaseTime = (...args) => {
    timer.increaseTime(...args);
    this.forceUpdate();
  }

  previousTask = (...args) => {
    timer.previousTask(...args);
    this.forceUpdate();
  }

  nextTask = (...args) => {
    timer.nextTask(...args);
    this.forceUpdate();
  }
}

const styles = StyleSheet.create({
  ...mainAppStyles,
  startBtn: {
    width: "100%",
    flex: 0.6,
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#6e9df5",
    marginBottom: 15
  },
  startBtnText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "white"
  },
  otherBtn: {
    width: "100%",
    flex: 0.1,
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "darkgray",
    marginBottom: 15,
  },
  otherBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  },
  selectPresetLabel: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  selectPresetButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectPresetButton: {
    borderRadius: 100,
    padding: 10,
    backgroundColor: '#7b7b7b',
    flex: 0.08,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectPresetButtonText: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  selectPresetText: {
    marginTop: 10,
    fontSize: 20,
    marginHorizontal: 20,
    flex: 1,
    textAlign: 'center'
  },

  timerContainer: {
    ...mainAppStyles.container,
    justifyContent: 'center',
    backgroundColor: "#222222",
  },
  timerButtonsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 50,
  },
  timerTaskText: {
    color: "white",
  },
  timerTimeText: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 50,
    marginVertical: 30,
    fontVariant: ["tabular-nums"]
  },
  timerButton: {
    flex: 1,
    padding: 20,
    paddingVertical: 30,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#999999",
    backgroundColor: "#666666",
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  timerTimeButtonsContainer: {
    flex: 1.5,
  },
  timerButtonTop: {
    padding: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 4,
    borderBottomWidth: 0,
    borderColor: "#999999",
    backgroundColor: "#666666",
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  timerButtonBottom: {
    padding: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 4,
    borderTopWidth: 0,
    borderColor: "#999999",
    backgroundColor: "#666666",
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  timerButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  refreshBtn: {
    backgroundColor: "#bfbfbf",
    paddingHorizontal: 30,
    paddingVertical: 5,
    height: 40,
    borderRadius: 16,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold'
  }
});
