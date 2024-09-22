import { Text, View, SafeAreaView, ScrollView } from "react-native";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useContext, useMemo, useState } from "react";
import countriesStates from "../../../assets/countriesStates.json";
import { AuthContext } from "../../auth/AuthContext";
import { WebView } from "react-native-webview";
import { styles } from './latest.style';

const Latest = () => {
    console.log("I am inside latest screen");
    const {user} = useContext(AuthContext);
    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({key: s.key, label: s.label})), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);

    const [state, setState] = useState(defaultState.key);

    // Sample video URLs array including TikTok and YouTube links
    const videoUrls = [
        {type: 'youtube', url: 'https://www.youtube.com/embed/FtDv-L1stdo?si=YI9iwPTUNBBAP9HP'},
        {type: 'youtube', url: 'https://www.youtube.com/embed/EPqtsO5KY2Q?si=EVDPmfXUj9fjGpSi'},
        {type: 'tiktok', url: 'https://www.tiktok.com/player/v1/7172526068522306843?&music_info=1&description=1'},
        {type: 'tiktok', url: 'https://www.tiktok.com/player/v1/7252323577070980354?&music_info=1&description=1'}
    ];

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
                    {videoUrls.map((video, index) => {
                        // Video Embed HTML based on type
                        const videoHTML = video.type === 'youtube' ?
                            `<iframe 
                            width="100%" 
                            height="100%" 
                            src="${video.url}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen="true"
                            style="width:100%;height:100%;"
                        ></iframe>` :
                            `<iframe 
                            height="900" 
                            width="100%" 
                            src="${video.url}" 
                            allow="fullscreen" 
                            title="TikTok video"
                            style="border:none;overflow:hidden"
                            scrolling="no" 
                            frameborder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        ></iframe>`;

                        return (
                            <View key={index} style={styles.card}>
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardText}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur delectus
                                        eius eos fugit, inventore libero maiores, nam odio perferendis provident quod
                                        tempore ut, voluptatem?
                                    </Text>
                                </View>
                                <View style={[
                                    styles.videoContainer,
                                    { height: video.type === 'tiktok' ? 350 : 200 }  // Dynamic height adjustment
                                ]}>
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html: videoHTML }}
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
