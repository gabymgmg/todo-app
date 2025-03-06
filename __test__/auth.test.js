require("dotenv").config();
const request = require('supertest');
const server = require('../index');
const db = require('../models/index.mock');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth')

describe('Authentication', () => {
    let req, res;

    beforeEach(() => {
        // Mock body and response
        req = {
            body: {
                username: 'testuser',
                password: 'password123',
                name: 'Test User',
                email: 'test@example.com'
            },
            logout: jest.fn() 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(), 
            redirect: jest.fn(),
            //status: jest.fn(),
            send: jest.fn(), 
            render: jest.fn()
        };

        // Mock process.env
        process.env.JWT_SECRET = 'testsecret';
        process.env.JWT_EXPIRATION = '1h';
        process.env.JWT_REFRESH_SECRET = 'testrefreshsecret';
        process.env.JWT_REFRESH_EXPIRATION = '7d';

        // Mock jwt.sign
        jwt.sign = jest.fn().mockReturnValue('mockedToken');

        // Reset database mocks
        db.User.findOne.mockReset();
        db.User.create.mockReset();

        jest.clearAllMocks(); // Clear all jest mocks
    });

    describe('Register User', () => {
        it('should register a new user', async () => {
            db.User.findOne.mockResolvedValue(null); // When user doesn't exist
            db.User.create.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
            });


            await authController.registerUser(req, res);

            expect(res.redirect).toHaveBeenCalledWith('login?registrationdone');
            expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(db.User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
        
        it('should return error when user already exists', async () => {
            db.User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });
            await authController.registerUser(req, res);

            expect(res.render).toHaveBeenCalled();
            expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(db.User.create).not.toHaveBeenCalled();
        });
    })
})

