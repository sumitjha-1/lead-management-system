import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

beforeAll(async () => await connectTestDB(), 30000);
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Lead Lifecycle Flow', () => {
  const adminData = { name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'admin' };
  const memberData = { name: 'Member', email: 'member@test.com', password: 'password123', role: 'member' };

  const loginAs = async (creds) => {
    const res = await request(app).post('/api/auth/login').send(creds);
    return res.headers['set-cookie'];
  };

  test('admin creates a lead, assigns it to a member, member updates its status', async () => {
    await User.create(adminData);
    const member = await User.create(memberData);

    const adminCookie = await loginAs({ email: adminData.email, password: adminData.password });

    // Admin creates a lead
    const createRes = await request(app)
      .post('/api/leads')
      .set('Cookie', adminCookie)
      .send({
        fullName: 'Test Lead',
        email: 'lead@test.com',
        phone: '1234567890',
        leadSource: 'Website'
      });

    expect(createRes.statusCode).toBe(201);
    const leadId = createRes.body.lead._id;
    expect(createRes.body.lead.status).toBe('New');

    // Admin assigns it to the member
    const assignRes = await request(app)
      .put(`/api/leads/${leadId}/assign`)
      .set('Cookie', adminCookie)
      .send({ memberId: member._id.toString() });

    expect(assignRes.statusCode).toBe(200);
    expect(assignRes.body.lead.assignedTo).toBe(member._id.toString());
    expect(assignRes.body.lead.assignmentHistory.length).toBe(1);

    // Member logs in and updates the lead's status
    const memberCookie = await loginAs({ email: memberData.email, password: memberData.password });

    const statusRes = await request(app)
      .put(`/api/leads/${leadId}/status`)
      .set('Cookie', memberCookie)
      .send({ status: 'Contacted' });

    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.lead.status).toBe('Contacted');
    expect(statusRes.body.lead.statusHistory.length).toBe(2); // 'New' + 'Contacted'
  });

  test('member cannot update the status of a lead not assigned to them', async () => {
    await User.create(adminData);
    const member = await User.create(memberData);
    const otherMember = await User.create({ name: 'Other', email: 'other@test.com', password: 'password123', role: 'member' });

    const adminCookie = await loginAs({ email: adminData.email, password: adminData.password });

    const createRes = await request(app)
      .post('/api/leads')
      .set('Cookie', adminCookie)
      .send({ fullName: 'Unassigned Lead', email: 'lead2@test.com', phone: '5551234567', leadSource: 'Referral' });

    const leadId = createRes.body.lead._id;

    // Assign to "otherMember", not "member"
    await request(app)
      .put(`/api/leads/${leadId}/assign`)
      .set('Cookie', adminCookie)
      .send({ memberId: otherMember._id.toString() });

    const memberCookie = await loginAs({ email: memberData.email, password: memberData.password });

    const statusRes = await request(app)
      .put(`/api/leads/${leadId}/status`)
      .set('Cookie', memberCookie)
      .send({ status: 'Contacted' });

    expect(statusRes.statusCode).toBe(403);
  });
});