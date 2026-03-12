import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import AddProductForm from '../components/AddProductForm';
import { getUser } from '../services/auth';
import { HiOutlineTag, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShoppingBag, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const AgentMarketplace = () => {
    const user = getUser();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchAgentProducts = async () => {
        if (!user?._id) return;
        try {
            const response = await api.get(`/products/agent/${user._id}`);
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch agent products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentProducts();
    }, [user?._id]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchAgentProducts();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Loading your marketplace...
        </div>
    );

    return (
        <div className="agent-marketplace-container app-container py-8">
            {/* Header Section */}
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow text-orange-600 font-black">Merchant Hub</div>
                    <h1 className="dash-title">My Marketplace</h1>
                    <p className="dash-subtitle">Manage and monitor your listed products for the community.</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(true)} 
                    className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl bg-orange-600 border-orange-600 shadow-xl shadow-orange-100 font-black uppercase text-sm tracking-widest"
                >
                    <HiOutlinePlus className="text-xl" /> 
                    <span>Add Product</span>
                </button>
            </header>

            {/* Marketplace Content */}
            {products.length > 0 ? (
                <div className="responsive-grid">
                    {products.map((product) => (
                        <div key={product._id} className="card-premium group relative">
                            <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex-center text-slate-200 text-5xl bg-slate-50">
                                        <HiOutlineShoppingBag />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                                    Live
                                </div>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-rose-500 flex-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-500 hover:text-white"
                                    title="Delete Product"
                                >
                                    <HiOutlineTrash className="text-xl" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-black text-slate-800 line-clamp-1">{product.title}</h3>
                                </div>
                                
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    <HiOutlineLocationMarker className="text-orange-500" />
                                    {product.location}
                                </div>

                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Rate</span>
                                        <span className="text-2xl font-black text-slate-800">₹{product.price}</span>
                                    </div>
                                    <div className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                        Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state py-32 bg-white-bleed rounded-[48px] border-2 border-dashed border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-orange-50 flex-center mx-auto mb-8 text-orange-200 text-6xl shadow-inner">
                        <HiOutlineShoppingBag />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-4">Your market is empty</h2>
                    <p className="text-slate-500 max-w-sm mx-auto mb-10">Start adding your products to reach thousands of local customers in the community.</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary py-5 px-12 rounded-2xl font-black text-sm uppercase tracking-widest bg-orange-600 shadow-2xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
                    >
                        List First Product
                    </button>
                </div>
            )}

            {showAddForm && (
                <AddProductForm
                    onClose={() => setShowAddForm(false)}
                    onProductAdded={fetchAgentProducts}
                />
            )}
        </div>
    );
};

export default AgentMarketplace;
