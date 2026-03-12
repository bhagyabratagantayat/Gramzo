const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAuth = async () => {
    try {
        console.log('--- Testing Authentication & RBAC ---');

        // 1. Login as Admin
        console.log('Logging in as Admin...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@gramzo.com',
            password: 'admin123'
        });
        const adminToken = adminLogin.data.accessToken;
        console.log('Admin login successful.');

        // 2. Verify Admin Access (Private Route)
        console.log('Verifying Admin access to /api/admin/agents...');
        const adminAccess = await axios.get(`${API_URL}/admin/agents`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Admin access verified.');

        // 3. Login as User
        console.log('Logging in as User...');
        const userLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'user@gramzo.com',
            password: 'user123'
        });
        const userToken = userLogin.data.accessToken;
        console.log('User login successful.');

        // 4. Verify User RBAC (Should fail admin route)
        console.log('Verifying User restriction from admin route...');
        try {
            await axios.get(`${API_URL}/admin/agents`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('FAIL: User was able to access admin route!');
        } catch (error) {
            console.log('SUCCESS: User blocked from admin route. Status:', error.response.status);
        }

        // 5. Verify User Access to services
        console.log('Verifying User access to /api/services...');
        const servicesAccess = await axios.get(`${API_URL}/services`);
        console.log('Public services access verified. Count:', servicesAccess.data.data.length);

        console.log('--- Auth & RBAC Verification Complete ---');
    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
    }
};

testAuth();
