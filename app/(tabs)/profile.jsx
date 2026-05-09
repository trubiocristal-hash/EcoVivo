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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { volunteerProfile } from '@/mock_data/history';
import { getCollectionHistory } from '@/services/WasteService';
import { monthlyDiversionData } from '@/mock_data/stats';
import {
  Award, Star, TrendingUp, Users, LogOut,
  ChevronRight, Shield, Bell, Circle as HelpCircle,
  Download,
} from 'lucide-react-native';

const STATUS_H = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24);

const badgeIconMap = {
  award:        Award,
  'trending-up': TrendingUp,
  star:         Star,
  users:        Users,
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router           = useRouter();

  // ── Estado local reactivo — se sincroniza al ganar foco ──────────────────
  const [profile, setProfile] = useState(() => ({ ...volunteerProfile }));

  useFocusEffect(
    useCallback(() => {
      // volunteerProfile es mutado directamente por appendCollectionRecord()
      // en history.js, así que hacemos un spread para forzar un nuevo objeto
      // de referencia y que React detecte el cambio de estado.
      setProfile({ ...volunteerProfile });
    }, [])
  );

  // ── Puente de exportación CSV — insumo para sistema externo en C ─────────
  const handleExportData = () => {
    const records = getCollectionHistory();

    // Encabezado fijo de columnas
    const CSV_HEADER = 'id,date,category,kilos,location';

    // Una línea por registro.
    // Regla crítica: las comas internas de `location` se reemplazan por
    // " -" para no romper la estructura de columnas al parsear en C con strtok().
    const csvRows = records.map((r) => {
      const safeLocation = r.location.replace(/,/g, ' -');
      return `${r.id},${r.date},${r.category},${r.kilos},${safeLocation}`;
    });

    const csvString = [CSV_HEADER, ...csvRows].join('\n');

    // Etiqueta clara para captura desde herramientas externas o Metro
    console.log('[EcoVivo_CSV_Export]\n' + csvString);

    // Alert con el CSV crudo — legible línea por línea desde C con fgets()
    Alert.alert(
      'Exportar Datos de Memoria',
      csvString,
      [{ text: 'Cerrar', style: 'cancel' }],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.root}>
      {/* ── Encabezado con foto de fondo ─────────────────────────────────── */}
      <View style={styles.header}>
        <Image
          source={{ uri: profile.avatar }}
          style={styles.headerBg}
          blurRadius={8}
        />
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.roleWrap}>
            <Shield color="#A5D6A7" size={12} />
            <Text style={styles.role}>{profile.role}</Text>
          </View>
          <View style={styles.levelWrap}>
            <Star color="#FFE082" size={13} fill="#FFE082" />
            <Text style={styles.level}>{profile.level}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Barra de nivel ──────────────────────────────────────────────── */}
        <View style={styles.levelCard}>
          <View style={styles.levelCardTop}>
            <Text style={styles.levelCardLabel}>Progreso de nivel</Text>
            <Text style={styles.levelCardPct}>{profile.levelProgress}%</Text>
          </View>
          <View style={styles.levelTrack}>
            <View style={[styles.levelBar, { width: `${profile.levelProgress}%` }]} />
          </View>
          <Text style={styles.levelCaption}>
            {100 - profile.levelProgress}% para alcanzar "Eco Leyenda"
          </Text>
        </View>

        {/* ── Totales acumulados — reactivos al estado `profile` ───────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.totalKilos.toFixed(1)}</Text>
            <Text style={styles.statUnit}>kg</Text>
            <Text style={styles.statLabel}>Total recolectado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#FB8C00' }]}>
              {profile.totalPoints.toLocaleString()}
            </Text>
            <Text style={styles.statUnit}>pts</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#1E88E5' }]}>
              {profile.totalCollections}
            </Text>
            <Text style={styles.statUnit}> </Text>
            <Text style={styles.statLabel}>Recolecciones</Text>
          </View>
        </View>

        {/* ── Insignias ───────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insignias ganadas</Text>
          <View style={styles.badgesRow}>
            {profile.badges.map((badge) => {
              const Icon = badgeIconMap[badge.icon] || Award;
              return (
                <View key={badge.id} style={styles.badge}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color + '22' }]}>
                    <Icon color={badge.color} size={22} fill={badge.color + '44'} />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Tasa de desvío mensual ──────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasa de desvío mensual</Text>
          <View style={styles.trendCard}>
            {monthlyDiversionData.map((d, i) => (
              <View key={i} style={styles.trendItem}>
                <View style={styles.trendBarWrap}>
                  <View
                    style={[
                      styles.trendBar,
                      {
                        height: (d.value / 100) * 60,
                        backgroundColor:
                          i === monthlyDiversionData.length - 1 ? '#43A047' : '#C8E6C9',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.trendValue}>{d.value}%</Text>
                <Text style={styles.trendLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Botón de exportación — Puente a sistema externo en C ─────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Herramientas</Text>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportData}
            activeOpacity={0.85}
          >
            <View style={styles.exportIconWrap}>
              <Download color="#1E88E5" size={20} />
            </View>
            <View style={styles.exportTextWrap}>
              <Text style={styles.exportLabel}>Exportar Datos de Memoria</Text>
              <Text style={styles.exportSub}>
                Genera CSV completo del historial en memoria
              </Text>
            </View>
            <ChevronRight color="#1E88E5" size={16} />
          </TouchableOpacity>
        </View>

        {/* ── Menú de cuenta ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.menuCard}>
            {[
              { icon: Bell,        label: 'Notificaciones', sub: 'Alertas y recordatorios' },
              { icon: Shield,      label: 'Privacidad',     sub: 'Configuración de datos' },
              { icon: HelpCircle,  label: 'Ayuda',          sub: 'Soporte y preguntas' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <View key={i}>
                  {i > 0 && <View style={styles.menuDivider} />}
                  <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                    <View style={styles.menuIconWrap}>
                      <Icon color="#43A047" size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSub}>{item.sub}</Text>
                    </View>
                    <ChevronRight color="#BDBDBD" size={16} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut color="#E53935" size={18} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.footerMeta}>
          <Text style={styles.footerText}>Ecovivo · Mundial 2026</Text>
          <Text style={styles.footerVersion}>v1.0.0 MVP</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#F4F7F4' },
  header: { height: 240, justifyContent: 'flex-end', overflow: 'hidden' },
  headerBg:      { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,31,15,0.75)' },
  headerContent: { paddingTop: STATUS_H, alignItems: 'center', paddingBottom: 24, zIndex: 1 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: '#4CAF50', marginBottom: 10,
  },
  name:      { color: '#fff', fontSize: 20, fontWeight: '800' },
  roleWrap:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  role:      { color: '#A5D6A7', fontSize: 12 },
  levelWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  level:     { color: '#FFE082', fontSize: 12, fontWeight: '700' },
  scroll:    { padding: 16, gap: 16, paddingBottom: 40 },
  levelCard: {
    backgroundColor: '#1B5E20', borderRadius: 16,
    padding: 16, marginTop: -20, gap: 8,
  },
  levelCardTop:   { flexDirection: 'row', justifyContent: 'space-between' },
  levelCardLabel: { color: '#A5D6A7', fontSize: 13 },
  levelCardPct:   { color: '#69F0AE', fontSize: 13, fontWeight: '700' },
  levelTrack: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3, overflow: 'hidden',
  },
  levelBar:    { height: '100%', backgroundColor: '#69F0AE', borderRadius: 3 },
  levelCaption: { color: '#81C784', fontSize: 11 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statBox:     { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 22, fontWeight: '900', color: '#2E7D32' },
  statUnit:    { fontSize: 12, color: '#9E9E9E' },
  statLabel:   { fontSize: 11, color: '#9E9E9E', textAlign: 'center', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#F5F5F5' },
  section:     {},
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1B2E1D', marginBottom: 10 },
  badgesRow: { flexDirection: 'row', gap: 12 },
  badge:     { flex: 1, alignItems: 'center', gap: 6 },
  badgeIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeName: { fontSize: 10, color: '#757575', textAlign: 'center', fontWeight: '600' },
  trendCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  trendItem:   { flex: 1, alignItems: 'center', gap: 4 },
  trendBarWrap: { height: 60, justifyContent: 'flex-end', width: '60%' },
  trendBar:    { width: '100%', borderRadius: 4, minHeight: 4 },
  trendValue:  { fontSize: 11, fontWeight: '700', color: '#424242' },
  trendLabel:  { fontSize: 10, color: '#9E9E9E' },

  // ── Botón de exportación ────────────────────────────────────────────────
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#E3F2FD', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#90CAF9',
  },
  exportIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1E88E5', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 2,
  },
  exportTextWrap: { flex: 1 },
  exportLabel: { fontSize: 14, fontWeight: '700', color: '#1565C0' },
  exportSub:   { fontSize: 11, color: '#1E88E5', marginTop: 2 },

  menuCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel:   { fontSize: 14, fontWeight: '600', color: '#1B2E1D' },
  menuSub:     { fontSize: 12, color: '#9E9E9E', marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 62 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFEBEE', borderRadius: 14, paddingVertical: 14,
  },
  logoutText:    { color: '#E53935', fontSize: 15, fontWeight: '700' },
  footerMeta:    { alignItems: 'center', gap: 2 },
  footerText:    { fontSize: 12, color: '#9E9E9E', fontWeight: '600' },
  footerVersion: { fontSize: 11, color: '#BDBDBD' },
});
