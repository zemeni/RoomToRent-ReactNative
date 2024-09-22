import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking } from "react-native";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/Ionicons";
import React, {useContext, useEffect, useMemo, useState} from "react";
import countriesStates from "../../../assets/countriesStates.json";
import { AuthContext } from "../../auth/AuthContext";
import { styles } from "./social.style";
import axios from "axios";

const Social = () => {
    console.log("I am inside the Sports page");
    const { user } = useContext(AuthContext);

    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({ key: s.key, label: s.label })), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);

    const [state, setState] = useState(defaultState.key);
    const [socials, setSocials] = useState([]);

    const DescriptionSection = ({ description }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleDescription = () => {
            setIsExpanded(!isExpanded);
        };

        const renderDescription = () => {
            if (isExpanded || description.length <= 100) {
                return <Text style={styles.cardText}>{description}</Text>;
            } else {
                return (
                    <Text style={styles.cardText}>
                        {description.substring(0, 100)}...
                        <TouchableOpacity onPress={toggleDescription}>
                            <Text style={{ color: 'blue' }}> See More</Text>
                        </TouchableOpacity>
                    </Text>
                );
            }
        };

        return <View>{renderDescription()}</View>;
    };

    useEffect(() => {
        const fetchSocialEvents = async () => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/socialEvents?state=${state}`);
                setSocials(response.data);
            } catch (error) {
                console.log("An error has occurred:", error);
            }
        };

        fetchSocialEvents();
    }, [state]);

    const sportsClubs = [
        {
            id: 1,
            title: "Meet Sigrace => Free Entry",
            imageUrl: "https://room-to-rent.s3.ap-southeast-2.amazonaws.com/sigrace.jpg",
            description: "Please join our local football club and enjoy weekend matches! Join our local football club and enjoy weekend matches!" +
                " Join our local football club and enjoy weekend matches! " +
                "holla babu",
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

    console.log("social data are ", socials);

    const openFacebookLink = async (url) => {
        const facebookAppUrl = `fb://facewebmodal/f?href=${url}`;

        try {
            const supported = await Linking.canOpenURL(facebookAppUrl);
            if (supported) {
                await Linking.openURL(facebookAppUrl);
            } else {
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
                    {socials.map((social) => (
                        <View key={social.socialid} style={styles.card}>
                            <Image source={{ uri: social.imageurl }} style={styles.cardImage} />
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{social.title}</Text>
                                <DescriptionSection description={social.description} />
                                <TouchableOpacity
                                    style={styles.cardButton}
                                    onPress={() => openFacebookLink(social.facebookLink)}
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

export default Social;
