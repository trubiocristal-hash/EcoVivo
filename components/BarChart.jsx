import { View, Text, StyleSheet } from 'react-native';

export default function BarChart({ data, height = 100, color = '#43A047', labelColor = '#9E9E9E' }) {
  const maxVal = Math.max(...data.map((d) => d.kilos));

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, idx) => {
          const barH = (item.kilos / maxVal) * (height - 20);
          return (
            <View key={idx} style={styles.barGroup}>
              <View style={[styles.bar, { height: barH, backgroundColor: color }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((item, idx) => (
          <Text key={idx} style={[styles.label, { color: labelColor }]}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 6,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
  },
});
