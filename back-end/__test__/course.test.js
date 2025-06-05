const request = require('supertest');
const app = require('../src/app'); // Đường dẫn tới app.js của bạn

describe('GET /courses', () => {
  it('should return an array of courses and status 200', async () => {
    const res = await request(app).get('/courses');
    
    // Kiểm tra mã trạng thái
    expect(res.statusCode).toBe(200);

    // Kiểm tra kiểu dữ liệu
    expect(Array.isArray(res.body)).toBe(true);

    // Kiểm tra phần tử đầu tiên có trường "courseName" (nếu có)
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('courseName');
    }
  });
});
