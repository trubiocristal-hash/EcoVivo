// mock_data/history.js
// En lugar de exportar arreglos desnudos, exponemos una "mini-store" mutable
// con getters y una función de escritura. Esto permite que WasteService.js
// agregue registros en tiempo de ejecución sin romper ningún consumer existente.

// ─── Datos iniciales (semilla) ────────────────────────────────────────────────

let _collectionHistory = [
  {
    id: '1',
    date: '2026-05-09',
    time: '18:45',
    category: 'Plástico',
    categoryColor: '#2196F3',
    kilos: 5.2,
    location: 'Estadio Akron - Graderías Oriente',
    points: 52,
    status: 'verified',
    imageUrl:
      'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
  },
  {
    id: '2',
    date: '2026-05-09',
    time: '17:10',
    category: 'Orgánico',
    categoryColor: '#4CAF50',
    kilos: 7.5,
    location: 'Estadio Akron - Zona Gastronómica',
    points: 75,
    status: 'verified',
    imageUrl:
      'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg',
  },
  {
    id: '3',
    date: '2026-05-09',
    time: '15:30',
    category: 'Plástico',
    categoryColor: '#2196F3',
    kilos: 4.1,
    location: 'Estadio Akron - Acceso 3',
    points: 41,
    status: 'verified',
    imageUrl: null,
  },
  {
    id: '4',
    date: '2026-05-09',
    time: '14:20',
    category: 'Papel',
    categoryColor: '#FF9800',
    kilos: 2.8,
    location: 'Estadio Akron - Palcos',
    points: 28,
    status: 'verified',
    imageUrl: null,
  },
  {
    id: '5',
    date: '2026-05-09',
    time: '12:45',
    category: 'Orgánico',
    categoryColor: '#4CAF50',
    kilos: 3.2,
    location: 'Estadio Akron - Zona de Snacks',
    points: 32,
    status: 'verified',
    imageUrl: null,
  },
  {
    id: '6',
    date: '2026-05-09',
    time: '11:15',
    category: 'Metal',
    categoryColor: '#9E9E9E',
    kilos: 1.5,
    location: 'Estadio Akron - Estacionamiento',
    points: 15,
    status: 'verified',
    imageUrl: null,
  },
  {
    id: '7',
    date: '2026-05-09',
    time: '10:00',
    category: 'Plástico',
    categoryColor: '#2196F3',
    kilos: 2.6,
    location: 'Estadio Akron - Sector Norte',
    points: 26,
    status: 'verified',
    imageUrl: null,
  },
  {
    id: '8',
    date: '2026-05-09',
    time: '09:00',
    category: 'Vidrio',
    categoryColor: '#00BCD4',
    kilos: 1.5,
    location: 'Estadio Akron - Bar VIP',
    points: 15,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: '9',
    date: '2026-05-08',
    time: '15:44',
    category: 'Papel',
    categoryColor: '#FF9800',
    kilos: 3.1,
    location: 'Estadio Jalisco - Entrada Principal',
    points: 31,
    status: 'verified',
    imageUrl:
      'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
  },
];

export let volunteerProfile = {
  name: 'María González',
  role: 'Operadora Lead - Mundial 2026',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  totalKilos: 169.4,
  totalPoints: 1694,
  totalCollections: 42,
  level: 'Eco Líder',
  levelProgress: 65,
  badges: [
    { id: 1, name: 'Fundadora EcoVivo', icon: 'award', color: '#FB8C00' },
    {
      id: 2,
      name: 'Visión Mundial 2026',
      icon: 'trending-up',
      color: '#43A047',
    },
    { id: 3, name: 'Especialista PET', icon: 'star', color: '#1E88E5' },
  ],
  stadium: 'Estadio Akron',
  joinDate: 'Marzo 2026',
};

// ─── API de la store ──────────────────────────────────────────────────────────

/** Devuelve una copia del historial (más reciente primero). */
export const getCollectionHistory = () => [..._collectionHistory];

/**
 * Inserta un nuevo registro al inicio del historial y actualiza el perfil.
 * Solo WasteService debe llamar esta función.
 *
 * @param {Object} record  - Registro ya enriquecido y validado por el servicio.
 */
export const appendCollectionRecord = (record) => {
  _collectionHistory = [record, ..._collectionHistory];

  // Actualizar acumulados del perfil en memoria
  volunteerProfile = {
    ...volunteerProfile,
    totalKilos: parseFloat(
      (volunteerProfile.totalKilos + record.kilos).toFixed(1),
    ),
    totalPoints: volunteerProfile.totalPoints + record.points,
    totalCollections: volunteerProfile.totalCollections + 1,
  };
};

// Compatibilidad retroactiva: cualquier módulo que haga
// `import { collectionHistory } from '@/mock_data/history'`
// recibirá la semilla inicial. Para datos reactivos usa getCollectionHistory().
export const collectionHistory = _collectionHistory;
