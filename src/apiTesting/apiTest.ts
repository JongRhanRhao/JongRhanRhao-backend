import axios from 'axios';
// Re-export everything from apiTest.ts
export * from './apiTest';

// Login and get JWT token
const login = async (): Promise<string | null> => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'test@example.com',
            password: '183423423',
        });
        const token = response.data.token;
        return token;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Login failed:', error.message);
        } else {
            console.error('Login failed:', error);
        }
        return null;
    }
};

// Test reservation API with authentication
export const testReservation = async () => {
    const token = await login();
    if (!token) {
        console.error('Authentication failed, unable to test reservation API.');
        return;
    }

    try {
        // Example: Create a new reservation
        const reservationData = {
            "tableId": 1,
            "numberOfTable": 10,
            "customerId": 123,
            "reservationTime": "2024-08-09T18:00:00Z",
            "numberOfPeople": 4,
            "customerName": "John Doe",
            "customerPhone": "+1234567890"
        };
        const createResponse = await axios.post(
            'http://localhost:3000/api/auth/reservations',
            reservationData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('Create reservation response:', createResponse.data);

        // Example: Get all reservations
        const getResponse = await axios.get('http://localhost:3000/api/reservations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Get all reservations response:', getResponse.data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error testing reservation API:', error.message);
        } else {
            console.error('Error testing reservation API:', error);
        }
    }
};

testReservation();