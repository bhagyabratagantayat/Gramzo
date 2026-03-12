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

    /* Shared banner style helper */
    const bannerClassName = state === 'saved' ? 'banner-alert alert-success' : (state === 'asking' ? 'banner-alert alert-info' : 'banner-location-manual');

    if (state === 'saved') {
        return (
            <div className="banner-alert alert-success location-sticky">
                <HiOutlineCheckCircle className="banner-icon" />
                <span className="banner-text">
                    {getSavedLocation()?.source === 'gps'
                        ? 'Location detected — showing nearby services.'
                        : `Location set to "${getSavedLocation()?.locationName}".`}
                </span>
            </div>
        );
    }

    if (state === 'asking') {
        return (
            <div className="banner-alert alert-info location-sticky">
                <HiOutlineLocationMarker className="banner-icon pulse" />
                <span className="banner-text">
                    Detecting your location…
                </span>
            </div>
        );
    }

    /* ── Denied → manual fallback ── */
    return (
        <div className="banner-alert alert-warning location-sticky manual-bg">
            <HiOutlineLocationMarker className="banner-icon warning-icon" />
            <span className="banner-text warning-text">
                Location access denied. Enter your village or city:
            </span>
            <div className="manual-input-group">
                <input
                    type="text"
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleManualSave()}
                    placeholder="e.g. Puri, Bhubaneswar"
                    className="form-input manual-input"
                    autoFocus
                />
                <button
                    onClick={handleManualSave}
                    className="btn-primary btn-sm rounded-lg"
                >
                    Save
                </button>
                <button
                    onClick={handleDismiss}
                    title="Skip"
                    className="btn-icon-dismiss"
                >
                    <HiOutlineX />
                </button>
            </div>
        </div>
    );
};

export default LocationBanner;
