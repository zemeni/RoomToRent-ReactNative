import {Text, View, StyleSheet, Button} from "react-native";
import {style} from "./jobs.style";
import {useContext} from "react";
import {AuthContext} from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Jobs = () => {
    console.log("job page  is rendered");

    const navigation = useNavigation();
    const { logout} = useContext(AuthContext)

    const handleLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return (
        <View style={style.container}>
            <Text>This is a home page</Text>
            <Button
                title="Logout"
                onPress={handleLogout}
            />
        </View>
    );
};

export default Jobs;
