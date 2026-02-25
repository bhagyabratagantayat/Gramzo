/* ─────────────────────────────────────────────────
   Location Service
   Handles geolocation detection, localStorage
   persistence, and fallback helper.
───────────────────────────────────────────────── */

const STORAGE_KEY = 'gramzoLocation';

/**
 * Read saved location from localStorage.
 * Returns { lat, lng, locationName, source } or null.
 */
export const getSavedLocation = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/**
 * Save a location object to localStorage.
 * Accepted shape: { lat, lng, locationName?, source }
 */
export const saveLocation = (locationObj) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(locationObj));
    } catch {
        // Ignore storage errors (private mode, storage full, etc.)
    }
};

/**
 * Clear saved location (e.g. on logout).
 */
export const clearLocation = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore
    }
};

/**
 * Request GPS location from the browser.
 * Returns a Promise:
 *   resolve({ lat, lng })   — on success
 *   reject(errorCode)       — on denial or unavailable
 *
 * Never throws — callers should .catch() gracefully.
 */
export const requestGPSLocation = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('UNAVAILABLE');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(err.code), // 1=DENIED, 2=UNAVAILABLE, 3=TIMEOUT
            { timeout: 8000, maximumAge: 300_000 }
        );
    });
