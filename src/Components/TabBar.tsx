import { Text, View } from "react-native";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

const Tabs = AnimatedTabBarNavigator();

const tabbbar = () => {

    const HomeScreen = () => {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home Screen</Text>
          </View>
        );
      };
      
      const DetailScreen = () => {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Detail Screen</Text>
          </View>
        );
      };


    return(
    <Tabs.Navigator 
        appearance={{
        floating: true, // or false depending on your design
        tabBarBackground: '#FFFFFF',
      }}
    >
        <Tabs.Screen
        name="Home"
        component={HomeScreen}
        // You can customize the icon and label here if needed
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            // Your custom icon component for Home tab
            <Text>Home Icon</Text>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="Detail"
        component={DetailScreen}
        // You can customize the icon and label here if needed
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            // Your custom icon component for Detail tab
            <Text>Detail Icon</Text>
          ),
          tabBarLabel: 'Detail',
        }}
      />

    </Tabs.Navigator>
    )
}

export default tabbbar;