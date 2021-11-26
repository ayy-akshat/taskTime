import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import timer from '../timer';
import ScheduleEditorStack_Nav from './MainDrawer/ScheduleEditorStack_Nav';
import ScheduleSet_Screen from './MainDrawer/ScheduleSet_Screen';
import Settings_Screen from './MainDrawer/Settings_Screen.js';

const Drawer = createDrawerNavigator();

export default class MainDrawer_Nav extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount()
    {
        timer.updaters.addUpdater(this);
    }

    render() {
        return (
            <Drawer.Navigator
                screenOptions={{
                    drawerActiveTintColor: "#333333",
                    drawerInactiveTintColor: "#777777",
                    headerTintColor: "#555555",
                    headerTitle: "Task Time " + timer.getTimeRemainingFormatted(),
                    unmountOnBlur: false,
                }}
            >

                <Drawer.Screen
                    name="Start Timer"
                    component={ScheduleSet_Screen}
                    options={{
                        unmountOnBlur: false,
                        headerStyle: {
                            backgroundColor: 'white',
                        }
                    }}
                />

                <Drawer.Screen
                    name="Edit Schedules"
                    component={ScheduleEditorStack_Nav}
                    options={{
                        unmountOnBlur: false,
                        headerStyle: {
                            backgroundColor: 'white',
                        }
                    }}
                />

                <Drawer.Screen
                    name="Settings"
                    component={Settings_Screen}
                    options={{
                        unmountOnBlur: false,
                        headerStyle: {
                            backgroundColor: 'white',
                        }
                    }}
                />
            </Drawer.Navigator>
        );
    }
}