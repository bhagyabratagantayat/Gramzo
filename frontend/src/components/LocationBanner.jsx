import { useState, useEffect } from 'react';
import { getSavedLocation, saveLocation, requestGPSLocation } from '../services/location';
import { HiOutlineLocationMarker, HiOutlineX, HiOutlineCheckCircle } from 'react-icons/hi';

/**
 * LocationBanner
 *
 * Shown at the top of the page (below Navbar) on first visit.
 * - Tries GPS automatically on mount.
 * - If GPS succeeds → saves to localStorage → banner auto-dismisses.
 * - If GPS is denied/unavailable → shows an inline manual location input.
 * - Never blocks the rest of the app.
 * - If a location is already saved, renders nothing.
 */
const LocationBanner = () => {
    // null = deciding, 'asking' = waiting on GPS, 'denied' = show manual, 'saved' = done
    const [state, setState] = useState('deciding');
    const [manualInput, setManualInput] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Already have a location → nothing to do
        if (getSavedLocation()) {
            setState('saved');
            return;
        }

        // Show the banner and start requesting GPS
        setVisible(true);
        setState('asking');

        requestGPSLocation()
            .then(({ lat, lng }) => {
                saveLocation({ lat, lng, source: 'gps' });
                setState('saved');
                // Briefly show success, then hide
                setTimeout(() => setVisible(false), 1800);
            })
            .catch(() => {
                // Permission denied or unavailable → show manual fallback
                setState('denied');
            });
    }, []);

    const handleManualSave = () => {
        const trimmed = manualInput.trim();
        if (!trimmed) return;
        saveLocation({ locationName: trimmed, source: 'manual' });
        setState('saved');
        setTimeout(() => setVisible(false), 1500);
    };

    const handleDismiss = () => {
        // User skips → save a sentinel so we don't ask again this session
        saveLocation({ locationName: '', source: 'skipped' });
        setVisible(false);
    };

    if (!visible || state === 'deciding') return null;

    /* ── Saved / success state ── */
    if (state === 'saved') {
        return (
            <div style={bannerStyle('#ecfdf5', '#059669', '#6ee7b7')}>
                <HiOutlineCheckCircle style={{ fontSize: '1.1rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                    {getSavedLocation()?.source === 'gps'
                        ? 'Location detected — showing nearby services.'
                        : `Location set to "${getSavedLocation()?.locationName}".`}
                </span>
            </div>
        );
    }

    /* ── Asking / waiting for browser permission ── */
    if (state === 'asking') {
        return (
            <div style={bannerStyle('#eff6ff', '#1d4ed8', '#bfdbfe')}>
                <HiOutlineLocationMarker style={{ fontSize: '1.1rem', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                    Detecting your location…
                </span>
            </div>
        );
    }

    /* ── Denied → manual fallback ── */
    return (
        <div style={{
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            <HiOutlineLocationMarker style={{ color: '#d97706', fontSize: '1.1rem', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#92400e' }}>
                Location access denied. Enter your village or city:
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                    type="text"
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleManualSave()}
                    placeholder="e.g. Puri, Bhubaneswar"
                    style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #fcd34d',
                        fontSize: '0.88rem',
                        outline: 'none',
                        width: '200px',
                        backgroundColor: '#fff'
                    }}
                    autoFocus
                />
                <button
                    onClick={handleManualSave}
                    style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#d97706',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}
                >
                    Save
                </button>
                <button
                    onClick={handleDismiss}
                    title="Skip"
                    style={{
                        background: 'none', border: 'none',
                        cursor: 'pointer', color: '#9ca3af',
                        display: 'flex', padding: '4px'
                    }}
                >
                    <HiOutlineX style={{ fontSize: '1.1rem' }} />
                </button>
            </div>
        </div>
    );
};

/* Shared banner style helper */
const bannerStyle = (bg, color, border) => ({
    backgroundColor: bg,
    borderBottom: `1px solid ${border}`,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color
});

export default LocationBanner;
