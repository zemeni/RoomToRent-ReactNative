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

    // Updated: Sample video URLs array including TikTok and YouTube links
    const videoUrls = [
        {type: 'youtube', url: 'https://www.youtube.com/embed/FtDv-L1stdo?si=YI9iwPTUNBBAP9HP'},
        {type: 'youtube', url: 'https://www.youtube.com/embed/EPqtsO5KY2Q?si=EVDPmfXUj9fjGpSi'},
        {type: 'tiktok', url: 'https://www.tiktok.com/music/dance-with-me-7364830026260663046?refer=embed'},
        {type: 'tiktok', url: 'https://www.tiktok.com/embed/7110783436920814854'}
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
                        const videoHTML = video.type === 'youtube'
                            ? `<iframe 
                                    width="100%" 
                                    height="100%" 
                                    src="${video.url}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen="true"
                                    style="width:100%;height:100%;"
                                ></iframe>`
                            :
                            `
                            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@mollyleeclancy/video/7401317934464912656" 
                            data-video-id="7401317934464912656" style="max-width: 605px;min-width: 325px;" > 
                            <section> 
                            <a target="_blank" title="@mollyleeclancy" href="https://www.tiktok.com/@mollyleeclancy?refer=embed">@mollyleeclancy</a> 
                            Another tough week in the office for our Mothers Group coordinator 😪😅 <a title="mothersgroup" target="_blank" 
                            href="https://www.tiktok.com/tag/mothersgroup?refer=embed">#mothersgroup</a> <a title="2040comedyskits" 
                            target="_blank" href="https://www.tiktok.com/tag/2040comedyskits?refer=embed">#2040comedyskits</a> 
                            <a title="babynames" target="_blank" href="https://www.tiktok.com/tag/babynames?refer=embed">#babynames</a> 
                            <a title="weirdnames" target="_blank" href="https://www.tiktok.com/tag/weirdnames?refer=embed">#weirdnames</a> 
                            <a title="funnytiktoks" target="_blank" href="https://www.tiktok.com/tag/funnytiktoks?refer=embed">#funnytiktoks</a> 
                            <a target="_blank" title="♬ original sound - MOLLY 🧚🏽‍♀️" href="https://www.tiktok.com/music/original-sound-7401318015562255120?refer=embed">♬ original sound - MOLLY 🧚🏽‍♀️</a> </section> 
                            </blockquote> 
                            <script async src="https://www.tiktok.com/embed.js"></script>
                            `;

                        return (
                            <View key={index} style={styles.card}>
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardText}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur delectus
                                        eius eos
                                        fugit, inventore libero maiores, nam odio perferendis provident quod tempore ut,
                                        voluptatem?
                                    </Text>
                                </View>
                                <View style={styles.videoContainer}>
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
