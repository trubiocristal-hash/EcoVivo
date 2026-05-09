import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCollectionHistory } from '@/services/WasteService';
import { Check, Clock, Scale, MapPin, Award } from 'lucide-react-native';

const STATUS_H = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24);

// Etiquetas legibles por fecha relativa
const DATE_LABELS = {
  '2026-05-09': 'Hoy',
  '2026-05-08': 'Ayer',
  '2026-05-07': 'Hace 2 días',
};

const getDateLabel = (date) => DATE_LABELS[date] ?? date;

export default function HistoryScreen() {
  // ── Estado local reactivo ─────────────────────────────────────────────────
  const [history, setHistory] = useState(() => getCollectionHistory());

  useFocusEffect(
    useCallback(() => {
      // Cada vez que la tab gana foco, sincroniza con la store en memoria
      setHistory(getCollectionHistory());
    }, [])
  );

  // ── Totales derivados: viven dentro del componente, reaccionan al estado ──
  const totalKilos  = history.reduce((s, c) => s + c.kilos,  0);
  const totalPoints = history.reduce((s, c) => s + c.points, 0);

  // Agrupación por fecha, ordenada de más reciente a más antigua
  const groupedByDate = history.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.root}>
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Historial</Text>
        <Text style={styles.headerSub}>Registro de recolecciones</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Scale color="#A5D6A7" size={16} />
            <Text style={styles.summaryValue}>{totalKilos.toFixed(1)} kg</Text>
            <Text style={styles.summaryLabel}>Total recolectado</Text>
          </View>
          <View style={styles.summaryDiv} />
          <View style={styles.summaryItem}>
            <Award color="#FFE082" size={16} />
            <Text style={styles.summaryValue}>{totalPoints}</Text>
            <Text style={styles.summaryLabel}>Puntos ganados</Text>
          </View>
          <View style={styles.summaryDiv} />
          <View style={styles.summaryItem}>
            <Check color="#80DEEA" size={16} />
            <Text style={styles.summaryValue}>{history.length}</Text>
            <Text style={styles.summaryLabel}>Recolecciones</Text>
          </View>
        </View>
      </View>

      {/* ── Lista agrupada por fecha ─────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {Object.entries(groupedByDate).map(([date, items]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{getDateLabel(date)}</Text>

            {items.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={[styles.categoryStripe, { backgroundColor: item.categoryColor }]} />
                <View style={styles.cardContent}>
                  {/* Fila superior */}
                  <View style={styles.cardTop}>
                    <View>
                      <View style={styles.catRow}>
                        <View style={[styles.catDot, { backgroundColor: item.categoryColor }]} />
                        <Text style={[styles.catName, { color: item.categoryColor }]}>
                          {item.category}
                        </Text>
                      </View>
                      <View style={styles.locationRow}>
                        <MapPin color="#9E9E9E" size={11} />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                      ) : (
                        <View style={[styles.noThumb, { backgroundColor: item.categoryColor + '22' }]}>
                          <Clock color={item.categoryColor} size={18} />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Fila inferior */}
                  <View style={styles.cardBottom}>
                    <View style={styles.kilosWrap}>
                      <Text style={[styles.kilosValue, { color: item.categoryColor }]}>
                        {item.kilos}
                      </Text>
                      <Text style={styles.kilosUnit}> kg</Text>
                    </View>
                    <View style={styles.bottomRight}>
                      <View
                        style={[
                          styles.statusBadge,
                          item.status === 'verified' ? styles.statusVerified : styles.statusPending,
                        ]}
                      >
                        {item.status === 'verified' ? (
                          <Check color="#2E7D32" size={10} strokeWidth={3} />
                        ) : (
                          <Clock color="#FB8C00" size={10} />
                        )}
                        <Text
                          style={[
                            styles.statusText,
                            item.status === 'verified'
                              ? styles.statusTextVerified
                              : styles.statusTextPending,
                          ]}
                        >
                          {item.status === 'verified' ? 'Verificado' : 'Pendiente'}
                        </Text>
                      </View>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                  </View>

                  <View style={styles.pointsRow}>
                    <Award color="#FB8C00" size={12} />
                    <Text style={styles.pointsText}>+{item.points} puntos</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F7F4' },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: STATUS_H + 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle:  { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub:    { color: '#A5D6A7', fontSize: 12, marginTop: 2, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 14, alignItems: 'center',
  },
  summaryItem:  { flex: 1, alignItems: 'center', gap: 4 },
  summaryValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  summaryLabel: { color: '#A5D6A7', fontSize: 10, textAlign: 'center' },
  summaryDiv:   { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  scroll:       { padding: 16, gap: 8 },
  dateGroup:    { gap: 10, marginBottom: 8 },
  dateLabel:    { fontSize: 13, fontWeight: '700', color: '#757575', paddingLeft: 4 },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  categoryStripe: { width: 4 },
  cardContent:    { flex: 1, padding: 14, gap: 8 },
  cardTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  catRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  catDot:         { width: 8, height: 8, borderRadius: 4 },
  catName:        { fontSize: 14, fontWeight: '700' },
  locationRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText:   { fontSize: 11, color: '#9E9E9E', maxWidth: 180 },
  cardRight:      {},
  thumb:          { width: 56, height: 56, borderRadius: 10 },
  noThumb:        { width: 56, height: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardBottom:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kilosWrap:      { flexDirection: 'row', alignItems: 'baseline' },
  kilosValue:     { fontSize: 22, fontWeight: '900' },
  kilosUnit:      { fontSize: 13, color: '#9E9E9E', fontWeight: '500' },
  bottomRight:    { alignItems: 'flex-end', gap: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  statusVerified:     { backgroundColor: '#E8F5E9' },
  statusPending:      { backgroundColor: '#FFF3E0' },
  statusText:         { fontSize: 11, fontWeight: '600' },
  statusTextVerified: { color: '#2E7D32' },
  statusTextPending:  { color: '#FB8C00' },
  timeText:   { fontSize: 11, color: '#9E9E9E' },
  pointsRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsText: { fontSize: 12, color: '#FB8C00', fontWeight: '600' },
});
