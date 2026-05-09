import { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { wasteCategories } from '@/mock_data/categories';
import { Camera, Recycle, ChevronRight, X, Check, Scale, MapPin, Leaf, TriangleAlert as AlertTriangle, Package, FileText, Zap } from 'lucide-react-native';

const STATUS_H = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24);

const iconMap = {
  recycle: Recycle,
  leaf: Leaf,
  'file-text': FileText,
  package: Package,
  zap: Zap,
  'alert-triangle': AlertTriangle,
};

const STEPS = ['Categoría', 'Cantidad', 'Evidencia', 'Confirmar'];

export default function CollectScreen() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('Estadio Akron - Sector Norte');
  const [simCamera, setSimCamera] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Referencia para la cámara nativa
  const cameraRef = useRef(null);
  const [type, setType] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  const goStep = (next) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
    setStep(next);
  };

  const openCamera = async () => {
    // Solicitamos permiso antes de abrir la modal si no lo tenemos aún
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert("Necesitamos permiso para usar la cámara y registrar la evidencia.");
        return;
      }
    }
    setSimCamera(true);
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Captura la foto real usando la referencia
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImg(photo.uri);
        setSimCamera(false);
      } catch (error) {
        console.log("Error al tomar la foto: ", error);
      }
    }
  };

  const submitCollection = () => {
    setSuccessModal(true);
  };

  const resetFlow = () => {
    setSuccessModal(false);
    setStep(0);
    setSelected(null);
    setWeight('');
    setCapturedImg(null);
  };

  const canNext = () => {
    if (step === 0) return !!selected;
    if (step === 1) return weight.length > 0 && parseFloat(weight) > 0;
    if (step === 2) return true;
    return true;
  };

  const cat = wasteCategories.find((c) => c.id === selected);

  // Pantalla de carga mientras se verifican los permisos
  if (!permission) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Recolección</Text>
        <Text style={styles.headerSub}>Registra tu aporte ecológico</Text>
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i < step && styles.stepDone,
                  i === step && styles.stepActive,
                ]}
              >
                {i < step ? (
                  <Check color="#fff" size={10} strokeWidth={3} />
                ) : (
                  <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
                )}
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.stepLabel}>{STEPS[step]}</Text>
      </View>

      <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
        {step === 0 && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.stepTitle}>¿Qué tipo de residuo vas a registrar?</Text>
            <View style={styles.categoriesGrid}>
              {wasteCategories.map((c) => {
                const Icon = iconMap[c.icon] || Recycle;
                const active = selected === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.catCard,
                      active && { borderColor: c.color, borderWidth: 2.5, backgroundColor: c.lightColor },
                    ]}
                    onPress={() => setSelected(c.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.catIcon, { backgroundColor: active ? c.color : c.lightColor }]}>
                      <Icon color={active ? '#fff' : c.color} size={24} strokeWidth={2} />
                    </View>
                    <Text style={[styles.catName, active && { color: c.color }]}>{c.name}</Text>
                    <View style={[styles.catBinBadge, { backgroundColor: c.lightColor }]}>
                      <View style={[styles.catBinDot, { backgroundColor: c.color }]} />
                      <Text style={[styles.catBinText, { color: c.color }]}>{c.binColor}</Text>
                    </View>
                    <Text style={styles.catDesc}>{c.description}</Text>
                    {active && (
                      <View style={[styles.checkMark, { backgroundColor: c.color }]}>
                        <Check color="#fff" size={10} strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {step === 1 && cat && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.stepTitle}>¿Cuánto peso recolectaste?</Text>
            <View style={[styles.catPill, { backgroundColor: cat.lightColor }]}>
              <View style={[styles.catPillDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.catPillText, { color: cat.color }]}>{cat.name}</Text>
            </View>
            <View style={styles.weightCard}>
              <Scale color={cat.color} size={32} strokeWidth={1.5} />
              <View style={styles.weightInputRow}>
                <TextInput
                  style={[styles.weightInput, { color: cat.color }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#BDBDBD"
                />
                <Text style={[styles.weightUnit, { color: cat.color + 'AA' }]}>kg</Text>
              </View>
              <Text style={styles.weightHint}>Ingresa el peso aproximado</Text>
            </View>
            <View style={styles.locationCard}>
              <MapPin color="#757575" size={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>Ubicación</Text>
                <TextInput
                  style={styles.locationInput}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>
            <View style={styles.examplesWrap}>
              <Text style={styles.examplesTitle}>Ejemplos de {cat.name.toLowerCase()}:</Text>
              <View style={styles.exampleTags}>
                {cat.examples.map((ex) => (
                  <View key={ex} style={[styles.exTag, { backgroundColor: cat.lightColor }]}>
                    <Text style={[styles.exTagText, { color: cat.color }]}>{ex}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {step === 2 && cat && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.stepTitle}>Documenta tu recolección</Text>
            <Text style={styles.stepSub}>Toma una foto como evidencia del residuo recolectado</Text>
            {capturedImg ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: capturedImg }} style={styles.previewImg} />
                <View style={styles.previewOverlay}>
                  <View style={[styles.verifiedBadge, { backgroundColor: cat.color }]}>
                    <Check color="#fff" size={14} strokeWidth={3} />
                    <Text style={styles.verifiedText}>Foto capturada</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.retakeBtn} onPress={openCamera}>
                  <Camera color="#fff" size={16} />
                  <Text style={styles.retakeBtnText}>Retomar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.cameraPlaceholder, { borderColor: cat.color + '66' }]}
                onPress={openCamera}
                activeOpacity={0.8}
              >
                <View style={[styles.cameraIcon, { backgroundColor: cat.lightColor }]}>
                  <Camera color={cat.color} size={36} strokeWidth={1.5} />
                </View>
                <Text style={[styles.cameraText, { color: cat.color }]}>Abrir cámara</Text>
                <Text style={styles.cameraHint}>Toca para capturar la evidencia fotográfica</Text>
              </TouchableOpacity>
            )}
            <View style={styles.skipWrap}>
              <TouchableOpacity onPress={() => goStep(3)}>
                <Text style={styles.skipText}>Continuar sin foto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {step === 3 && cat && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.stepTitle}>Confirma tu registro</Text>
            <View style={[styles.confirmCard, { borderTopColor: cat.color }]}>
              {capturedImg && (
                <Image source={{ uri: capturedImg }} style={styles.confirmThumb} />
              )}
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Categoría</Text>
                <View style={[styles.catPill, { backgroundColor: cat.lightColor, margin: 0 }]}>
                  <View style={[styles.catPillDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.catPillText, { color: cat.color }]}>{cat.name}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Peso</Text>
                <Text style={[styles.confirmValue, { color: cat.color }]}>{weight} kg</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Ubicación</Text>
                <Text style={styles.confirmValueSmall}>{location}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Puntos ganados</Text>
                <Text style={[styles.confirmValue, { color: '#FB8C00' }]}>
                  +{Math.round(parseFloat(weight || 0) * 10)} pts
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: cat.color }]}
              onPress={submitCollection}
              activeOpacity={0.85}
            >
              <Check color="#fff" size={20} strokeWidth={2.5} />
              <Text style={styles.submitBtnText}>Confirmar Recolección</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Animated.View>

      {step < 3 && (
        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => goStep(step - 1)}>
              <Text style={styles.backBtnText}>Atrás</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextBtn,
              !canNext() && styles.nextBtnDisabled,
              cat && step > 0 && { backgroundColor: cat.color },
            ]}
            onPress={() => canNext() && goStep(step + 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>{step === 2 ? 'Revisar' : 'Siguiente'}</Text>
            <ChevronRight color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Cámara Real */}
      <Modal visible={simCamera} animationType="slide" onRequestClose={() => setSimCamera(false)}>
        <View style={styles.cameraModal}>
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            facing={type} 
            ref={cameraRef} 
          />
          <View style={styles.cameraOverlay} />
          <View style={styles.cameraTopBar}>
            <TouchableOpacity onPress={() => setSimCamera(false)}>
              <X color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.cameraTopLabel}>Evidencia fotográfica</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.cameraFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.cameraBottomBar}>
            <Text style={styles.cameraGuide}>Encuadra los residuos en el marco</Text>
            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={successModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={[styles.successIcon, { backgroundColor: '#E8F5E9' }]}>
              <Check color="#2E7D32" size={40} strokeWidth={2.5} />
            </View>
            <Text style={styles.successTitle}>¡Recolección registrada!</Text>
            <Text style={styles.successSub}>
              Tu aporte de {weight} kg de {cat?.name?.toLowerCase()} ha sido registrado con éxito.
            </Text>
            <View style={styles.successPoints}>
              <Text style={styles.successPointsLabel}>Puntos ganados</Text>
              <Text style={styles.successPointsValue}>
                +{Math.round(parseFloat(weight || 0) * 10)} pts
              </Text>
            </View>
            <TouchableOpacity style={styles.successBtn} onPress={resetFlow} activeOpacity={0.85}>
              <Recycle color="#fff" size={18} />
              <Text style={styles.successBtnText}>Nueva recolección</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#A5D6A7', fontSize: 12, marginTop: 2, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: { backgroundColor: '#4CAF50' },
  stepActive: { backgroundColor: '#69F0AE' },
  stepNum: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700' },
  stepNumActive: { color: '#1B5E20' },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#4CAF50' },
  stepLabel: { color: '#A5D6A7', fontSize: 12, fontWeight: '600' },
  body: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#1B2E1D', marginBottom: 4 },
  stepSub: { fontSize: 13, color: '#757575', marginBottom: 16 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  catCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: { fontSize: 13, fontWeight: '700', color: '#1B2E1D' },
  catBinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  catBinDot: { width: 6, height: 6, borderRadius: 3 },
  catBinText: { fontSize: 10, fontWeight: '600' },
  catDesc: { fontSize: 11, color: '#9E9E9E', lineHeight: 15 },
  checkMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 12,
  },
  catPillDot: { width: 8, height: 8, borderRadius: 4 },
  catPillText: { fontSize: 13, fontWeight: '700' },
  weightCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  weightInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  weightInput: { fontSize: 56, fontWeight: '900', lineHeight: 64, minWidth: 120, textAlign: 'center' },
  weightUnit: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  weightHint: { fontSize: 12, color: '#9E9E9E' },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  locationLabel: { fontSize: 11, color: '#9E9E9E', marginBottom: 2 },
  locationInput: { fontSize: 13, color: '#424242', fontWeight: '500' },
  examplesWrap: { marginTop: 12 },
  examplesTitle: { fontSize: 13, color: '#757575', marginBottom: 8 },
  exampleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  exTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  exTagText: { fontSize: 12, fontWeight: '600' },
  cameraPlaceholder: {
    height: 220,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
    backgroundColor: '#fff',
  },
  cameraIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  cameraText: { fontSize: 16, fontWeight: '700' },
  cameraHint: { fontSize: 12, color: '#9E9E9E' },
  previewWrap: { borderRadius: 20, overflow: 'hidden', height: 220, marginVertical: 16 },
  previewImg: { width: '100%', height: '100%' },
  previewOverlay: { ...StyleSheet.absoluteFillObject, padding: 14, justifyContent: 'flex-end' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verifiedText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  retakeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  retakeBtnText: { color: '#fff', fontSize: 12 },
  skipWrap: { alignItems: 'center', marginTop: 8 },
  skipText: { color: '#9E9E9E', fontSize: 13 },
  confirmCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  confirmThumb: { width: '100%', height: 140, borderRadius: 10, marginBottom: 12 },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  confirmLabel: { fontSize: 13, color: '#757575' },
  confirmValue: { fontSize: 17, fontWeight: '800' },
  confirmValueSmall: { fontSize: 12, color: '#424242', textAlign: 'right', flex: 1, marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  submitBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  backBtn: {
    flex: 0.4,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnText: { color: '#757575', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextBtnDisabled: { backgroundColor: '#BDBDBD' },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cameraModal: { flex: 1, backgroundColor: '#000', justifyContent: 'space-between' },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_H + 16,
    paddingHorizontal: 20,
  },
  cameraTopLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  cameraFrame: {
    width: 280,
    height: 280,
    alignSelf: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  cameraBottomBar: { alignItems: 'center', paddingBottom: 48, gap: 20 },
  cameraGuide: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#1B2E1D' },
  successSub: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 20 },
  successPoints: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  successPointsLabel: { fontSize: 12, color: '#9E9E9E' },
  successPointsValue: { fontSize: 28, fontWeight: '900', color: '#FB8C00' },
  successBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    marginTop: 4,
  },
  successBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});