import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

beforeAll(async () => await connectTestDB(), 30000);
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Public Lead Capture Flow', () => {
  test('anonymous user can submit a lead without auth, and admin can see it', async () => {
    const publicRes = await request(app)
      .post('/api/leads/public')
      .send({
        fullName: 'Anonymous Visitor',
        email: 'visitor@test.com',
        phone: '9998887777',
        leadSource: 'Website'
      });

    expect(publicRes.statusCode).toBe(201);
    expect(publicRes.body.success).toBe(true);

    await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'admin' });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    const cookie = loginRes.headers['set-cookie'];

    const leadsRes = await request(app)
      .get('/api/leads?search=Anonymous')
      .set('Cookie', cookie);

    expect(leadsRes.statusCode).toBe(200);
    expect(leadsRes.body.leads.length).toBe(1);
    expect(leadsRes.body.leads[0].email).toBe('visitor@test.com');
  });

  test('rejects public submission with missing required fields', async () => {
    const res = await request(app)
      .post('/api/leads/public')
      .send({ fullName: 'Incomplete Lead' }); // missing email, phone, leadSource

    expect(res.statusCode).toBe(400);
  });
});