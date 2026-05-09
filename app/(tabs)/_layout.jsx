import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Hop as Home, Plus, Clock, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user]);

  if (!user) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#43A047',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="collect"
        options={{
          title: 'Recolectar',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.collectBtn, focused && styles.collectBtnActive]}>
              <Plus color="#fff" size={26} strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    height: 64,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  collectBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#43A047',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  collectBtnActive: {
    backgroundColor: '#2E7D32',
  },
});
