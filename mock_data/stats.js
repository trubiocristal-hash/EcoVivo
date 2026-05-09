// mock_data/stats.js
// Las estadísticas también son mutables en memoria para reflejar
// las nuevas recolecciones registradas vía WasteService.

// ─── Datos iniciales ──────────────────────────────────────────────────────────

let _todayStats = {
  kilosCollected: 142.5,
  diversionRate: 87,
  collectionsCount: 23,
  co2Saved: 38.4,       // 0.27 kg CO₂ por kg de residuo desviado (promedio)
  volunteersActive: 12,
  goal: 200,
};

export const weeklyData = [
  { day: 'Lun', kilos: 98 },
  { day: 'Mar', kilos: 134 },
  { day: 'Mié', kilos: 112 },
  { day: 'Jue', kilos: 165 },
  { day: 'Vie', kilos: 142 },
  { day: 'Sáb', kilos: 188 },
  { day: 'Dom', kilos: 76 },
];

export const monthlyDiversionData = [
  { label: 'Ene', value: 72 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 81 },
  { label: 'Abr', value: 85 },
  { label: 'May', value: 87 },
];

export const categoryBreakdown = [
  { name: 'Plástico',  percentage: 34, color: '#2196F3' },
  { name: 'Orgánico',  percentage: 28, color: '#4CAF50' },
  { name: 'Papel',     percentage: 19, color: '#FF9800' },
  { name: 'Vidrio',    percentage: 12, color: '#00BCD4' },
  { name: 'Metal',     percentage:  7, color: '#9E9E9E' },
];

// ─── API de la store ──────────────────────────────────────────────────────────

/** Devuelve una instantánea de las estadísticas del día. */
export const getTodayStats = () => ({ ..._todayStats });

/**
 * Actualiza las estadísticas del día tras guardar una recolección.
 * Solo WasteService debe llamar esta función.
 *
 * @param {{ kilos: number }} record
 */
export const updateTodayStats = (record) => {
  const CO2_FACTOR = 0.27; // kg CO₂ por kg de residuo desviado

  _todayStats = {
    ..._todayStats,
    kilosCollected: parseFloat((_todayStats.kilosCollected + record.kilos).toFixed(1)),
    collectionsCount: _todayStats.collectionsCount + 1,
    co2Saved: parseFloat((_todayStats.co2Saved + record.kilos * CO2_FACTOR).toFixed(1)),
    // La tasa de desvío sube muy lentamente; simulamos una micro-mejora
    diversionRate: Math.min(
      100,
      parseFloat((_todayStats.diversionRate + 0.1).toFixed(1))
    ),
  };
};

// Compatibilidad retroactiva con imports estáticos previos
export const todayStats = _todayStats;
