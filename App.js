import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { style } from "./App.style";
import { Logo } from "./components/logo/logo";
import { Navbar } from "./components/navbar/navbar";
import { Room, Jobs, MarketPlace, Sports } from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Rooms" component={Room} />
            <Tab.Screen name="Jobs" component={Jobs} />
            <Tab.Screen name="Sports" component={Sports} />
            <Tab.Screen name="Marketplace" component={MarketPlace} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
