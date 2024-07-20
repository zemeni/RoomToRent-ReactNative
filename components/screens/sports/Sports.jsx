import React, {useContext} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../auth/AuthContext'; // Adjust the import based on your context location

const Sports = () => {
    const navigation = useNavigation();
    const {user} = useContext(AuthContext); // Access isLoggedIn state from AuthContext

    const handlePost = () => {
        console.log("logged in user is  ", user);
        if (user) {
            // Logic to post something (console log for now)
            console.log("Posting something...");

            // You can add further logic here to actually post something
        } else {
            // Navigate to login screen with the current screen as fromScreen
            navigation.navigate('Login', {fromScreen: 'Sports'});
        }
    };

    console.log("sports is rendered");
    return <>
        {user ? (
            <View>
                <Text>this is sports content you've just posted</Text>
            </View>
        ) : (
            <View>
                <Text>This is sports</Text>
                <Button title="Post" onPress={handlePost}/>
            </View>
        )
        }
    </>
};

export default Sports;
