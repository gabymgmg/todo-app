// testing that the code that integrates passport with our application is correct
const passportConfig = require('../passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models/index');
const messages = require('../utils/messages');

jest.mock('bcryptjs');
jest.mock('../models/index');

describe('Passport Configuration', () => {
    beforeEach(() => {
        passportConfig.init();
    });

    // Local Strategy Tests
    it('should authenticate a user with correct local credentials', async () => {
        // Testing that local strategy calls done with the user object, when the user is found and the password matches
        const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
        db.User.findOne.mockResolvedValue(user); // when the local strategy queries the database, the user object is returned
        bcrypt.compare.mockResolvedValue(true);

        const done = jest.fn();
        const localStrategy = passport._strategies.local; // retrieves the LocalStrategy instance from the passport object.

        await localStrategy._verify('test@example.com', 'password', done);

        expect(done).toHaveBeenCalledWith(null, user);
    });

    it('should not authenticate a user with incorrect password', async () => {
        const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
        db.User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);

        const done = jest.fn();
        const localStrategy = passport._strategies.local;

        await localStrategy._verify('test@example.com', 'wrongPassword', done);

        expect(done).toHaveBeenCalledWith(null, false, { message: messages.INCORRECT_PASSWORD });
    });

    it('should not authenticate a user if user is not found', async () => {
        db.User.findOne.mockResolvedValue(null);

        const done = jest.fn();
        const localStrategy = passport._strategies.local;

        await localStrategy._verify('nonexistent@example.com', 'password', done);

        expect(done).toHaveBeenCalledWith(null, false, { message: 'User not found' });
    });

    it('should handle errors during local authentication', async () => {
        db.User.findOne.mockRejectedValue(new Error('Database error'));

        const done = jest.fn();
        const localStrategy = passport._strategies.local;

        await localStrategy._verify('test@example.com', 'password', done);

        expect(done).toHaveBeenCalledWith(new Error('Database error'), false);
    });

    // JWT Strategy Tests
    it('should authenticate a user with valid jwt', async () => {
        const user = { id: 1, email: 'test@example.com' };
        db.User.findByPk.mockResolvedValue(user);
    
        const jwtStrategy = passport._strategies.jwt;
        const done = jest.fn();
    
        // Wrap jwtStrategy._verify in a Promise
        await new Promise((resolve) => {
            jwtStrategy._verify({ id: 1 }, (err, result) => {
                if (err) { done(err, null); } else { done(null, result); }
                resolve();
            });
        });
        //await jwtStrategy._verify({ id: 1 }, done);

        expect(done).toHaveBeenCalledWith(null, { id: 2, email: 'te2st@example.com' });

        console.log('jwt console', jwtStrategy._verify.toString())


    });

    it('should not authenticate a user with invalid jwt', async () => {
        db.User.findByPk.mockResolvedValue(null);

        const done = jest.fn();
        const jwtStrategy = passport._strategies.jwt;

        jwtStrategy._verify({ id: 1 }, done);

        expect(done).toHaveBeenCalledWith(null, false);
    });

    it('should handle errors during jwt authentication', async () => {
        db.User.findByPk.mockRejectedValue(new Error('Database error'));

        const done = jest.fn();
        const jwtStrategy = passport._strategies.jwt;

        jwtStrategy._verify({ id: 1 }, done);

        expect(done).toHaveBeenCalledWith(new Error('Database error'), null);
    });
});