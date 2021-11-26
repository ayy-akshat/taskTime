const funcs = {
    scheduleTime: (schedulePreset) => {
        var minutes = 0;
        const ts = schedulePreset.tasks;
        for (var t in ts) {
            minutes += ts[t].minutes;
        }
        return minutes;
    },

    minutesToHoursMinutes: (minutes) => {
        var hours = 0;
        var mins = minutes;
        while (mins >= 60) {
            mins -= 60;
            hours++;
        }
        return {
            hours: hours,
            minutes: mins
        };
    },

    formatHoursAndMinutes: (hrsMinsObj) => {
        return (
            (
                (hrsMinsObj.hours == 0)
                    ? ""
                    : (hrsMinsObj.hours +
                        (
                            hrsMinsObj.hours == 1
                                ? " hour"
                                : " hours"
                        ))
            )
            +
            (
                (hrsMinsObj.minutes == 0 && hrsMinsObj.hours > 0)
                    ? ""
                    : (" " + hrsMinsObj.minutes + " minutes")
            )
        )
    },

    formatTimeOfSchedule: (schedule) => {
        var f = funcs.formatHoursAndMinutes(
            funcs.minutesToHoursMinutes(
                funcs.scheduleTime(
                    schedule
                )
            )
        );
        return f;
    },

    copyObject: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    }
}

export default funcs;