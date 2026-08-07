import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

type Incident = {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  severity?: 'serious' | 'warning' | 'info';
};

const PIN_COLORS: Record<string, string> = {
  serious: Colors.danger,
  warning: Colors.warning,
  info:    Colors.info,
};

const isRecent = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 24 * 60 * 60 * 1000; // within 24 hours
};

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchIncidents();
    }, [])
  );

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location access is needed for the map.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  const fetchIncidents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      // Only show incidents from last 24 hours
      const recent = data.filter((inc: Incident) => isRecent(inc.created_at));
      setIncidents(recent);
    }
    setLoading(false);
  };

  const dismissIncident = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visibleIncidents = incidents.filter(inc => !dismissed.has(inc.id));

  const getPinColor = (inc: Incident) => {
    if (inc.severity) return PIN_COLORS[inc.severity] ?? Colors.warning;
    if (inc.type === 'Weapon sighting' || inc.type === 'Threatening behaviour'
      || inc.type === 'Physical assault' || inc.type === 'Armed robbery') {
      return Colors.danger;
    }
    return Colors.warning;
  };

  const handleSOS = () => {
    Alert.alert(
      'Call Emergency Services?',
      'This will call 000 and share your location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 000', style: 'destructive',
          onPress: () => Alert.alert('Calling 000...') },
      ]
    );
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr ago`;
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening</Text>
          <Text style={styles.appTitle}>SafeMelb</Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={12} color={Colors.danger} />
          <Text style={styles.locationText}>Melbourne, VIC</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.coords.latitude ?? -37.8136,
            longitude: location?.coords.longitude ?? 144.9631,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={darkMapStyle}
        >
          {visibleIncidents.map((inc) => (
            <Marker
              key={inc.id}
              coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
              pinColor={getPinColor(inc)}
              title={inc.type}
              description={inc.description ?? ''}
            />
          ))}
        </MapView>
        <View style={styles.incidentBadge}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.danger} />
          ) : (
            <Text style={styles.incidentBadgeText}>
              {visibleIncidents.length} nearby
            </Text>
          )}
        </View>
        <View style={styles.mapNote}>
          <Ionicons name="time-outline" size={10} color={Colors.textTertiary} />
          <Text style={styles.mapNoteText}>Showing last 24 hrs</Text>
        </View>
      </View>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <View style={styles.sosIcon}>
          <Ionicons name="call" size={18} color="#fff" />
        </View>
        <View>
          <Text style={styles.sosTitle}>Emergency SOS</Text>
          <Text style={styles.sosSubtitle}>Call 000 · Share your location</Text>
        </View>
        <Ionicons name="chevron-forward" size={18}
          color="rgba(255,255,255,0.5)" style={styles.sosArrow} />
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}
          onPress={() => router.push('/report')}>
          <Ionicons name="clipboard" size={20} color={Colors.textSecondary} />
          <Text style={styles.quickTitle}>Report Incident</Text>
          <Text style={styles.quickSub}>Log a safety concern</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard}
          onPress={() => router.push('/tips')}>
          <Ionicons name="shield" size={20} color={Colors.textSecondary} />
          <Text style={styles.quickTitle}>Safety Tips</Text>
          <Text style={styles.quickSub}>Stay prepared</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Alerts */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent alerts near you</Text>
        {dismissed.size > 0 && (
          <TouchableOpacity onPress={() => setDismissed(new Set())}>
            <Text style={styles.restoreText}>Restore all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={Colors.danger} />
            <Text style={styles.emptyText}>Fetching incidents...</Text>
          </View>
        ) : visibleIncidents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.emptyText}>No incidents reported nearby</Text>
            <Text style={styles.emptySubText}>Only incidents from the last 24 hours are shown</Text>
          </View>
        ) : (
          visibleIncidents.slice(0, 5).map((inc) => (
            <View key={inc.id} style={[styles.alertCard,
              { borderLeftColor: getPinColor(inc) }]}>
              <View style={[styles.alertDot,
                { backgroundColor: getPinColor(inc) }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{inc.type}</Text>
                <Text style={styles.alertSub}>{getTimeAgo(inc.created_at)}</Text>
              </View>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => dismissIncident(inc.id)}
              >
                <Ionicons name="close" size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#252535' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.background },
  header:            { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 },
  greeting:          { fontSize: 11, color: Colors.textTertiary },
  appTitle:          { fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  locationRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  locationText:      { fontSize: 11, color: Colors.textSecondary },
  mapContainer:      { marginHorizontal: 18, borderRadius: 14, overflow: 'hidden',
                       height: 160, borderWidth: 0.5, borderColor: Colors.border },
  map:               { flex: 1 },
  incidentBadge:     { position: 'absolute', top: 8, right: 10,
                       backgroundColor: 'rgba(224,74,74,0.15)',
                       borderWidth: 0.5, borderColor: 'rgba(224,74,74,0.3)',
                       borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
                       minWidth: 32, alignItems: 'center' },
  incidentBadgeText: { fontSize: 10, color: Colors.danger, fontWeight: '500' },
  mapNote:           { position: 'absolute', bottom: 7, left: 10,
                       flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapNoteText:       { fontSize: 8, color: Colors.textTertiary },
  sosButton:         { marginHorizontal: 18, marginTop: 12, backgroundColor: Colors.danger,
                       borderRadius: 14, padding: 14, flexDirection: 'row',
                       alignItems: 'center', gap: 10 },
  sosIcon:           { width: 34, height: 34, borderRadius: 17,
                       backgroundColor: 'rgba(255,255,255,0.15)',
                       alignItems: 'center', justifyContent: 'center' },
  sosTitle:          { fontSize: 13, fontWeight: '600', color: '#fff' },
  sosSubtitle:       { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  sosArrow:          { marginLeft: 'auto' },
  quickGrid:         { marginHorizontal: 18, marginTop: 10, flexDirection: 'row', gap: 10 },
  quickCard:         { flex: 1, backgroundColor: Colors.surface, borderRadius: 12,
                       padding: 12, borderWidth: 0.5, borderColor: Colors.border },
  quickTitle:        { fontSize: 11, color: Colors.textPrimary, fontWeight: '500', marginTop: 6 },
  quickSub:          { fontSize: 9, color: Colors.textTertiary, marginTop: 2 },
  sectionRow:        { flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'space-between',
                       marginHorizontal: 18, marginTop: 14, marginBottom: 8 },
  sectionTitle:      { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
  restoreText:       { fontSize: 11, color: Colors.info },
  alertList:         { flex: 1, paddingHorizontal: 18 },
  alertCard:         { backgroundColor: Colors.surface, borderRadius: 10,
                       padding: 10, marginBottom: 8, flexDirection: 'row',
                       alignItems: 'center', gap: 8, borderLeftWidth: 2 },
  alertDot:          { width: 6, height: 6, borderRadius: 3 },
  alertTitle:        { fontSize: 11, color: '#ccc', fontWeight: '500' },
  alertSub:          { fontSize: 9, color: Colors.textTertiary, marginTop: 2 },
  dismissBtn:        { padding: 4 },
  emptyState:        { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText:         { fontSize: 12, color: Colors.textSecondary },
  emptySubText:      { fontSize: 11, color: Colors.textTertiary, textAlign: 'center' },
});