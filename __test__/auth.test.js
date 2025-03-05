require("dotenv").config();
const request = require('supertest');
const server = require('../index');
const db = require('../models/index.mock');
const bcrypt = require('bcryptjs');


describe('Authentication', () => {
    beforeEach(() => {
        // Reset mocks before each test
        db.User.findOne.mockReset();
        db.User.create.mockReset();
    });
    it('should register a new user', async () => {
        // 1. Mock db.User.findOne to simulate user not found
        db.User.findOne.mockResolvedValue(null);
        // 2. Mock db.User.create to simulate successful creation
        db.User.create.mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test1@example.com',
        });
        // 3. Make a request to your register route
        const response = await request(server)
            .post('/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
            console.log(response.text)
        // 4. Assertions
        expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(db.User.create).toHaveBeenCalled(); // Verify create was called.
        expect(response.statusCode).toBe(302); // Expect redirect
        expect(response.headers.location).toBe('login?registrationdone'); // Expect redirect location
        // Verify create was called with the correct parameters, including the hashed password.
        expect(db.User.create.mock.calls[0][0].name).toBe('Test User');
        expect(db.User.create.mock.calls[0][0].email).toBe('test@example.com');
        // Verify that the password was hashed.
        expect(bcrypt.compareSync('password123', db.User.create.mock.calls[0][0].password)).toBe(true);
    });
});

