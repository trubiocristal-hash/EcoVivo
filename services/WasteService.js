// services/WasteService.js
//
// Capa de servicio que centraliza toda la lógica de negocio relacionada
// con residuos. Actúa como el único punto de escritura hacia los mocks;
// ningún componente debe modificar los arreglos de mock_data directamente.
//
// Patrón: Service Layer + Callback/Promise híbrido
// ─────────────────────────────────────────────────────────────────────────────

import { getCategoryById } from '@/mock_data/categories';
import { appendCollectionRecord } from '@/mock_data/history';
import { updateTodayStats } from '@/mock_data/stats';

// ─── Utilidades internas ──────────────────────────────────────────────────────

/** Genera un ID único pseudo-aleatorio. */
const _generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Formatea la fecha actual como 'YYYY-MM-DD'. */
const _today = () => new Date().toISOString().split('T')[0];

/** Formatea la hora actual como 'HH:MM'. */
const _now = () =>
  new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });

/**
 * Simula la latencia de red (entre 1 000 y 2 000 ms).
 * Devuelve una Promesa que resuelve tras el tiempo aleatorio.
 */
const _simulateLatency = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 1000) + 1000)
  );

/**
 * Simula una falla de red ocasional (~10 % de probabilidad).
 * Útil para probar el manejo de errores en la UI.
 */
const _mayFail = () => Math.random() < 0.1;

// ─── Validación ───────────────────────────────────────────────────────────────

/**
 * Valida que el payload tenga todos los campos mínimos requeridos.
 * @returns {{ valid: boolean, message?: string }}
 */
const _validate = ({ categoryId, kilos, location }) => {
  if (!categoryId) return { valid: false, message: 'Debes seleccionar una categoría.' };
  if (!getCategoryById(categoryId))
    return { valid: false, message: `Categoría desconocida: "${categoryId}".` };
  if (!kilos || isNaN(kilos) || kilos <= 0)
    return { valid: false, message: 'El peso debe ser un número mayor a 0.' };
  if (!location || location.trim().length === 0)
    return { valid: false, message: 'La ubicación no puede estar vacía.' };
  return { valid: true };
};

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Registra una nueva recolección de residuos.
 *
 * Simula una llamada HTTP POST:
 *   1. Valida el payload de forma síncrona.
 *   2. Espera la latencia simulada (1-2 s) con setTimeout.
 *   3. Enriquece y construye el objeto final del registro.
 *   4. Persiste en memoria (history + stats).
 *   5. Invoca onSuccess(savedRecord) o onError(errorMessage).
 *
 * @param {{ categoryId: string, kilos: number, location: string, imageUrl?: string }} payload
 * @param {(record: Object) => void} onSuccess  - Callback de éxito.
 * @param {(message: string)  => void} onError   - Callback de error.
 * @returns {void}  — No devuelve la promesa al llamador; los resultados
 *                    llegan exclusivamente vía callbacks.
 */
export const saveCollectionRecord = (payload, onSuccess, onError) => {
  const { categoryId, kilos, location, imageUrl = null } = payload;

  // 1. Validación síncrona (falla instantánea, sin latencia)
  const validation = _validate({ categoryId, kilos, location });
  if (!validation.valid) {
    onError(validation.message);
    return;
  }

  // 2. Simular latencia de red
  _simulateLatency().then(() => {
    // 3. Simular falla de red ocasional
    if (_mayFail()) {
      onError('Error de red. Por favor, intenta de nuevo.');
      return;
    }

    // 4. Enriquecer el registro
    const category = getCategoryById(categoryId);
    const kilosNum  = parseFloat(kilos);
    const points    = Math.round(kilosNum * 10); // 10 pts por kg

    const savedRecord = {
      id:            _generateId(),
      date:          _today(),
      time:          _now(),
      category:      category.name,
      categoryColor: category.color,
      kilos:         kilosNum,
      location:      location.trim(),
      points,
      status:        'pending',   // verificación simulada posterior
      imageUrl,
    };

    // 5. Persistir en los mocks en memoria
    appendCollectionRecord(savedRecord);
    updateTodayStats(savedRecord);

    // 6. Notificar éxito
    onSuccess(savedRecord);
  });
};

/**
 * Obtiene el historial de recolecciones (lectura).
 * Importa y reexporta desde history para que los componentes
 * tengan un único punto de entrada de datos.
 */
export { getCollectionHistory } from '@/mock_data/history';
export { getTodayStats }        from '@/mock_data/stats';
