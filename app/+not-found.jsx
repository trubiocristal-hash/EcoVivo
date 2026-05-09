import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Pantalla no encontrada.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ir al inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#F4F7F4' },
  text: { fontSize: 18, fontWeight: '600', color: '#1B2E1D' },
  link: { marginTop: 16 },
  linkText: { color: '#43A047', fontSize: 15, fontWeight: '600' },
});
