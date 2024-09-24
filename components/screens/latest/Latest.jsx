import {Text, View, SafeAreaView, ScrollView} from "react-native";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/Ionicons";
import React, {useContext, useEffect, useMemo, useState} from "react";
import countriesStates from "../../../assets/countriesStates.json";
import {AuthContext} from "../../auth/AuthContext";
import {WebView} from "react-native-webview";
import {styles} from './latest.style';
import axios from "axios";

const Latest = () => {
    console.log("I am inside latest screen");
    const {user} = useContext(AuthContext);
    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({key: s.key, label: s.label})), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);

    const [state, setState] = useState(defaultState.key);
    const [latestInformation, setLatestInformation] = useState([]);

    function generateTikTokUrl(videoId) {
        const baseUrl = 'https://www.tiktok.com/player/v1/';
        const params = '?&music_info=1&description=1';
        return `${baseUrl}${videoId}${params}`;
    }

    useEffect(() => {
        const fetchLatestInformation = async () => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/latestInformation?state=${state}`);
                setLatestInformation(response.data);
            } catch (error) {
                console.log("An error has occurred:", error);
            }
        };

        fetchLatestInformation();
    }, [state]);

    console.log("fetched latest info: ", latestInformation);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                {/* State Picker */}
                <View style={styles.pickerContainer}>
                    <ModalSelector
                        data={stateOptions}
                        onChange={(stateOption) => setState(stateOption.key)}>
                        <View style={styles.dropdown}>
                            <Text style={styles.pickerText}>{stateOptions.find(s => s.key === state).label}</Text>
                            <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon}/>
                        </View>
                    </ModalSelector>
                </View>

                {/* Video Cards */}
                <View style={styles.cardsContainer}>
                    {latestInformation.map((info, index) => {
                        // Video Embed HTML based on type
                        let videoHTML;
                        if (info.type === 'youtube' || info.type === 'facebook') {
                            videoHTML = `${info.videourl}`;
                        } else if (info.type === 'tiktok') {
                            videoHTML = `<iframe 
                                height="100%" 
                                width="100%" 
                                src="${generateTikTokUrl(info.videourl)}" 
                                allow="fullscreen" 
                                title="TikTok video"
                                style="border:none;overflow:hidden"
                                scrolling="no" 
                                frameborder="0" 
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                            ></iframe>`;
                        }

                        return (
                            <View key={index} style={styles.card}>
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardText}>
                                        {info.description}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.videoContainer,
                                    {height: info.type === 'tiktok' ? 350 : info.type === 'facebook' ? 350 : 200}  // Dynamic height adjustment
                                ]}>
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{html: videoHTML}}
                                        style={styles.webview}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        allowsFullscreenVideo={true}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Latest;
