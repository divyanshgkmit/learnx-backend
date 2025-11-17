import request from 'supertest';
import app from '../server.js';

describe('Server Health Check', () => {
  it('should return API health status', async () => {
    const response = await request(app).get('/api/health');
  
    if (response.body.database === 'connected') {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    } else {
      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
    }
  });

  it('should return correct health message', async () => {
    const response = await request(app).get('/api/health');

    if (response.body.database === 'connected') {
      expect(response.body.message).toBe('LearnX LMS API is running');
    } else {
      expect(response.body.message).toBe('Database connection failed. Service is currently unavailable.');
    }
  });
});
