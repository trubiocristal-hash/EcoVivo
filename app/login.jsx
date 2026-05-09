import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Recycle, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (ok) router.replace('/(tabs)/home');
  };

  const fillDemo = () => {
    setEmail('maria@ecovivo.mx');
    setPassword('eco2026');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg' }}
            style={styles.heroBg}
            blurRadius={2}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Recycle color="#fff" size={36} strokeWidth={2} />
            </View>
            <Text style={styles.logoText}>ecovivo</Text>
            <View style={styles.tagWrap}>
              <Leaf color="#A5D6A7" size={12} strokeWidth={2} />
              <Text style={styles.tagText}>Mundial 2026 · ZMG</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido de vuelta</Text>
          <Text style={styles.cardSub}>Inicia sesión para continuar tu misión</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="voluntario@ecovivo.mx"
              placeholderTextColor="#9E9E9E"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="••••••••"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                {showPass ? (
                  <EyeOff color="#757575" size={20} />
                ) : (
                  <Eye color="#757575" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoBtn} onPress={fillDemo} activeOpacity={0.7}>
            <Text style={styles.demoBtnText}>Usar credenciales demo</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLbl}>Estadios</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>240+</Text>
              <Text style={styles.statLbl}>Voluntarios</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>4.2 t</Text>
              <Text style={styles.statLbl}>Desviadas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1F0F' },
  scroll: { flexGrow: 1 },
  hero: {
    height: 280,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    overflow: 'hidden',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,31,15,0.72)',
  },
  logoWrap: { alignItems: 'center', zIndex: 1 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(76,175,80,0.25)',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  tagText: { color: '#A5D6A7', fontSize: 12, letterSpacing: 1 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 48,
    marginTop: -20,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1B2E1D', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#757575', marginBottom: 24 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  errorText: { color: '#C62828', fontSize: 13 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#424242', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1B2E1D',
    backgroundColor: '#FAFAFA',
  },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  demoBtn: { alignItems: 'center', marginTop: 14 },
  demoBtnText: { color: '#43A047', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 24 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },
  statLbl: { fontSize: 11, color: '#9E9E9E', marginTop: 2 },
  statDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
});
