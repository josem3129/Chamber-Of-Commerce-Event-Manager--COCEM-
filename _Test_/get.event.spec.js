const app = require('../server')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const { MongoClient } = require('mongodb');

describe('Test Handlers', () => {
    
    beforeAll(async () => {

        connection = await MongoClient.connect(process.env.CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db('events')
        
    });
    afterAll(async() => {
        await connection.close()
    });
    
    test('responds to /event', async () => {
        const res = await request.get('/events/');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.name === "Buy One Get One At Full Price!")).toBe(true)
    })
    test('responds to /rsvp', async () => {
        const res = await request.get('/rsvp/');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.name === "John Doe")).toBe(true)
    })
    test('responds to /address', async () => {
        const res = await request.get('/addresses/');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.streetAddress === "140 W University Pkwy")).toBe(true)
    })
    test('responds to /companies', async () => {
        const res = await request.get('/companies/');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.emailAddress === "manager@walmart.com")).toBe(true)
    })
})