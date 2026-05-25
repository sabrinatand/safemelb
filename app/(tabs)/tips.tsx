import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Tips, type Tip } from '../../constants/Tips';

const CATEGORIES = ['all', 'awareness', 'escape', 'tools'] as const;
type Category = typeof CATEGORIES[number];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  awareness: { bg: 'rgba(64,200,112,0.12)', text: '#40C870' },
  escape:    { bg: 'rgba(74,144,232,0.12)', text: '#4A90E8' },
  tools:     { bg: 'rgba(240,160,48,0.12)', text: '#F0A030' },
};

export default function TipsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered = activeCategory === 'all'
    ? Tips
    : Tips.filter((t) => t.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Safety Tips</Text>
        <Text style={styles.subtitle}>
          Practical advice for staying safe in Melbourne
        </Text>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === cat && styles.tabTextActive,
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tips list */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filtered.map((tip: Tip) => (
          <View key={tip.id} style={styles.card}>
            <View
              style={[
                styles.tag,
                { backgroundColor: TAG_COLORS[tip.category].bg },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: TAG_COLORS[tip.category].text },
                ]}
              >
                {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
              </Text>
            </View>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            <Text style={styles.cardBody}>{tip.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  header:         { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 },
  title:          { fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  subtitle:       { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  tabsContainer:  { 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    gap: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tab:            { 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 20,
    borderWidth: 0.5, 
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    height: 32,
    justifyContent: 'center',
  },
  tabActive:      { backgroundColor: 'rgba(224,74,74,0.1)',
                    borderColor: 'rgba(224,74,74,0.4)' },
  tabText:        { fontSize: 12, color: Colors.textSecondary },
  tabTextActive:  { color: Colors.danger },
  list:           { flex: 1, paddingHorizontal: 18 },
  card:           { backgroundColor: Colors.surface, borderRadius: 14,
                    padding: 14, marginBottom: 10,
                    borderWidth: 0.5, borderColor: Colors.border },
  tag:            { alignSelf: 'flex-start', paddingVertical: 2,
                    paddingHorizontal: 8, borderRadius: 20, marginBottom: 7 },
  tagText:        { fontSize: 10, fontWeight: '500' },
  cardTitle:      { fontSize: 13, fontWeight: '500',
                    color: Colors.textPrimary, marginBottom: 5 },
  cardBody:       { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
});