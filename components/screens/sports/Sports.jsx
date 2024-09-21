import {Text, View, Image, SafeAreaView, Button, ScrollView, TouchableOpacity, Linking} from "react-native";;
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useContext, useMemo, useState } from "react";
import countriesStates from "../../../assets/countriesStates.json";
import { AuthContext } from "../../auth/AuthContext";
import { styles } from "./Sports.style";

const Sports = () => {
    console.log("I am inside the Sports page");
    const { user } = useContext(AuthContext);

    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({ key: s.key, label: s.label })), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);

    const [state, setState] = useState(defaultState.key);

    const sportsClubs = [
        {
            id: 1,
            title: "Cricket Club",
            imageUrl: "https://room-to-rent.s3.ap-southeast-2.amazonaws.com/redrhino.png",
            description: "Join our local football club and enjoy weekend matches! Join our local football club and enjoy weekend matches! Join our local football club and enjoy weekend matches!",
            buttonText: "Join Now",
            facebookLink: "https://www.facebook.com/redrhinoscc"
        },
        {
            id: 2,
            title: "Football Club",
            imageUrl: "https://room-to-rent.s3.ap-southeast-2.amazonaws.com/8848_football",
            description: "Love basketball? Become a part of our active basketball community.",
            buttonText: "Sign Up",
            facebookLink: "https://www.facebook.com/8848RoyalsFC"
        },
        {
            id: 3,
            title: "Swimming Club",
            imageUrl: "https://room-to-rent.s3.ap-southeast-2.amazonaws.com/redrhino.png",
            description: "Dive into fun with our swimming club! All skill levels welcome.",
            buttonText: "Get Started",
        }
    ];

    const openFacebookLink = async (url) => {
        const facebookAppUrl = `fb://facewebmodal/f?href=${url}`;  // Facebook URL scheme to open in the app

        try {
            // Check if Facebook app is installed
            const supported = await Linking.canOpenURL(facebookAppUrl);
            if (supported) {
                // Open in Facebook app
                await Linking.openURL(facebookAppUrl);
            } else {
                // Fallback to browser if Facebook app is not installed
                await Linking.openURL(url);
            }
        } catch (error) {
            console.error("Failed to open URL:", error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                {/* State Picker */}
                <View style={styles.pickerContainer}>
                    <ModalSelector data={stateOptions}
                                   onChange={(stateOption) => setState(stateOption.key)} >
                        <View style={styles.dropdown}>
                            <Text style={styles.pickerText}>{stateOptions.find(s => s.key === state).label}</Text>
                            <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon}/>
                        </View>
                    </ModalSelector>
                </View>

                <View style={styles.cardsContainer}>
                    {sportsClubs.map((club) => (
                        <View key={club.id} style={styles.card}>
                            <Image source={{ uri: club.imageUrl }} style={styles.cardImage} />
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{club.title}</Text>
                                <Text style={styles.cardText}>{club.description}</Text>
                                <TouchableOpacity
                                    style={styles.cardButton}
                                    onPress={() => openFacebookLink(club.facebookLink)}
                                >
                                    <Text style={styles.cardButtonText}>Visit on Facebook</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Sports;
