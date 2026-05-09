import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ label, value, unit, icon: Icon, color = '#43A047', bg = '#E8F5E9' }) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        {Icon && <Icon color={color} size={18} strokeWidth={2} />}
      </View>
      <Text style={[styles.value, { color }]}>
        {value}
        <Text style={styles.unit}> {unit}</Text>
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
});
