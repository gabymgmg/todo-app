require("dotenv").config();
const request = require('supertest');
const server = require('../index');
const db = require('../models/index.mock');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth')
const messages = require('../utils/messajes')

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
            logout: jest.fn(),
            cookies: { // Mock req.cookies
                jwt: 'someToken' // Dummy jwt token
              }
        };
        res = {
            status: jest.fn().mockReturnThis(), // makes res.status return the res object itself
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            redirect: jest.fn(),
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

    describe('Login User', () => {
        it('should successfully log in a user', () => {
            passport.authenticate = jest.fn().mockImplementation((strategy, options, callback) => {
                callback(null, { id: 123 }, null);
                return (req, res) => { }; // Returning an empty middleware 
            });

            authController.loginUser(req, res);

            expect(passport.authenticate).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockedToken', { httpOnly: true });
            expect(res.json).toHaveBeenCalledWith({ message: messages.LOGIN_SUCCESS });
        });

        it('should return 401 for invalid credentials', () => {
            passport.authenticate = jest.fn().mockImplementation((strategy, options, callback) => {
                callback(null, null, { message: messages.INVALID_CREDENTIALS });
                return (req, res) => { };
            });

            authController.loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: messages.INVALID_CREDENTIALS });
        });

        it('should return 500 for authentication error', () => {
            passport.authenticate = jest.fn().mockImplementation((strategy, options, callback) => {
                callback(new Error('Authentication Error'), null, null); // Simulates the error objs
                return (req, res) => { };
            });

            authController.loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: messages.AUTHENTICATION_ERROR });
        });
    })

    describe('Logout User', () => {
        it('should successfully log out a user', () => {
            authController.logoutUser(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('jwt');
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.redirect).toHaveBeenCalledWith('/login')
        });
    })
})

