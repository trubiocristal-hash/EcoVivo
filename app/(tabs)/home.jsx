import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { todayStats, weeklyData, categoryBreakdown } from '@/mock_data/stats';
import BarChart from '@/components/BarChart';
import StatCard from '@/components/StatCard';
import {
  Scale,
  Recycle,
  Users,
  Leaf,
  ChevronRight,
  Bell,
  TrendingUp,
} from 'lucide-react-native';

const STATUS_H = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24);

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const progressPct = Math.round((todayStats.kilosCollected / todayStats.goal) * 100);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Buenos días,</Text>
            <Text style={styles.name}>{user?.name?.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn}>
              <Bell color="#fff" size={20} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          </View>
        </View>
        <View style={styles.locationRow}>
          <Leaf color="#A5D6A7" size={13} />
          <Text style={styles.location}>{user?.stadium} · Mundial 2026</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <View style={styles.heroCardTop}>
            <View>
              <Text style={styles.heroLabel}>Kilos recolectados hoy</Text>
              <View style={styles.heroValueRow}>
                <Text style={styles.heroValue}>{todayStats.kilosCollected}</Text>
                <Text style={styles.heroUnit}>kg</Text>
              </View>
              <Text style={styles.heroGoal}>Meta: {todayStats.goal} kg</Text>
            </View>
            <View style={styles.donut}>
              <View style={[styles.donutRing, { borderColor: '#A5D6A7' }]}>
                <Text style={styles.donutPct}>{progressPct}%</Text>
                <Text style={styles.donutLbl}>meta</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressCaption}>
            {todayStats.goal - todayStats.kilosCollected} kg restantes para la meta diaria
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Tasa de desvío"
            value={todayStats.diversionRate}
            unit="%"
            icon={TrendingUp}
            color="#43A047"
            bg="#E8F5E9"
          />
          <StatCard
            label="CO₂ ahorrado"
            value={todayStats.co2Saved}
            unit="kg"
            icon={Leaf}
            color="#00ACC1"
            bg="#E0F7FA"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Recolecciones"
            value={todayStats.collectionsCount}
            unit="hoy"
            icon={Recycle}
            color="#FB8C00"
            bg="#FFF3E0"
          />
          <StatCard
            label="Voluntarios activos"
            value={todayStats.volunteersActive}
            unit="now"
            icon={Users}
            color="#1E88E5"
            bg="#E3F2FD"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recolección semanal</Text>
            <Text style={styles.sectionSub}>kg por día</Text>
          </View>
          <View style={styles.chartCard}>
            <BarChart data={weeklyData} height={120} color="#43A047" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Composición de residuos</Text>
            <Text style={styles.sectionSub}>hoy</Text>
          </View>
          <View style={styles.compCard}>
            {categoryBreakdown.map((cat) => (
              <View key={cat.name} style={styles.compRow}>
                <View style={[styles.compDot, { backgroundColor: cat.color }]} />
                <Text style={styles.compName}>{cat.name}</Text>
                <View style={styles.compTrack}>
                  <View
                    style={[
                      styles.compFill,
                      { width: `${cat.percentage}%`, backgroundColor: cat.color },
                    ]}
                  />
                </View>
                <Text style={[styles.compPct, { color: cat.color }]}>{cat.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(tabs)/collect')}
          activeOpacity={0.85}
        >
          <Recycle color="#fff" size={22} strokeWidth={2} />
          <Text style={styles.ctaBtnText}>Iniciar nueva recolección</Text>
          <ChevronRight color="#fff" size={20} />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F7F4' },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: STATUS_H + 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { color: '#A5D6A7', fontSize: 14 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#1B5E20',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4CAF50' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  location: { color: '#A5D6A7', fontSize: 12 },
  scroll: { padding: 16, gap: 16 },
  heroCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    padding: 20,
    marginTop: -8,
  },
  heroCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { color: '#A5D6A7', fontSize: 13, marginBottom: 4 },
  heroValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  heroValue: { color: '#fff', fontSize: 44, fontWeight: '900', lineHeight: 48 },
  heroUnit: { color: '#A5D6A7', fontSize: 20, fontWeight: '600', marginBottom: 6 },
  heroGoal: { color: '#81C784', fontSize: 12, marginTop: 4 },
  donut: { alignItems: 'center', justifyContent: 'center' },
  donutRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPct: { color: '#fff', fontSize: 18, fontWeight: '800' },
  donutLbl: { color: '#A5D6A7', fontSize: 10 },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#69F0AE',
    borderRadius: 3,
  },
  progressCaption: { color: '#A5D6A7', fontSize: 11, marginTop: 6 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1B2E1D' },
  sectionSub: { fontSize: 12, color: '#9E9E9E' },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  compCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  compRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compDot: { width: 8, height: 8, borderRadius: 4 },
  compName: { fontSize: 13, color: '#424242', width: 90 },
  compTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  compFill: { height: '100%', borderRadius: 3 },
  compPct: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
  ctaBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1, textAlign: 'center' },
});
