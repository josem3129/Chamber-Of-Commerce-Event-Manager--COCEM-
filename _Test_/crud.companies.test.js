const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);
const { MongoClient, ObjectId } = require('mongodb');

describe('Companies API', () => {
    let connection;
    let db;
    let companyId;
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

        // Insert a test company to use for subsequent tests
        const company = await db.collection('companies').insertOne({
            name: 'Test Company',
            addressId: new ObjectId(),
            phone: '(123) 456-7890',
            emailAddress: 'test@company.com',
            membershipLevel: 'Gold',
            joinedOn: '20240601'
        });
        companyId = company.insertedId;
    });

    afterAll(async () => {
        await db.collection('companies').deleteMany({});
        await connection.close();
    });

    test('responds to GET /companies', async () => {
        const res = await request.get('/companies/')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('responds to GET /companies/:id', async () => {
        const res = await request.get(`/companies/${companyId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', companyId.toString());
    });

    test('responds to POST /companies', async () => {
        const newCompany = {
            name: 'New Company',
            addressId: new ObjectId(),
            phone: '(123) 456-7891',
            emailAddress: 'new@company.com',
            membershipLevel: 'Silver',
            joinedOn: '20240602'
        };
        const res = await request.post('/companies')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newCompany);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'companies inserted successfully');

        // Verify that the new company was inserted into the database
        const insertedCompany = await db.collection('companies').findOne({ name: 'New Company' });
        expect(insertedCompany).toBeTruthy();
    });

    test('responds to PUT /companies/:id', async () => {
        const updatedCompany = {
            name: 'Updated Company',
            addressId: new ObjectId(),
            phone: '(123) 456-7892',
            emailAddress: 'updated@company.com',
            membershipLevel: 'Platinum',
            joinedOn: '20240603'
        };
        const res = await request.put(`/companies/${companyId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedCompany);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'companies updated successfully');

        // Verify that the company was updated in the database
        const updatedCompanyInDb = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
        expect(updatedCompanyInDb).toHaveProperty('name', 'Updated Company');
    });

    test('responds to DELETE /companies/:id', async () => {
        const res = await request.delete(`/companies/${companyId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'companies deleted successfully');

        // Verify that the company was deleted from the database
        const deletedCompany = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
        expect(deletedCompany).toBeNull();
    });
});
