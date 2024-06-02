const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);
const { MongoClient, ObjectId } = require('mongodb');

describe('Addresses API', () => {
    let connection;
    let db;
    let addressId;
    let authToken;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db('testDatabase'); // Use a test database

        // Simulate login to get an auth token
        const loginResponse = await request.get('/login'); // Adjust if needed
        authToken = loginResponse.body.token; // Assuming the token is returned in the response body

        // Insert a test address to use for subsequent tests
        const address = await db.collection('addresses').insertOne({
            streetAddress: '123 Initial St',
            city: 'Initial City',
            state: 'IC',
            zipCode: '12345'
        });
        addressId = address.insertedId;
    });

    afterAll(async () => {
        await db.collection('addresses').deleteMany({});
        await connection.close();
    });

    test('responds to GET /addresses', async () => {
        const res = await request.get('/addresses/')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('responds to GET /addresses/:id', async () => {
        const res = await request.get(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', addressId.toString());
    });

    test('responds to POST /addresses', async () => {
        const newAddress = {
            streetAddress: '123 New St',
            city: 'New City',
            state: 'NC',
            zipCode: '12345'
        };
        const res = await request.post('/addresses')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newAddress);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'addresses inserted successfully');

        // Verify that the new address was inserted into the database
        const insertedAddress = await db.collection('addresses').findOne({ streetAddress: '123 New St' });
        expect(insertedAddress).toBeTruthy();
    });

    test('responds to PUT /addresses/:id', async () => {
        const updatedAddress = {
            streetAddress: '456 Updated St',
            city: 'Updated City',
            state: 'UC',
            zipCode: '67890'
        };
        const res = await request.put(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedAddress);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'addresses updated successfully');

        // Verify that the address was updated in the database
        const updatedAddressInDb = await db.collection('addresses').findOne({ _id: new ObjectId(addressId) });
        expect(updatedAddressInDb).toHaveProperty('streetAddress', '456 Updated St');
    });

    test('responds to DELETE /addresses/:id', async () => {
        const res = await request.delete(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'addresses deleted successfully');

        // Verify that the address was deleted from the database
        const deletedAddress = await db.collection('addresses').findOne({ _id: new ObjectId(addressId) });
        expect(deletedAddress).toBeNull();
    });
});
