// test/course.test.js

import request from 'supertest';
import app from '../app'; // Assuming your Express app instance is properly exported
import Cours from '../models/Cours'; // Adjust path to your model definition

describe('Cours API', () => {
  let courseId; // Store the created course ID for later use

  beforeAll(async () => {
    // Clear any existing data or ensure a clean state before tests
    await Cours.deleteMany({});
  });

  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/cours')
      .send({
        title: 'Test Course',
        description: 'Test Description',
        userId: 'testuser123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Course');

    // Store the created course ID for later use
    courseId = res.body._id;
  });

 

  // Add more tests for other endpoints and scenarios
});
