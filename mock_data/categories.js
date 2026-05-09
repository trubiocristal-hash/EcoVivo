// mock_data/categories.js
// Exportamos los datos como una constante inmutable (no cambia en runtime).
// El servicio los consume directamente; no necesita mutarlos.

export const wasteCategories = [
  {
    id: 'plastic',
    name: 'Plástico',
    icon: 'recycle',
    color: '#1E88E5',
    lightColor: '#E3F2FD',
    description: 'Botellas PET, envases, bolsas',
    binColor: 'Azul',
    examples: ['Botellas de agua', 'Bolsas', 'Envases', 'Tapas'],
  },
  {
    id: 'organic',
    name: 'Orgánico',
    icon: 'leaf',
    color: '#43A047',
    lightColor: '#E8F5E9',
    description: 'Restos de comida, residuos biodegradables',
    binColor: 'Verde',
    examples: ['Restos de comida', 'Cáscaras', 'Servilletas', 'Frutas'],
  },
  {
    id: 'paper',
    name: 'Papel y Cartón',
    icon: 'file-text',
    color: '#FB8C00',
    lightColor: '#FFF3E0',
    description: 'Periódicos, revistas, cajas',
    binColor: 'Naranja',
    examples: ['Cajas', 'Periódicos', 'Folletos', 'Vasos de cartón'],
  },
  {
    id: 'glass',
    name: 'Vidrio',
    icon: 'package',
    color: '#00ACC1',
    lightColor: '#E0F7FA',
    description: 'Botellas y envases de vidrio',
    binColor: 'Blanco',
    examples: ['Botellas', 'Frascos', 'Envases'],
  },
  {
    id: 'metal',
    name: 'Metal',
    icon: 'zap',
    color: '#757575',
    lightColor: '#F5F5F5',
    description: 'Latas, aluminio, metales',
    binColor: 'Gris',
    examples: ['Latas de refresco', 'Aluminio', 'Latas de comida'],
  },
  {
    id: 'hazardous',
    name: 'Peligroso',
    icon: 'alert-triangle',
    color: '#E53935',
    lightColor: '#FFEBEE',
    description: 'Baterías, medicamentos, electrónicos',
    binColor: 'Rojo',
    examples: ['Baterías', 'Medicamentos', 'Electrónicos', 'Pilas'],
  },
];

/**
 * Helper: devuelve un objeto de categoría por su `id`.
 * Usado por el servicio para enriquecer el registro guardado.
 */
export const getCategoryById = (id) =>
  wasteCategories.find((c) => c.id === id) ?? null;
