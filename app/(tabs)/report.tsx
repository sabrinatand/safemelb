import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert,
  ActivityIndicator, Modal, FlatList,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

type IncidentType = {
  label: string;
  category: string;
  severity: 'serious' | 'warning' | 'info';
  icon: string;
};

const INCIDENT_TYPES: IncidentType[] = [
  // Serious
  { label: 'Weapon sighting', category: 'Violence', severity: 'serious', icon: '🔪' },
  { label: 'Threatening behaviour', category: 'Violence', severity: 'serious', icon: '⚠️' },
  { label: 'Physical assault', category: 'Violence', severity: 'serious', icon: '🚨' },
  { label: 'Armed robbery', category: 'Violence', severity: 'serious', icon: '🔫' },
  // Warning
  { label: 'Suspicious person', category: 'Suspicious', severity: 'warning', icon: '👁' },
  { label: 'Suspicious vehicle', category: 'Suspicious', severity: 'warning', icon: '🚗' },
  { label: 'Suspicious package', category: 'Suspicious', severity: 'warning', icon: '📦' },
  { label: 'Theft / pickpocket', category: 'Theft', severity: 'warning', icon: '💳' },
  { label: 'Break and enter', category: 'Theft', severity: 'warning', icon: '🏠' },
  { label: 'Vandalism / graffiti', category: 'Property', severity: 'warning', icon: '🖊️' },
  // Info
  { label: 'Harassment', category: 'Antisocial', severity: 'info', icon: '🗣️' },
  { label: 'Drug activity', category: 'Antisocial', severity: 'info', icon: '💊' },
  { label: 'Unsafe road conditions', category: 'Hazard', severity: 'info', icon: '🚧' },
  { label: 'Other', category: 'Other', severity: 'info', icon: '📋' },
];

const SEVERITY_COLORS = {
  serious: Colors.danger,
  warning: Colors.warning,
  info:    Colors.info,
};

