import axios from 'axios';
import { faker } from '@faker-js/faker';

// Generate random user data using faker
const generateRandomUser = () => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(8), // At least 8 characters
        role: 'user', // You can modify this if needed
    };
};

// Test user creation API without authentication
export const testUserCreation = async () => {
    try {
        // Generate random user data
        const userData = generateRandomUser();
        console.log('Generated user data:', userData);
        console.log('Request body:', JSON.stringify(userData)); 

        // Create a new user
        const createResponse = await axios.post(
            'http://localhost:3000/api/auth/register', // Ensure this matches the route for creating users
            userData
        );
        console.log('Create user response:', createResponse.data);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error testing user creation API:', error.message);
        } else {
            console.error('Error testing user creation API:', error);
        }
    }
};

// Run the test
testUserCreation();