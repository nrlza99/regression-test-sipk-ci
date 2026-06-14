const request = require('supertest');
const app = require('../server-crud.js');

describe('Regression Test Suite - CRUD /data', () => {
  let createdId;

  // TEST 1: GET /data - HAPPY PATH
  test('HAPPY PATH - GET /data - should return empty array initially', async () => {
    const res = await request(app).get('/data');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // TEST 2: POST /data - HAPPY PATH
  test('HAPPY PATH - POST /data - should create new data', async () => {
    const res = await request(app).post('/data').send({ name: 'Item 1', value: 100 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Item 1');
    createdId = res.body.id;
  });

  // TEST 3: POST /data - ERROR SCENARIO
  test('ERROR SCENARIO - POST /data - should return 400 if name is missing', async () => {
    const res = await request(app).post('/data').send({ value: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  // TEST 4: POST /data - ERROR SCENARIO
  test('ERROR SCENARIO - POST /data - should return 400 if value is missing', async () => {
    const res = await request(app).post('/data').send({ name: 'No Value' });
    expect(res.statusCode).toBe(400);
  });

  // TEST 5: GET /data/:id - HAPPY PATH
  test('HAPPY PATH - GET /data/:id - should return data by id', async () => {
    const res = await request(app).get(`/data/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  // TEST 6: GET /data/:id - ERROR SCENARIO
  test('ERROR SCENARIO - GET /data/:id - should return 404 if not found', async () => {
    const res = await request(app).get('/data/9999');
    expect(res.statusCode).toBe(404);
  });

  // TEST 7: PUT /data/:id - HAPPY PATH
  test('HAPPY PATH - PUT /data/:id - should update existing data', async () => {
    const res = await request(app).put(`/data/${createdId}`).send({ name: 'Updated', value: 999 });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated');
    expect(res.body.value).toBe(999);
  });

  // TEST 8: PUT /data/:id - ERROR SCENARIO
  test('ERROR SCENARIO - PUT /data/:id - should return 404 if not found', async () => {
    const res = await request(app).put('/data/9999').send({ name: 'Ghost' });
    expect(res.statusCode).toBe(404);
  });

  // TEST 9: DELETE /data/:id - HAPPY PATH
  test('HAPPY PATH - DELETE /data/:id - should delete existing data', async () => {
    const res = await request(app).delete(`/data/${createdId}`);
    expect(res.statusCode).toBe(204);
  });

  // TEST 10: DELETE /data/:id - ERROR SCENARIO
  test('ERROR SCENARIO - DELETE /data/:id - should return 404 if not found', async () => {
    const res = await request(app).delete('/data/9999');
    expect(res.statusCode).toBe(404);
  });
});