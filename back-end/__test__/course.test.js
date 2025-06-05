
const request = require('supertest');
const app = require('../src/app'); 

describe('GET /api/course', () => {
    it('should return 200 and an array', async () => {
    const res = await request(app).get('/api/course');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000); 
});
