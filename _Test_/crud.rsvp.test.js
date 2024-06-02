const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);
const { MongoClient, ObjectId } = require('mongodb');

describe('RSVP API', () => {
    let connection;
    let db;
    let rsvpId;
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

        // Insert a test RSVP to use for subsequent tests
        const rsvp = await db.collection('rsvp').insertOne({
            name: 'Test Attendee',
            eventId: new ObjectId(),
            companyName: 'Test Company',
            position: 'Manager',
            phone: '(123) 456-7890',
            emailAddress: 'test@company.com',
            numberOfGuests: 2,
            comments: 'Looking forward to it!'
        });
        rsvpId = rsvp.insertedId;
    });

    afterAll(async () => {
        await db.collection('rsvp').deleteMany({});
        await connection.close();
    });

    test('responds to GET /rsvp', async () => {
        const res = await request.get('/rsvp/')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('responds to GET /rsvp/:id', async () => {
        const res = await request.get(`/rsvp/${rsvpId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', rsvpId.toString());
    });

    test('responds to POST /rsvp', async () => {
        const newRsvp = {
            name: 'New Attendee',
            eventId: new ObjectId(),
            companyName: 'New Company',
            position: 'CEO',
            phone: '(123) 456-7891',
            emailAddress: 'new@company.com',
            numberOfGuests: 3,
            comments: 'Excited to join!'
        };
        const res = await request.post('/rsvp')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newRsvp);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'rsvp inserted successfully');

        // Verify that the new RSVP was inserted into the database
        const insertedRsvp = await db.collection('rsvp').findOne({ name: 'New Attendee' });
        expect(insertedRsvp).toBeTruthy();
    });

    test('responds to PUT /rsvp/:id', async () => {
        const updatedRsvp = {
            name: 'Updated Attendee',
            eventId: new ObjectId(),
            companyName: 'Updated Company',
            position: 'CTO',
            phone: '(123) 456-7892',
            emailAddress: 'updated@company.com',
            numberOfGuests: 4,
            comments: 'Looking forward to it even more!'
        };
        const res = await request.put(`/rsvp/${rsvpId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedRsvp);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'rsvp updated successfully');

        // Verify that the RSVP was updated in the database
        const updatedRsvpInDb = await db.collection('rsvp').findOne({ _id: new ObjectId(rsvpId) });
        expect(updatedRsvpInDb).toHaveProperty('name', 'Updated Attendee');
    });

    test('responds to DELETE /rsvp/:id', async () => {
        const res = await request.delete(`/rsvp/${rsvpId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'rsvp deleted successfully');

        // Verify that the RSVP was deleted from the database
        const deletedRsvp = await db.collection('rsvp').findOne({ _id: new ObjectId(rsvpId) });
        expect(deletedRsvp).toBeNull();
    });
});
