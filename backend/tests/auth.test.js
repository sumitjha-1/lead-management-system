import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

beforeAll(async () => await connectTestDB(), 30000);
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Auth Rules', () => {
  const adminData = { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' };
  const memberData = { name: 'Member User', email: 'member@test.com', password: 'password123', role: 'member' };

  test('rejects login with wrong password', async () => {
    await User.create(adminData);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: adminData.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('logs in successfully with correct credentials and sets a cookie', async () => {
    await User.create(adminData);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: adminData.email, password: adminData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(adminData.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('blocks access to a protected route without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('blocks a member from accessing admin-only user routes', async () => {
    await User.create(memberData);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: memberData.email, password: memberData.password });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/users')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(403);
  });

  test('allows an admin to access admin-only user routes', async () => {
    await User.create(adminData);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: adminData.email, password: adminData.password });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/users')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});