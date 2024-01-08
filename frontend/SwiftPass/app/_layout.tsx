import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './Navigators/HomeStackNavigator';
import TicketStackNavigator from './Navigators/TicketStackNavigator';
import ProfileScreen from './Screens/ProfileScreen';
import OrganiserStackNavigator from './Navigators/OrganiserStackNavigator';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const Tab = createBottomTabNavigator();
// change this to true to see the Organiser tab
// get the info from the backend
const isOrganiser = false;

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer independent={true}>
        <Tab.Navigator initialRouteName='Home'>
          <Tab.Screen
            name="Home"
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            }}
            component={HomeStackNavigator}
          />
          <Tab.Screen
            name="Tickets"
            options={{
              title: 'Tickets',
              tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
            }}
            component={TicketStackNavigator}
          />
          <Tab.Screen
            name="Profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
            }}
            component={ProfileScreen}
          />

          {isOrganiser && (
            <Tab.Screen
              name="Organiser"
              options={{
                title: 'Organiser',
                tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
              }}
              component={OrganiserStackNavigator}
            />
          )}

        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
