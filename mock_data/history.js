// mock_data/history.js
// En lugar de exportar arreglos desnudos, exponemos una "mini-store" mutable
// con getters y una función de escritura. Esto permite que WasteService.js
// agregue registros en tiempo de ejecución sin romper ningún consumer existente.

// ─── Datos iniciales (semilla) ────────────────────────────────────────────────

let _collectionHistory = [
  {
    id: '1',
    date: '2026-05-09',
    time: '10:32',
    category: 'Plástico',
    categoryColor: '#1E88E5',
    kilos: 4.2,
    location: 'Estadio Akron - Sector Norte',
    points: 42,
    status: 'verified',
    imageUrl: 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
  },
  {
    id: '2',
    date: '2026-05-09',
    time: '09:15',
    category: 'Orgánico',
    categoryColor: '#43A047',
    kilos: 6.8,
    location: 'Estadio Akron - Sector Sur',
    points: 68,
    status: 'verified',
    imageUrl: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg',
  },
  {
    id: '3',
    date: '2026-05-08',
    time: '15:44',
    category: 'Papel y Cartón',
    categoryColor: '#FB8C00',
    kilos: 3.1,
    location: 'Estadio Jalisco - Entrada Principal',
    points: 31,
    status: 'verified',
    imageUrl: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
  },
  {
    id: '4',
    date: '2026-05-08',
    time: '12:20',
    category: 'Metal',
    categoryColor: '#757575',
    kilos: 2.5,
    location: 'Estadio Akron - Zona Comercial',
    points: 50,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: '5',
    date: '2026-05-07',
    time: '16:55',
    category: 'Vidrio',
    categoryColor: '#00ACC1',
    kilos: 8.3,
    location: 'Estadio Jalisco - Sector Oriente',
    points: 83,
    status: 'verified',
    imageUrl: 'https://images.pexels.com/photos/1393862/pexels-photo-1393862.jpeg',
  },
  {
    id: '6',
    date: '2026-05-07',
    time: '11:10',
    category: 'Plástico',
    categoryColor: '#1E88E5',
    kilos: 5.7,
    location: 'Estadio Akron - Sector Sur',
    points: 57,
    status: 'verified',
    imageUrl: 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
  },
];

export let volunteerProfile = {
  name: 'María González',
  role: 'Voluntaria Verificada',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  totalKilos: 247.8,
  totalPoints: 2478,
  totalCollections: 89,
  level: 'Eco Campeona',
  levelProgress: 78,
  badges: [
    { id: 1, name: 'Primera Recolección', icon: 'award', color: '#FB8C00' },
    { id: 2, name: '100 Kilos', icon: 'trending-up', color: '#43A047' },
    { id: 3, name: 'Semana Perfecta', icon: 'star', color: '#1E88E5' },
    { id: 4, name: 'Equipo Verde', icon: 'users', color: '#00ACC1' },
  ],
  stadium: 'Estadio Akron',
  joinDate: 'Enero 2026',
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
    totalKilos: parseFloat((volunteerProfile.totalKilos + record.kilos).toFixed(1)),
    totalPoints: volunteerProfile.totalPoints + record.points,
    totalCollections: volunteerProfile.totalCollections + 1,
  };
};

// Compatibilidad retroactiva: cualquier módulo que haga
// `import { collectionHistory } from '@/mock_data/history'`
// recibirá la semilla inicial. Para datos reactivos usa getCollectionHistory().
export const collectionHistory = _collectionHistory;
