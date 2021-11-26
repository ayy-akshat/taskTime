import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import localData from '../../localDataStuff';
import ScheduleEdit_Screen from './ScheduleEditorStack/ScheduleEdit_Screen';
import SchedulePresets_Screen from './ScheduleEditorStack/SchedulePresets_Screen';

const Stack = createStackNavigator();

export default class ScheduleEditorStack_Nav extends React.Component {
    componentDidMount() {
        console.log("componentDidMount set thjgas j13qw˚£¡™˙¢´®∆˚");
        localData.editPresetScreen = this;
    }

    render() {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackImage: (props) => <View>
                        <Text style={{
                            marginLeft: 30,
                            fontWeight: 'bold',
                            fontSize: 25,
                            color: "#3b84f2",
                        }}>
                            Back
                        </Text>
                    </View>,
                    headerBackTitleVisible: false
                }}
            >
                <Stack.Screen
                    name="SchedulePresets"
                    component={SchedulePresets_Screen}
                />
                <Stack.Screen
                    name="ScheduleEdit"
                    component={ScheduleEdit_Screen}
                />
            </Stack.Navigator>
        );
    }
}