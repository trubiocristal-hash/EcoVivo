import { View, Text, StyleSheet } from 'react-native';

export default function DonutChart({ percentage, size = 100, color = '#43A047', label }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 100) * circumference;
  const segments = 32;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: '#E8F5E9' }]}>
        <View
          style={[
            styles.fill,
            {
              width: size - 16,
              height: size - 16,
              borderRadius: (size - 16) / 2,
              borderColor: color,
              borderTopColor: percentage > 75 ? color : '#E8F5E9',
              borderRightColor: percentage > 25 ? color : '#E8F5E9',
              borderBottomColor: percentage > 50 ? color : '#E8F5E9',
              borderLeftColor: percentage > 75 ? color : '#E8F5E9',
            },
          ]}
        />
      </View>
      <View style={styles.center}>
        <Text style={[styles.pct, { color }]}>{percentage}%</Text>
        {label ? <Text style={styles.lbl}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    borderWidth: 8,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  pct: { fontSize: 22, fontWeight: '800' },
  lbl: { fontSize: 10, color: '#9E9E9E', marginTop: 2 },
});
