import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineSearch,
    HiOutlineTrendingUp,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlinePencilAlt,
    HiX,
    HiChevronDown,
    HiFilter,
    HiSortAscending,
    HiSortDescending,
    HiOutlineArrowRight
} from 'react-icons/hi';
import { getFallbackImage } from '../utils/imageHelper';

const Prices = () => {
    const { user } = useAuth();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [updating, setUpdating] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [lastSync, setLastSync] = useState(new Date());

    // E-commerce state
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high, name
    const [showSortMenu, setShowSortMenu] = useState(false);

    const fetchPrices = async (isAuto = false) => {
        try {
            const response = await api.get('/market');
            setPrices(response.data.data);
            setLastSync(new Date());
            if (!isAuto) setLoading(false);
        } catch (err) {
            console.error('Failed to fetch prices', err);
            if (!isAuto) setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(() => fetchPrices(true), 5000);
        return () => clearInterval(interval);
    }, []);

    // Get unique categories for the filter bar
    const categories = useMemo(() => {
        const cats = prices.map(p => p.category).filter(Boolean);
        return ['All', ...new Set(cats)];
    }, [prices]);

    const processedPrices = useMemo(() => {
        let result = [...prices];

        // 1. Search filter
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.itemName.toLowerCase().includes(lowSearch) ||
                (item.category && item.category.toLowerCase().includes(lowSearch)) ||
                (item.location && item.location.toLowerCase().includes(lowSearch))
            );
        }

        // 2. Category filter
        if (activeCategory !== 'All') {
            result = result.filter(item => item.category === activeCategory);
        }

        // 3. Sorting
        result.sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name') return a.itemName.localeCompare(b.itemName);
            return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
        });

        return result;
    }, [prices, searchTerm, activeCategory, sortBy]);

    const groupedPrices = useMemo(() => {
        if (activeCategory !== 'All') return { [activeCategory]: processedPrices };

        return processedPrices.reduce((acc, item) => {
            const cat = item.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});
    }, [processedPrices, activeCategory]);

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        if (!newPrice || isNaN(newPrice)) return;
        setUpdating(true);
        try {
            await api.post('/market/update', {
                itemId: selectedItem._id,
                newPrice: Number(newPrice),
                updatedBy: user?.name || 'Anonymous',
                role: user?.role?.toLowerCase() || 'user'
            });
            await fetchPrices();
            setUpdatingItemId(selectedItem._id);
            setTimeout(() => setUpdatingItemId(null), 2000);
            setSelectedItem(null);
            setNewPrice('');
        } catch (err) {
            alert('Failed to update price');
        } finally {
            setUpdating(false);
        }
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const diff = (new Date() - date) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isRecentlyUpdated = (dateString) => (new Date() - new Date(dateString)) / 1000 < 60;

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '16px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #d1fae5', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Loading Market Intelligence...</span>
        </div>
    );

    return (
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
            {/* Sticky Header Section */}
            <div style={{ position: 'sticky', top: '0', backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 100, paddingTop: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', backdropFilter: 'blur(12px)', margin: '0 -20px 48px', padding: '24px 20px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
                    <div>
                        <div style={{ color: '#059669', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                            Live Market Feed
                            <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: '500', fontSize: '0.75rem' }}>
                                (Next sync in {Math.max(0, 5 - Math.floor((new Date() - lastSync) / 1000))}s)
                            </span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#0f172a' }}>Explore Prices</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px', minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <HiOutlineSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }} />
                            <input
                                type="text"
                                placeholder="Search by item, category or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '14px 14px 14px 48px', width: '100%', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowSortMenu(!showSortMenu)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: '700', cursor: 'pointer', color: '#475569' }}
                            >
                                <HiFilter /> Sort By <HiChevronDown style={{ transform: showSortMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                            </button>
                            {showSortMenu && (
                                <div style={{ position: 'absolute', top: '110%', right: '0', width: '220px', padding: '12px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[
                                        { id: 'newest', label: 'Recently Updated', icon: <HiOutlineClock /> },
                                        { id: 'price-low', label: 'Price: Low to High', icon: <HiSortAscending /> },
                                        { id: 'price-high', label: 'Price: High to Low', icon: <HiSortDescending /> },
                                        { id: 'name', label: 'Item Name: A-Z', icon: <HiOutlineSearch /> }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: sortBy === opt.id ? '#f0fdf4' : 'transparent', color: sortBy === opt.id ? '#059669' : '#64748b', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Chips Bar */}
                <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginTop: '20px', paddingBottom: '4px', scrollbarWidth: 'none' }} className="no-scrollbar">
                    <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '100px',
                                whiteSpace: 'nowrap',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '1px solid',
                                backgroundColor: activeCategory === cat ? '#059669' : '#fff',
                                color: activeCategory === cat ? '#fff' : '#475569',
                                borderColor: activeCategory === cat ? '#059669' : '#e2e8f0',
                                boxShadow: activeCategory === cat ? '0 4px 12px rgba(5, 150, 105, 0.2)' : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Areas */}
            {Object.keys(groupedPrices).length > 0 ? (
                Object.keys(groupedPrices).map(category => (
                    <div key={category} style={{ marginBottom: '56px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px', margin: 0 }}>
                                {category}
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '100px' }}>
                                    {groupedPrices[category].length} items
                                </span>
                            </h2>
                            {activeCategory === 'All' && (
                                <button onClick={() => setActiveCategory(category)} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                                    View All <HiOutlineArrowRight />
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '24px' }} className="market-grid">
                            <style>{`
                                .market-grid { grid-template-columns: repeat(1, 1fr); }
                                @media (min-width: 640px) { .market-grid { grid-template-columns: repeat(2, 1fr); } }
                                @media (min-width: 1024px) { .market-grid { grid-template-columns: repeat(4, 1fr); } }
                                .price-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                            `}</style>

                            {groupedPrices[category].map((item) => (
                                <div
                                    key={item._id}
                                    className={`price-card ${updatingItemId === item._id ? 'price-update-animate' : ''}`}
                                    style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden', transition: 'all 0.3s' }}
                                >
                                    <div style={{ position: 'relative', height: '200px', backgroundColor: '#f3f4f6' }}>
                                        <img
                                            src={item.image || getFallbackImage(item.itemName, item.category)}
                                            alt={item.itemName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = getFallbackImage(item.itemName, item.category); }}
                                        />
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', color: '#059669', backdropFilter: 'blur(4px)' }}>
                                            {item.location || 'Local Mandi'}
                                        </div>
                                    </div>

                                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>{item.itemName}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>
                                                <HiOutlineTrendingUp /> Stable
                                            </div>
                                        </div>
                                        <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Updated {formatRelativeTime(item.createdAt)}</p>

                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                <span style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a' }}>₹{item.price}</span>
                                                <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>/ unit</span>
                                            </div>
                                        </div>

                                        {user && (
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                style={{ marginTop: '20px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' }}
                                            >
                                                <HiOutlinePencilAlt /> Update Price
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '120px 20px', backgroundColor: '#f8fafc', borderRadius: '40px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔍</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', margin: '0 0 12px 0' }}>No matches found</h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>We couldn't find any commodities matching your current filters. Try resetting your search or category.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                        style={{ marginTop: '32px', padding: '14px 32px', borderRadius: '14px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Update Modal */}
            {selectedItem && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '440px', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                        <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f8fafc', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}>
                            <HiX />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '72px', height: '72px', backgroundColor: '#f0fdf4', color: '#059669', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.5rem' }}>
                                <HiOutlineTrendingUp />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>New Market Rate</h2>
                            <p style={{ color: '#64748b', fontSize: '1rem' }}>Updating price for <strong>{selectedItem.itemName}</strong></p>
                        </div>

                        <form onSubmit={handleUpdatePrice}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>Set New Price</label>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#059669' }}>Current: ₹{selectedItem.price}</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#0f172a', fontSize: '1.2rem' }}>₹</span>
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        required
                                        autoFocus
                                        style={{ width: '100%', padding: '18px 20px 18px 48px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '1.4rem', fontWeight: '900', outline: 'none', transition: '0.2s' }}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={updating} style={{ width: '100%', backgroundColor: '#059669', color: '#fff', padding: '18px', borderRadius: '18px', border: 'none', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.4)' }}>
                                {updating ? 'Saving Changes...' : 'Publish Update'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prices;
