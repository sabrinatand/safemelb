import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, SafeAreaView, Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

const INCIDENT_TYPES = [
  'Threatening behaviour',
  'Weapon sighting',
  'Suspicious person',
  'Other',
];

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('Fetching location...');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationText('Location permission denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    const [address] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    if (address) {
      setLocationText(
        `${address.street ?? ''} ${address.city ?? ''}, ${address.region ?? ''}`
          .trim()
      );
    }
  };

  useState(() => { fetchLocation(); });

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Missing info', 'Please select an incident type.');
      return;
    }
    if (!coords) {
      Alert.alert('No location', 'Waiting for your location. Please try again.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('incidents').insert({
      type: selectedType,
      description,
      latitude: coords.lat,
      longitude: coords.lng,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not submit report. Please try again.');
      return;
    }
    Alert.alert('Report submitted', 'Thank you for keeping Melbourne safe.', [
      { text: 'OK', onPress: () => {
        setSelectedType('');
        setDescription('');
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report Incident</Text>
          <Text style={styles.subtitle}>
            Help keep your community safe by logging what you see
          </Text>
        </View>

        {/* Incident Type */}
        <Text style={styles.sectionLabel}>Incident type</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                selectedType === type && styles.typeChipActive,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  selectedType === type && styles.typeChipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.locationField}>
          <Ionicons name="location" size={14} color={Colors.danger} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationText}
          </Text>
          <TouchableOpacity onPress={fetchLocation}>
            <Ionicons name="refresh" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe what you observed..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Photo placeholder */}
        <Text style={styles.sectionLabel}>Photo (optional)</Text>
        <TouchableOpacity style={styles.photoZone}>
          <Ionicons name="camera" size={24} color={Colors.textTertiary} />
          <Text style={styles.photoText}>Attach a scene photo</Text>
          <Text style={styles.photoSub}>Coming in Phase 3</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Report</Text>
          )}
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Ionicons
            name="information-circle"
            size={13}
            color={Colors.textTertiary}
          />
          <Text style={styles.disclaimerText}>
            In an emergency always call 000 first
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.background },
  header:             { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16 },
  title:              { fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  subtitle:           { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  sectionLabel:       { marginHorizontal: 18, marginBottom: 8, marginTop: 14,
                        fontSize: 10, color: Colors.textTertiary,
                        textTransform: 'uppercase', letterSpacing: 0.7 },
  typeGrid:           { marginHorizontal: 18, flexDirection: 'row',
                        flexWrap: 'wrap', gap: 8 },
  typeChip:           { backgroundColor: Colors.surface, borderRadius: 8,
                        paddingVertical: 8, paddingHorizontal: 12,
                        borderWidth: 0.5, borderColor: Colors.border },
  typeChipActive:     { backgroundColor: 'rgba(224,74,74,0.1)',
                        borderColor: 'rgba(224,74,74,0.4)' },
  typeChipText:       { fontSize: 12, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.danger },
  locationField:      { marginHorizontal: 18, backgroundColor: Colors.surface,
                        borderRadius: 10, padding: 11, flexDirection: 'row',
                        alignItems: 'center', gap: 8,
                        borderWidth: 0.5, borderColor: Colors.border },
  locationText:       { flex: 1, fontSize: 12, color: Colors.textPrimary },
  textArea:           { marginHorizontal: 18, backgroundColor: Colors.surface,
                        borderRadius: 10, padding: 11, fontSize: 13,
                        color: Colors.textPrimary, height: 100,
                        textAlignVertical: 'top',
                        borderWidth: 0.5, borderColor: Colors.border },
  photoZone:          { marginHorizontal: 18, backgroundColor: Colors.surface,
                        borderRadius: 10, height: 80, alignItems: 'center',
                        justifyContent: 'center', gap: 4,
                        borderWidth: 1, borderColor: Colors.border,
                        borderStyle: 'dashed' },
  photoText:          { fontSize: 12, color: Colors.textTertiary },
  photoSub:           { fontSize: 10, color: Colors.textTertiary },
  submitBtn:          { marginHorizontal: 18, marginTop: 20,
                        backgroundColor: Colors.danger, borderRadius: 12,
                        padding: 14, alignItems: 'center' },
  submitBtnDisabled:  { opacity: 0.6 },
  submitText:         { fontSize: 14, fontWeight: '600', color: '#fff' },
  disclaimer:         { flexDirection: 'row', alignItems: 'center', gap: 5,
                        justifyContent: 'center', marginVertical: 16 },
  disclaimerText:     { fontSize: 11, color: Colors.textTertiary },
});