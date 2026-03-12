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

    const [error, setError] = useState(null);

    const fetchPrices = async (isAuto = false) => {
        try {
            const response = await api.get('/market');
            setPrices(response.data.data);
            setLastSync(new Date());
            setError(null);
            if (!isAuto) setLoading(false);
        } catch (err) {
            console.error('Failed to fetch prices', err);
            setError('Connection issue. Please check your internet or try refreshing.');
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
            const response = await api.post('/market/update', {
                itemId: selectedItem._id,
                newPrice: Number(newPrice),
                updatedBy: user?.name || 'Anonymous',
                role: user?.role || 'User'
            });

            // Requirement 9 & 10: Update UI immediately (Local state optimization)
            const updatedItem = response.data.data;
            setPrices(prevPrices => prevPrices.map(item =>
                item._id === updatedItem._id ? updatedItem : item
            ));

            setUpdatingItemId(selectedItem._id);
            setTimeout(() => setUpdatingItemId(null), 2000);
            setSelectedItem(null);
            setNewPrice('');

            // Background sync
            fetchPrices(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to update price. Please try again.';
            alert(errorMsg);
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
        <div className="page-loading-full flex-col gap-4">
            <div className="spinner"></div>
            <span className="text-muted font-bold">Loading Market Intelligence...</span>
        </div>
    );

    if (error) return (
        <div className="page-loading-full flex-col p-8 text-center">
            <div className="text-6xl mb-6">📡</div>
            <h2 className="font-extrabold mb-2">Server Unreachable</h2>
            <p className="text-muted max-w-sm mb-8">{error}</p>
            <button
                onClick={() => { setLoading(true); fetchPrices(); }}
                className="btn-primary py-4 px-12"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="market-prices-container app-container py-8">
            {/* Header Section */}
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live Market Feed
                    </div>
                    <h1 className="dash-title">Explore Prices</h1>
                    <p className="dash-subtitle">
                        Real-time agricultural commodity prices. Last sync {Math.max(0, 5 - Math.floor((new Date() - lastSync) / 1000))}s ago.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 flex-1 lg:max-w-2xl">
                    <div className="relative flex-1 min-w-[280px]">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search commodities or locations..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="h-full px-6 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <HiFilter className="text-lg" />
                            <span className="hidden sm:inline uppercase text-[10px] tracking-widest">Sort By</span>
                            <HiChevronDown className={`transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showSortMenu && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                                {[
                                    { id: 'newest', label: 'Recently Updated', icon: <HiOutlineClock /> },
                                    { id: 'price-low', label: 'Price: Low to High', icon: <HiSortAscending /> },
                                    { id: 'price-high', label: 'Price: High to Low', icon: <HiSortDescending /> },
                                    { id: 'name', label: 'Item Name: A-Z', icon: <HiOutlineSearch /> }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all text-sm ${
                                            sortBy === opt.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-lg">{opt.icon}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Category Navigation */}
            <div className="flex overflow-x-auto gap-3 pb-8 mb-4 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest whitespace-nowrap transition-all border-2 ${
                            activeCategory === cat 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Market Content */}
            {Object.keys(groupedPrices).length > 0 ? (
                Object.keys(groupedPrices).map(category => (
                    <section key={category} className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                                {category}
                                <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black px-3 py-1 rounded-full">
                                    {groupedPrices[category].length} items
                                </span>
                            </h2>
                        </div>

                        <div className="responsive-grid">
                            {groupedPrices[category].map((item) => (
                                <div
                                    key={item._id}
                                    className={`card-premium group overflow-hidden border border-slate-100 hover:border-emerald-200 transition-all ${
                                        updatingItemId === item._id ? 'animate-pulse scale-[1.02] shadow-2xl' : ''
                                    }`}
                                >
                                    <div className="aspect-video bg-slate-50 relative overflow-hidden">
                                        <img
                                            src={item.image || getFallbackImage(item.itemName, item.category)}
                                            alt={item.itemName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.src = getFallbackImage(item.itemName, item.category); }}
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-emerald-600 flex items-center gap-1.5 shadow-sm border border-emerald-50">
                                            <HiOutlineLocationMarker className="text-sm" />
                                            {item.location || 'Local Mandi'}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-black text-slate-800 line-clamp-1">{item.itemName}</h3>
                                            <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                                                <HiOutlineTrendingUp /> Stable
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <HiOutlineClock /> Updated {formatRelativeTime(item.createdAt)}
                                        </p>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <span className="text-3xl font-black text-slate-800">₹{item.price}</span>
                                                <span className="text-xs font-bold text-slate-400 ml-1">/ unit</span>
                                            </div>
                                            {user && (
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Update Price"
                                                >
                                                    <HiOutlinePencilAlt className="text-xl" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="empty-state py-32 bg-white-bleed rounded-[48px] border-2 border-dashed border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-slate-50 flex-center mx-auto mb-8 text-slate-100 text-6xl">
                        <HiOutlineSearch />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-4">No results found</h2>
                    <p className="text-slate-500 max-w-sm mx-auto mb-10">We couldn't find any commodities matching your current search or filters.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                        className="btn-primary py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 shadow-xl shadow-emerald-100"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Price Update Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[1000] flex-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 pb-0 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800">Market Correction</h2>
                            <button className="w-10 h-10 rounded-full bg-slate-50 flex-center text-slate-400 hover:bg-slate-100 transition-colors" onClick={() => setSelectedItem(null)}>
                                <HiX className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="p-8 text-center pt-6">
                            <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-600 flex-center mx-auto mb-6 text-4xl">
                                <HiOutlineTrendingUp />
                            </div>
                            <p className="text-slate-500 font-bold mb-8">
                                Updating market rate for <strong className="text-slate-800">{selectedItem.itemName}</strong>
                            </p>

                            <form onSubmit={handleUpdatePrice} className="space-y-8">
                                <div className="space-y-2 text-left">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Set New Rate</label>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Current: ₹{selectedItem.price}</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₹</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border-none rounded-3xl py-6 pl-12 pr-6 text-3xl font-black text-slate-800 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-200"
                                            value={newPrice}
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            required
                                            autoFocus
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={updating}
                                    className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-emerald-600 shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    {updating ? 'Processing...' : 'Publish Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prices;
