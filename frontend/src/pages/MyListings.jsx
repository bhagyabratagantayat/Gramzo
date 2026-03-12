import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineCalendar, HiOutlinePlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const navigate = useNavigate();

    const fetchMyListings = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                api.get('/agent/services'),
                api.get(`/products/agent/${user._id}`)
            ]);
            setServices(sRes.data.data || []);
            setProducts(pRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyListings();
    }, [user?._id]);

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await api.delete(`/${type}s/${id}`);
            if (type === 'service') setServices(services.filter(s => s._id !== id));
            else setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert(`Failed to delete ${type}`);
        }
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '60vh' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="merchant-listings-container app-container py-8">
            <header className="dash-header mb-12">
                <div className="dash-title-group">
                    <div className="dash-eyebrow">Inventory Management</div>
                    <h1 className="dash-title">Merchant Dashboard</h1>
                    <p className="dash-subtitle">Manage your professional services and marketplace products.</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <button onClick={() => navigate('/agent/marketplace')} className="btn-primary bg-amber-600 border-amber-600 hover:bg-amber-700 flex items-center gap-2 py-3 px-6 rounded-2xl">
                        <HiOutlinePlus className="text-xl" /> 
                        <span className="font-extrabold text-sm uppercase">Product</span>
                    </button>
                    <button onClick={() => navigate('/services')} className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl">
                        <HiOutlinePlus className="text-xl" /> 
                        <span className="font-extrabold text-sm uppercase">Service</span>
                    </button>
                </div>
            </header>

            {/* Products Section */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex-center text-xl">
                        <HiOutlineShoppingBag />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-800">Listed Products</h2>
                    <span className="ml-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                        {products.length} Items
                    </span>
                </div>

                {products.length > 0 ? (
                    <div className="responsive-grid">
                        {products.map(product => (
                            <div key={product._id} className="card-premium group overflow-hidden border border-slate-100 hover:border-amber-200">
                                <div className="aspect-[4/3] bg-slate-50 relative">
                                    {product.image ? (
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex-center text-slate-200 text-4xl">
                                            <HiOutlineShoppingBag />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete('product', product._id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm transition-all">
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-extrabold text-slate-800 line-clamp-1 mb-2">{product.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8 mb-4">{product.description}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <div className="text-price-large">₹{product.price}</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">Product</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state py-16 bg-white-bleed rounded-[32px]">
                        <HiOutlineShoppingBag className="empty-state-icon opacity-10" />
                        <h3>No products listed yet</h3>
                        <p>Items you list for sale will appear in this section.</p>
                    </div>
                )}
            </section>

            {/* Services Section */}
            <section className="pb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex-center text-xl">
                        <HiOutlineCalendar />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-800">Professional Services</h2>
                    <span className="ml-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                        {services.length} Services
                    </span>
                </div>

                {services.length > 0 ? (
                    <div className="responsive-grid">
                        {services.map(service => (
                            <div key={service._id} className="card-premium group overflow-hidden border border-slate-100 hover:border-blue-200">
                                <div className="aspect-[4/3] bg-slate-50 relative">
                                    {service.image ? (
                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex-center text-slate-200 text-4xl">
                                            <HiOutlineCalendar />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete('service', service._id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm transition-all">
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-extrabold text-slate-800 line-clamp-1 mb-2">{service.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8 mb-4">{service.description}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <div className="text-price-large">₹{service.price}</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-50 px-2 py-1 rounded">Service</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state py-16 bg-white-bleed rounded-[32px]">
                        <HiOutlineCalendar className="empty-state-icon opacity-10" />
                        <h3>No services listed yet</h3>
                        <p>Services you offer will appear in this section.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyListings;
