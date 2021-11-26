import { Alert, Vibration } from "react-native";

var timer = {
    config: {
        updateTimer: 5,
    },
    time: {
        startTime: 0, // epoch time
    },
    schedule: {
        selectedTaskID: "",
        selectedSchedule: {}, //reference to the selected schedule
        taskList: [], // list of tasks (not by reference, copied then used)
        currentTaskIndex: 0
    },
    running: false,
    startTimer: (schedule) => { // doesn't actually add the interval, initializes the timer to be run
        if (!schedule) {
            Alert.alert("An error happened while trying to start the timer.");
        }
        console.log("timer obj startTimer");
        var taskList = Object.values(JSON.parse(JSON.stringify(schedule.tasks)));
        taskList.sort((a, b) => {
            return a.id.substring(1, a.length) - b.id.substring(1, b.length);
        })
        for (var t in taskList) {
            taskList[t].timeLeft = taskList[t].minutes * 60;
        }
        timer.schedule.taskList = taskList;
        timer.running = true;
        timer.schedule.currentTaskIndex = 0;
    },
    onTimer: () => {
        timer.running = true;
        console.log("timer object onTimer");
        if (timer.schedule.taskList.length === 0) {
            console.log("stopping because no tasks in this schedule");
            Alert.alert("Hmm...", "The selected schedule does not have any tasks.");
            return timer.stopTimer(true);
        }
        timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft -= timer.config.updateTimer / 10;
        timer.updaters.update();
        if (timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft <= 0) {
            timer.schedule.currentTaskIndex++;
            console.log("next task");
            Vibration.vibrate();
        }
        if (timer.schedule.currentTaskIndex > timer.schedule.taskList.length - 1) {
            timer.stopTimer();
        }
    },
    stopTimer: (doNotAlert) => {
        timer.running = false;
        timer.interval.clearAll();
        if (!doNotAlert) {
            Vibration.vibrate();
            setTimeout(() => {
                Vibration.vibrate();
                setTimeout(() => {
                    Vibration.vibrate();
                    setTimeout(() => {
                        Vibration.vibrate();
                        setTimeout(() => {
                            Vibration.vibrate();
                            setTimeout(() => {
                                Vibration.vibrate();
                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 1000)
            }, 1000)
            Alert.alert("Done", "Schedule done!");
        }
        timer.updaters.update();
    },
    getTimeRemainingFormatted: () => {
        if (timer.running) {
            return new Date(timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft * 1000).toISOString().substr(11, 8);
        }
        else {
            return "";
        }
    },
    updaters: {
        addUpdater: (component) => {
            timer.updaters.allUpdaters.push(component);
        },
        allUpdaters: [],
        update: () => {
            for (var u in timer.updaters.allUpdaters) {
                try {
                    timer.updaters.allUpdaters[u].forceUpdate();
                    console.log("updated a(n) " + timer.updaters.allUpdaters[u].constructor.name);
                }
                catch
                {
                    console.log("error in updating a(n) " + timer.updaters.allUpdaters[u].constructor.name);
                }
            }
        }
    },
    increaseTime: (seconds) => {
        if (!timer.running) {
            console.log("timer not running but tried to increase time");
        }
        else {
            timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft += seconds;
        }
    },
    previousTask: () => {
        if (timer.running) {
            if (timer.schedule.currentTaskIndex > 0) {
                timer.schedule.currentTaskIndex--;
                timer.resetCurrentTaskTimeLeft();
                console.log("prev task");
            }
            else {
                console.log("tried to go prev task");
            }
        }
    },
    nextTask: () => {
        if (timer.running) {
            if (timer.schedule.currentTaskIndex < timer.schedule.taskList.length - 1) {
                timer.schedule.currentTaskIndex++;
                timer.resetCurrentTaskTimeLeft();
            }
            else {
                timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft = 0;
            }
        }
    },
    resetCurrentTaskTimeLeft: () => {
        if (timer.running) {
            timer.schedule.taskList[timer.schedule.currentTaskIndex].timeLeft = timer.schedule.taskList[timer.schedule.currentTaskIndex].minutes * 60;
        }
    },


    interval: {
        intervals: new Set(),

        make(...args) {
            var newInterval = setInterval(...args);
            timer.interval.intervals.add(newInterval);
            return newInterval;
        },

        clear(id) {
            timer.interval.intervals.delete(id);
            return clearInterval(id);
        },

        clearAll() {
            for (var id of timer.interval.intervals) {
                timer.interval.clear(id);
            }
        }
    }
}

export default timer;