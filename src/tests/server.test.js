import request from 'supertest';
import app from '../server.js';

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/health', () => {
  it('should show LearnX LMS API is running', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    
    expect(res.body).toEqual({
      success: true,
      message: 'LearnX LMS API is running'
    });
  });
});