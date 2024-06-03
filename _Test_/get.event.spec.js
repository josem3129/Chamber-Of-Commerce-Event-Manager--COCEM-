const app = require('../server')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const { MongoClient } = require('mongodb');

describe('Test Handlers', () => {
    let connection;
    
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });        
    });
    afterAll(async() => {
        await connection.close()
    });
    //Test GET ALL 
    it('responds to /event', async () => {
        const res = await request.get('/events');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.name === "Buy One Get One At Full Price!")).toBe(true)
    })
    it('responds to /rsvp', async () => {
        const res = await request.get('/rsvp');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.name === "John Doe")).toBe(true)
    })
    it('responds to /address', async () => {
        const res = await request.get('/addresses');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.streetAddress === "140 W University Pkwy")).toBe(true)
    })
    it('responds to /companies', async () => {
        const res = await request.get('/companies');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text).some(x => x.emailAddress === "test@company.com")).toBe(true)
    })

    //with IDs
    it('responds to /event/{id}', async () => {
        const res = await request.get('/events/664d55f9cc7212b1b5f4bf52');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200)
        const event = JSON.parse(res.text);
        expect(typeof event).toBe('object');
        expect(event).toHaveProperty('name', 'Buy One Get One At Full Price!');
    })
    it('responds to /rsvp/{id}', async () => {
        const res = await request.get('/rsvp/664d57d0cc7212b1b5f5cf81');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        const rsvp = res.body;
        expect(typeof rsvp).toBe('object');
        expect(rsvp).toHaveProperty('name', 'John Doe');
    });
    
    it('responds to /addresses/{id}', async () => {
        const res = await request.get('/addresses/664d52fecc7212b1b5f2ff35');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        const address = res.body;
        expect(typeof address).toBe('object');
        expect(address).toHaveProperty('streetAddress', '140 W University Pkwy');
    });
    
    it('responds to /companies/{id}', async () => {
        const res = await request.get('/companies/665c0e442f019b7dbd8727f0');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        const company = res.body;
        expect(typeof company).toBe('object');
        expect(company).toHaveProperty('emailAddress', 'test@company.com');
    });
})