import {Text, View, StyleSheet, Button, SafeAreaView} from "react-native";
import {styles} from "./jobs.style";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/Ionicons";
import React, {useContext, useMemo, useState} from "react";
import countriesStates from '../../../assets/countriesStates.json'
import {AuthContext} from "../../auth/AuthContext";

const Latest = () => {
    console.log("I am inside the latest page");
    const { user } = useContext(AuthContext);


    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({ key: s.key, label: s.label })), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);

    const [state, setState] = useState(defaultState.key);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pickerContainer}>
                <ModalSelector data={stateOptions}
                               onChange={(stateOption) => setState(stateOption.key)} >
                    <View style={styles.dropdown}>
                        <Text style={styles.pickerText}>{stateOptions.find(s => s.key === state).label}</Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon}/>
                    </View>
                </ModalSelector>
            </View>

            <Text>You will get latest information from {state}</Text>
        </SafeAreaView>
    );
};

export default Latest;