const SEVERITY_LABELS = {
  serious: 'Serious',
  warning: 'Warning',
  info:    'Info',
};

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('Fetching location...');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchLocation = async () => {
    setLocationText('Fetching location...');
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
        `${address.street ?? ''} ${address.city ?? ''}, ${address.region ?? ''}`.trim()
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
      type: selectedType.label,
      description,
      latitude: coords.lat,
      longitude: coords.lng,
      severity: selectedType.severity,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not submit report. Please try again.');
      return;
    }
    Alert.alert(
      '✅ Report submitted',
      'Thank you for keeping Melbourne safe.',
      [{ text: 'OK', onPress: () => { setSelectedType(null); setDescription(''); } }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report Incident</Text>
          <Text style={styles.subtitle}>
            Help keep your community safe by logging what you see
          </Text>
        </View>

        {/* Incident Type Dropdown */}
        <Text style={styles.sectionLabel}>Incident type</Text>
        <TouchableOpacity
          style={[styles.dropdown, dropdownOpen && styles.dropdownOpen]}
          onPress={() => setDropdownOpen(!dropdownOpen)}
          activeOpacity={0.8}
        >
          {selectedType ? (
            <View style={styles.dropdownSelected}>
              <Text style={styles.dropdownIcon}>{selectedType.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dropdownSelectedText}>{selectedType.label}</Text>
                <Text style={styles.dropdownCategory}>{selectedType.category}</Text>
              </View>
              <View style={[styles.severityBadge,
                { backgroundColor: SEVERITY_COLORS[selectedType.severity] + '20',
                  borderColor: SEVERITY_COLORS[selectedType.severity] + '50' }]}>
                <Text style={[styles.severityText,
                  { color: SEVERITY_COLORS[selectedType.severity] }]}>
                  {SEVERITY_LABELS[selectedType.severity]}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.dropdownPlaceholder}>Select incident type...</Text>
          )}
          <Ionicons
            name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Dropdown List */}
        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {INCIDENT_TYPES.map((item, index) => {
              const isFirst = index === 0 ||
                INCIDENT_TYPES[index - 1].category !== item.category;
              return (
                <View key={item.label}>
                  {isFirst && (
                    <Text style={styles.categoryLabel}>{item.category}</Text>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      selectedType?.label === item.label && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedType(item);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.dropdownItemText,
                      selectedType?.label === item.label && styles.dropdownItemTextActive,
                    ]}>
                      {item.label}
                    </Text>
                    <View style={[styles.severityDot,
                      { backgroundColor: SEVERITY_COLORS[item.severity] }]} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Location */}
        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.locationField}>
          <Ionicons name="location" size={14} color={Colors.danger} />
          <Text style={styles.locationText} numberOfLines={1}>{locationText}</Text>
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
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitText}>Submit Report</Text>
          }
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={13} color={Colors.textTertiary} />
          <Text style={styles.disclaimerText}>
            In an emergency always call 000 first
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:              { flex: 1, backgroundColor: Colors.background },
  header:                 { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16 },
  title:                  { fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  subtitle:               { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  sectionLabel:           { marginHorizontal: 18, marginBottom: 8, marginTop: 14,
                            fontSize: 10, color: Colors.textTertiary,
                            textTransform: 'uppercase', letterSpacing: 0.7 },
  dropdown:               { marginHorizontal: 18, backgroundColor: Colors.surface,
                            borderRadius: 10, padding: 12, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between',
                            borderWidth: 0.5, borderColor: Colors.border },
  dropdownOpen:           { borderColor: Colors.danger,
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownSelected:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropdownIcon:           { fontSize: 18 },
  dropdownSelectedText:   { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  dropdownCategory:       { fontSize: 10, color: Colors.textTertiary, marginTop: 1 },
  dropdownPlaceholder:    { fontSize: 13, color: Colors.textTertiary, flex: 1 },
  dropdownList:           { marginHorizontal: 18, backgroundColor: Colors.surface,
                            borderWidth: 0.5, borderTopWidth: 0, borderColor: Colors.danger,
                            borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                            overflow: 'hidden', maxHeight: 300 },
  categoryLabel:          { fontSize: 9, fontWeight: '600', color: Colors.textTertiary,
                            textTransform: 'uppercase', letterSpacing: 0.8,
                            paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4,
                            backgroundColor: Colors.surfaceLight },
  dropdownItem:           { flexDirection: 'row', alignItems: 'center', gap: 10,
                            paddingHorizontal: 14, paddingVertical: 10,
                            borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  dropdownItemActive:     { backgroundColor: 'rgba(224,74,74,0.08)' },
  dropdownItemIcon:       { fontSize: 16, width: 24, textAlign: 'center' },
  dropdownItemText:       { flex: 1, fontSize: 13, color: Colors.textSecondary },
  dropdownItemTextActive: { color: Colors.textPrimary, fontWeight: '500' },
  severityDot:            { width: 7, height: 7, borderRadius: 4 },
  severityBadge:          { paddingHorizontal: 8, paddingVertical: 2,
                            borderRadius: 20, borderWidth: 0.5 },
  severityText:           { fontSize: 10, fontWeight: '500' },
  locationField:          { marginHorizontal: 18, backgroundColor: Colors.surface,
                            borderRadius: 10, padding: 11, flexDirection: 'row',
                            alignItems: 'center', gap: 8,
                            borderWidth: 0.5, borderColor: Colors.border },
  locationText:           { flex: 1, fontSize: 12, color: Colors.textPrimary },
  textArea:               { marginHorizontal: 18, backgroundColor: Colors.surface,
                            borderRadius: 10, padding: 11, fontSize: 13,
                            color: Colors.textPrimary, height: 100,
                            textAlignVertical: 'top',
                            borderWidth: 0.5, borderColor: Colors.border },
  photoZone:              { marginHorizontal: 18, backgroundColor: Colors.surface,
                            borderRadius: 10, height: 80, alignItems: 'center',
                            justifyContent: 'center', gap: 4,
                            borderWidth: 1, borderColor: Colors.border,
                            borderStyle: 'dashed' },
  photoText:              { fontSize: 12, color: Colors.textTertiary },
  photoSub:               { fontSize: 10, color: Colors.textTertiary },
  submitBtn:              { marginHorizontal: 18, marginTop: 20,
                            backgroundColor: Colors.danger, borderRadius: 12,
                            padding: 14, alignItems: 'center' },
  submitBtnDisabled:      { opacity: 0.6 },
  submitText:             { fontSize: 14, fontWeight: '600', color: '#fff' },
  disclaimer:             { flexDirection: 'row', alignItems: 'center', gap: 5,
                            justifyContent: 'center', marginVertical: 16 },
  disclaimerText:         { fontSize: 11, color: Colors.textTertiary },
});