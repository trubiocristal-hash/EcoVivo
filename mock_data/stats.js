// mock_data/stats.js
// Las estadísticas también son mutables en memoria para reflejar
// las nuevas recolecciones registradas vía WasteService.

// ─── Datos iniciales ──────────────────────────────────────────────────────────

let _todayStats = {
  kilosCollected: 28.4,
  diversionRate: 92,
  collectionsCount: 8,
  co2Saved: 7.05,       // 0.27 kg CO₂ por kg de residuo desviado (promedio)
  volunteersActive: 1,
  goal: 40,
};

export const weeklyData = [
  { day: 'Lun', kilos: 18 },
  { day: 'Mar', kilos: 22 },
  { day: 'Mié', kilos: 31 },
  { day: 'Jue', kilos: 16 },
  { day: 'Vie', kilos: 12 },
  { day: 'Sáb', kilos: 25 },
  { day: 'Dom', kilos: 28 },
];

export const monthlyDiversionData = [
  { label: 'Ene', value: 65 },
  { label: 'Feb', value: 72 },
  { label: 'Mar', value: 80 },
  { label: 'Abr', value: 88 },
  { label: 'May', value: 92 },
];

export const categoryBreakdown = [
  { name: 'Plástico',  percentage: 45, color: '#2196F3' },
  { name: 'Orgánico',  percentage: 30, color: '#4CAF50' },
  { name: 'Papel',     percentage: 15, color: '#FF9800' },
  { name: 'Vidrio',    percentage: 5, color: '#00BCD4' },
  { name: 'Metal',     percentage:  5, color: '#9E9E9E' },
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
