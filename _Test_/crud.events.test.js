const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);
const { MongoClient, ObjectId } = require('mongodb');

describe('Events API', () => {
    let connection;
    let db;
    let eventId;
    let authToken;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db('events'); // Use a test database

        // Simulate login to get an auth token
        const loginResponse = await request.get('/login'); // Adjust if needed
        authToken = loginResponse.body.token; // Assuming the token is returned in the response body

        // Insert a test event to use for subsequent tests
        const event = await db.collection('events').insertOne({
            name: 'Test Event',
            addressId: new ObjectId(),
            description: 'This is a test event',
            date: '20240601'
        });
        eventId = event.insertedId;
    });

    afterAll(async () => {
        await db.collection('events').deleteMany({});
        await connection.close();
    });

    test('responds to GET /events', async () => {
        const res = await request.get('/events/')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('responds to GET /events/:id', async () => {
        const res = await request.get(`/events/664d55f9cc7212b1b5f4bf52`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', eventId.toString());
    });

    test('responds to POST /events', async () => {
        const newEvent = {
            name: 'New Event',
            addressId: new ObjectId(),
            description: 'This is a new event',
            date: '20240602'
        };
        const res = await request.post('/events')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newEvent);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'events inserted successfully');

        // Verify that the new event was inserted into the database
        const insertedEvent = await db.collection('events').findOne({ name: 'New Event' });
        expect(insertedEvent).toBeTruthy();
    });

    test('responds to PUT /events/:id', async () => {
        const updatedEvent = {
            name: 'Updated Event',
            addressId: new ObjectId(),
            description: 'This is an updated event',
            date: '20240603'
        };
        const res = await request.put(`/events/${eventId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedEvent);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'events updated successfully');

        // Verify that the event was updated in the database
        const updatedEventInDb = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
        expect(updatedEventInDb).toHaveProperty('name', 'Updated Event');
    });

    test('responds to DELETE /events/:id', async () => {
        const res = await request.delete(`/events/${eventId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'events deleted successfully');

        // Verify that the event was deleted from the database
        const deletedEvent = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
        expect(deletedEvent).toBeNull();
    });
});

