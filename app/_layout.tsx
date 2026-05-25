import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#E04A4A',
      tabBarStyle: { backgroundColor: '#111118' },
      headerShown: false,
    }}>
      <Tabs.Screen name="index"
        options={{ title: 'Map',
          tabBarIcon: ({ color }) =>
            <Ionicons name="map" size={22} color={color} /> }} />
      <Tabs.Screen name="report"
        options={{ title: 'Report',
          tabBarIcon: ({ color }) =>
            <Ionicons name="shield" size={22} color={color} /> }} />
      <Tabs.Screen name="tips"
        options={{ title: 'Tips',
          tabBarIcon: ({ color }) =>
            <Ionicons name="information-circle" size={22} color={color} /> }} />
    </Tabs>
  );
}