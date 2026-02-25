import { Link } from 'react-router-dom';
import { getUser } from '../services/auth';
import {
    HiOutlineCalendar,
    HiOutlineShoppingBag,
    HiOutlineSpeakerphone,
    HiOutlineLightningBolt,
    HiArrowRight
} from 'react-icons/hi';

const features = [
    {
        icon: HiOutlineCalendar,
        title: 'Book Local Services',
        desc: 'Find electricians, plumbers, and agricultural experts in your village within minutes.',
        accent: '#2563eb',
        bg: '#eff6ff',
        link: '/services',
        cta: 'Browse Services'
    },
    {
        icon: HiOutlineShoppingBag,
        title: 'Village Marketplace',
        desc: 'Buy and sell fresh produce, handmade goods, and everyday items from your community.',
        accent: '#ea580c',
        bg: '#fff7ed',
        link: '/marketplace',
        cta: 'Visit Marketplace'
    },
    {
        icon: HiOutlineSpeakerphone,
        title: 'Community Notices',
        desc: 'Stay updated with alerts, government schemes, and local announcements in real time.',
        accent: '#7c3aed',
        bg: '#f5f3ff',
        link: '/notices',
        cta: 'Read Notices'
    }
];

const Home = () => {
    const user = getUser();

    return (
        <div style={{ backgroundColor: 'var(--bg-color)' }}>

            {/* ── Hero ──────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
                padding: '88px 24px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* decorative blobs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#bfdbfe', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 14px', borderRadius: '999px', marginBottom: '24px' }}>
                        <HiOutlineLightningBolt /> Gramzo Platform
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#fff', letterSpacing: '-0.04em', margin: '0 0 20px', lineHeight: 1.1 }}>
                        Connecting Villages to the Digital Economy
                    </h1>

                    <p style={{ fontSize: '1.15rem', color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Book trusted local services, trade community goods, and stay informed — all in one platform built for Bharat.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <Link to="/dashboard" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                backgroundColor: '#fff', color: 'var(--primary-color)',
                                padding: '14px 28px', borderRadius: '12px',
                                fontWeight: '800', fontSize: '1rem',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                textDecoration: 'none', transition: 'var(--transition)'
                            }}>
                                Go to Dashboard <HiArrowRight />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: '#fff', color: 'var(--primary-color)',
                                    padding: '14px 28px', borderRadius: '12px',
                                    fontWeight: '800', fontSize: '1rem',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                    textDecoration: 'none', transition: 'var(--transition)'
                                }}>
                                    Sign In <HiArrowRight />
                                </Link>
                                <Link to="/signup" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
                                    border: '1.5px solid rgba(255,255,255,0.35)',
                                    padding: '14px 28px', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '1rem',
                                    textDecoration: 'none', transition: 'var(--transition)'
                                }}>
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Stats Strip ───────────────────────────── */}
            <section style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', padding: '28px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
                    {[
                        { value: '500+', label: 'Villages Served' },
                        { value: '2,000+', label: 'Verified Agents' },
                        { value: '10,000+', label: 'Bookings Made' }
                    ].map(stat => (
                        <div key={stat.label}>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-0.04em' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ──────────────────────────────── */}
            <section style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                    <div className="section-eyebrow">What We Offer</div>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: '900', margin: '8px 0 14px', letterSpacing: '-0.03em' }}>
                        Everything your community needs
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
                        One platform covering services, goods, and community updates for rural India.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {features.map(f => (
                        <div key={f.title} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: f.bg, color: f.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem' }}>
                                <f.icon />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: '800' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.65, fontSize: '0.95rem' }}>{f.desc}</p>
                            </div>
                            <Link to={f.link} style={{
                                marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: f.accent, fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none'
                            }}>
                                {f.cta} <HiArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ────────────────────────────── */}
            {!user && (
                <section style={{ padding: '0 24px 80px' }}>
                    <div style={{
                        maxWidth: '900px', margin: '0 auto',
                        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                        borderRadius: '24px', padding: '56px 48px', textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(37,99,235,0.25)'
                    }}>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', margin: '0 0 14px', fontWeight: '900', letterSpacing: '-0.03em' }}>
                            Join 10,000+ community members today
                        </h2>
                        <p style={{ color: '#bfdbfe', margin: '0 0 32px', fontSize: '1.05rem' }}>
                            Sign up in seconds. No passwords. Just your name and phone.
                        </p>
                        <Link to="/signup" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'var(--primary-color)',
                            padding: '14px 32px', borderRadius: '12px',
                            fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                        }}>
                            Get Started Free <HiArrowRight />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
