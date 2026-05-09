import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1F0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#4CAF50" size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}