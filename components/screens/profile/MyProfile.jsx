import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { style } from "./myprofile.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../auth/AuthContext"; // Adjust the import path to your AuthContext
import { useNavigation } from "@react-navigation/native";
const MyProfile = () => {
  const inset = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  console.log("rendering MyProfile page");

  return (
    <View
      style={[
        style.marketplace,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          paddingLeft: inset.left,
          paddingRight: inset.right,
        },
      ]}
    >
      {user ? (
        <>
          <Text>Welcome, {user.username}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Button
            title="Login"
            onPress={() =>
              navigation.navigate("Login", { fromScreen: "Profile" })
            }
          />
          <Button
            title="Sign Up"
            onPress={() =>
              navigation.navigate("SignUp", { fromScreen: "Profile" })
            }
          />
        </>
      )}
    </View>
  );
};

export default MyProfile;
