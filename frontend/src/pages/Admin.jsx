import { useState, useEffect } from 'react';
import api from '../services/api';
import { isAdmin } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';

const Admin = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAgents = async () => {
        try {
            const response = await api.get('/agents');
            setAgents(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch agents');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
            return;
        }
        fetchAgents();
    }, [navigate]);

    const handleApprove = async (agentId) => {
        try {
            await api.patch(`/agents/approve/${agentId}`);
            fetchAgents();
        } catch (err) {
            alert('Failed to approve agent.');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
            Accessing admin portal...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ marginBottom: '48px' }}>
                <div style={{ color: 'var(--danger-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Management Console
                </div>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HiOutlineShieldCheck /> Agent Approvals
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>
                    Review and verify agent applications to maintain platform quality.
                </p>
            </header>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agent Name</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map(agent => (
                                <tr key={agent._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '20px 24px', fontWeight: '600' }}>{agent.name}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{agent.location}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        {agent.isApproved ? (
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                color: 'var(--success-color)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <HiOutlineCheckCircle /> Approved
                                            </span>
                                        ) : (
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                color: 'var(--accent-color)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <HiOutlineClock /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        {!agent.isApproved && (
                                            <button
                                                onClick={() => handleApprove(agent._id)}
                                                className="btn-primary"
                                                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                            >
                                                Approve Agent
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {agents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                        <HiOutlineUserGroup style={{ fontSize: '3.5rem', color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                        <h3 style={{ margin: 0 }}>No agents found</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>There are currently no agents registered on the platform.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
