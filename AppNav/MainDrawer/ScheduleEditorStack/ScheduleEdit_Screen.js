import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import funcs from '../../../funcs';
import localData from '../../../localDataStuff';
import mainAppStyles from '../../../mainAppStyles';

export default class ScheduleEdit_Screen extends React.Component {
  constructor() {
    super();
    this.state = {
      schedule: {
        id: "",
        name: "",
        tasks: {}
      },
      newTaskInput: ""
    }
  }

  componentDidMount() {
    var gs = this.props.navigation.getState();
    const editScheduleId = gs.routes[gs.routes.length-1].params.editScheduleId;
    const editSchedule = localData.userData.schedulePresets[editScheduleId];
    this.setState({
      schedule: editSchedule
      // schedule: funcs.copyObject(editSchedule)
    });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={[styles.container, { paddingHorizontal: 10 }]}>
          <Text style={styles.title}>
            Edit Schedule Preset
          </Text>
          <Text style={styles.subtitle}>
            (preset id: {this.state.schedule.id})
          </Text>
          <ScrollView style={styles.editScheduleContainer} contentContainerStyle={styles.editScheduleContainerContentContainer}>
            <TextInput
              value={this.state.schedule.name}
              placeholder="Schedule Preset Title"
              style={styles.scheduleNameInput}
              onChangeText={(name) => {
                var s = this.state.schedule;
                s.name = name;
                this.setState({ schedule: s })
              }}
            />
            <View style={[styles.tasksList, styles.tasksListContentContainer]}>
              {Object.values(this.state.schedule.tasks).map((item, index) => this.renderTaskItem({ item }, index))}
              {this.renderTaskItem({ item: { isAdd: true } })}
            </View>
            {/* <View style={styles.finalOptionButtonsContainer}>
              <TouchableOpacity style={styles.finalOptionButton} onPress={() => {this.props.navigation.back();}}>
                <Text style={styles.finalOptionButtonText}>
                  Back
                </Text>
              </TouchableOpacity>
            </View> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  renderTaskItem = ({ item }, index) => {
    if (item.isAdd) {
      return (
        <View style={styles.taskItem} key={index}>
          <View style={styles.taskItemInfoLeft}>
            <TextInput
              value={this.state.newTaskInput}
              placeholder="New task label"
              style={styles.taskItemEditInput}
              onChangeText={(newTaskInput) => { this.setState({ newTaskInput }) }}
            />
          </View>
          <View style={styles.taskItemInfoRight}>
            <TouchableOpacity style={styles.taskItemAddButton} onPress={this.addTask}>
              <Text style={styles.taskItemXButtonText}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={styles.taskItem} key={index}>
          <View style={styles.taskItemInfoLeft}>
            <TextInput
              value={item.label}
              placeholder="Task Label"
              style={styles.taskItemEditInput}
              onChangeText={(label) => {
                var s = this.state.schedule;
                s.tasks[item.id].label = label;
                this.setState({ schedule: s });
              }}
            />
            <View style={styles.rowContainer}>
              <TextInput
                value={item.minutes.toString()}
                placeholder="mins"
                style={styles.taskItemEditTimeInput}
                onChangeText={(mins) => {
                  var minutes = parseInt(mins);
                  minutes = (
                    minutes
                      ? minutes
                      : 0
                  );
                  var s = this.state.schedule;
                  s.tasks[item.id].minutes = minutes;
                  this.setState({ schedule: s });
                }}
                maxLength={3}
              />
              <Text style={{

              }}>
                minutes
              </Text>
            </View>
          </View>
          <View style={styles.taskItemInfoRight}>
            <TouchableOpacity style={styles.taskItemXButton} onPress={() => {
              var s = this.state.schedule;
              delete s.tasks[item.id];
              this.setState({ schedule: s });
            }}>
              <Text style={styles.taskItemXButtonText}>
                X
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  addTask = () => {
    var newTask = {};
    newTask.id = "";
    
    // --- generate unique id ---
    var max = 0;
    for (var t in this.state.schedule.tasks) {
      var n = parseInt(t.substring(1, t.length));
      if (n > max) {
        max = n;
      }
    }
    var id = "t" + (max + 1).toString();
    
    var label = this.state.newTaskInput;
    if (this.state.newTaskInput.trim() == "") {
      var label = "New task " + id;
    }

    newTask.id = id;
    newTask.minutes = 60; // <<< will change to be what user has input
    newTask.label = label;
    newTask.priority = 2; // <<< will change to be what user has input

    var s = this.state.schedule;
    s.tasks[id] = newTask;

    this.setState({ newTaskInput: "", schedule: s });
  }
}

const styles = StyleSheet.create({
  ...mainAppStyles,
  editScheduleContainer: {
    marginTop: 10,
    borderTopWidth: 2,
    width: "100%",
  },
  editScheduleContainerContentContainer: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scheduleNameInput: {
    borderWidth: 2,
    marginTop: 20,
    width: "100%",
    maxWidth: 700,
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 25,
    textAlign: 'center',
  },
  tasksList: {
    marginVertical: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "darkgray",
    width: "100%"
  },
  tasksListContentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  finalOptionButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  finalOptionButton: {
    flex: 1,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#6495ed",
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginHorizontal: 10,
  },
  finalOptionButtonText: {
    fontWeight: 'bold',
    color: "white",
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  taskItem: {
    width: "100%",
    padding: 20,
    borderTopWidth: 2,
    borderColor: "darkgray",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  taskItemInfoLeft: {
    width: "70%",
  },
  taskItemEditInput: {
    borderWidth: 2,
    borderRadius: 10,
    height: 30,
    paddingHorizontal: 5,
    marginRight: 20,
    marginBottom: 5
  },
  taskItemEditTimeInput: {
    borderWidth: 2,
    borderRadius: 10,
    height: 30,
    paddingHorizontal: 5,
    marginRight: 20,
    marginBottom: 5,
  },
  taskItemInfoRight: {
    width: "30%",
    borderLeftWidth: 2,
    borderColor: 'darkgray',
    paddingLeft: 20
  },
  taskItemXButton: {
    backgroundColor: "#ed6464",
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
  taskItemXButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white",
  },
  taskItemAddButton: {
    backgroundColor: "#4bb85f",
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
});
