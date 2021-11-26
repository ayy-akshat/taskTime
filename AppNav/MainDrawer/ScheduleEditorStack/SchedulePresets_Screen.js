import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import funcs from '../../../funcs';
import localData from '../../../localDataStuff';
import mainAppStyles from '../../../mainAppStyles';
import firebase from 'firebase';

export default class SchedulePresets_Screen extends React.Component {
  render() {
    const presets = localData.userData.schedulePresets;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Schedules
        </Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => { this.forceUpdate() }}>
          <Text style={styles.refreshBtnText}>
            Refresh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => { this.props.navigation.navigate("Start Timer") }}>
          <Text style={styles.refreshBtnText}>
            Start Timer
          </Text>
        </TouchableOpacity>
        <FlatList
          data={[...Object.values(presets), { isAdd: true }]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderScheduleItem}
          style={styles.schedulesList}
          contentContainerStyle={styles.schedulesListContentContainer}
        />
      </View>
    );
  }

  renderScheduleItem = ({ item }) => {
    if (item.isAdd) {
      return (
        <View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleItemInfoContainer}>
              <View style={styles.scheduleItemInfoContainerTextContainer}>
                <Text style={styles.scheduleItemName}>
                  Add new preset
                </Text>
              </View>
              <TouchableOpacity style={styles.scheduleItemAddBtn} onPress={() => { this.addPreset(true) }}>
                <Text style={styles.scheduleItemAddBtnText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            (() => {
              if (firebase.auth().currentUser) {
                return (
                  <View>
                    <Text style={[styles.subtitle, {marginTop: 50}]}>
                      Don't see presets saved to your account...?{"\n\n"}Try pressing refresh.{"\n\n"}If that doesn't work, go to settings and press "Load from account".
                    </Text>
                    <TouchableOpacity style={[styles.refreshBtn, {marginBottom: 50}]} onPress={() => {this.props.navigation.navigate("Settings")}}>
                      <Text style={styles.refreshBtnText}>
                        Settings
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }
              else
              {
                return (
                  <View>
                    <Text style={[styles.subtitle, {marginTop: 50}]}>
                      Want to be able to save presets...?{"\n\n"}Go to settings and sign up.{"\n\n"}If you're already signed in, press refresh.
                    </Text>
                    <TouchableOpacity style={[styles.refreshBtn, {marginBottom: 50}]} onPress={() => {this.props.navigation.navigate("Settings")}}>
                      <Text style={styles.refreshBtnText}>
                        Settings
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })()
          }
        </View>
      );
    }
    else {
      return (
        <View style={styles.scheduleItem}>
          <View style={styles.scheduleItemInfoContainer}>
            <View style={styles.scheduleItemInfoContainerTextContainer}>
              <Text style={styles.scheduleItemName}>
                {item.name}
              </Text>
              <Text style={styles.scheduleItemTasks}>
                {Object.keys(item.tasks).length} task(s), {funcs.formatTimeOfSchedule(item)} total
              </Text>
              <Text style={styles.scheduleItemTime}>

              </Text>
            </View>
            <View style={styles.scheduleItemInfoContainerButtonsContainer}>
              <TouchableOpacity style={styles.scheduleItemEditBtn} onPress={() => { this.goToEditSchedulePreset(item) }}>
                <Text style={styles.scheduleItemEditBtnText}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.scheduleItemDeleteBtn} onPress={() => { delete localData.userData.schedulePresets[item.id]; this.forceUpdate(); }}>
                <Text style={styles.scheduleItemEditBtnText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  goToEditSchedulePreset = (schedule) => {
    this.props.navigation.navigate("ScheduleEdit", { editScheduleId: schedule.id });
  }

  addPreset = (editAfter) => {
    var label = this;

    var newPreset = {};
    newPreset.id = "";

    // --- generate unique id ---
    var max = 0;
    for (var p in localData.userData.schedulePresets) {
      var n = parseInt(p.substring(1, p.length));
      if (n > max) {
        max = n;
      }
    }
    var id = "p" + (max + 1).toString();

    newPreset.id = id;
    newPreset.name = "New preset " + id;
    newPreset.tasks = {
      t1: {
        id: "t1",
        minutes: 20,
        label: "New task t1"
      }
    };

    localData.userData.schedulePresets[id] = newPreset;
    this.forceUpdate();

    if (editAfter) {
      this.goToEditSchedulePreset(localData.userData.schedulePresets[id]);
    }
  }
}

const styles = StyleSheet.create({
  ...mainAppStyles,
  schedulesList: {
    marginTop: 10,
    width: "100%"
  },
  schedulesListContentContainer: {
    paddingHorizontal: 20,
  },
  scheduleItem: {
    borderRadius: 20,
    backgroundColor: "#dddddd",
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  scheduleItemInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scheduleItemInfoContainerTextContainer: {
    width: "50%",
    justifyContent: 'center',
  },
  scheduleItemName: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black'
  },
  scheduleItemTasks: {
    color: "#555555",
    fontSize: 15,
    marginTop: 10,
  },
  scheduleItemTime: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: "gray",
    marginTop: 15,
  },
  scheduleItemEditBtn: {
    backgroundColor: "#6495ed",
    padding: 30,
    marginLeft: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    maxHeight: 100,
  },
  scheduleItemEditBtnText: {
    fontWeight: 'bold',
    color: "white",
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  scheduleItemAddBtn: {
    backgroundColor: "#4bb85f",
    padding: 30,
    marginLeft: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center'
  },
  scheduleItemAddBtnText: {
    fontWeight: 'bold',
    color: "white",
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  scheduleItemDeleteBtn: {
    backgroundColor: "#ed6464",
    padding: 30,
    marginLeft: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    maxHeight: 100,
    marginTop: 10
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
