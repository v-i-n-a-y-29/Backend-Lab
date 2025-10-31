const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user-Model');

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user with a duplicate email', async () => {
        // First, create a user
        await request(app)
            .post('/users/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        // Then, try to create another user with the same email
        const res = await request(app)
            .post('/users/register')
            .send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password456'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'User with this email already exists');
    });

    it('should log in a registered user', async () => {
        // First, register a user
        await request(app)
            .post('/users/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        // Then, log in with that user
        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
