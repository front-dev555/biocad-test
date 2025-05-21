import request from 'supertest'
import app from '../src/app'

describe('Auth API', () => {
  test('POST /api/register — успешная регистрация', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'testuser@example.com', password: 'testpassword' })

    expect([201, 409]).toContain(res.status)
  })

  test('POST /api/login — успешный логин', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('refreshToken')
  })

  test('POST /api/login — невалидный логин', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })
})

describe('Refresh API', () => {
  let refreshToken: string

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' })
    refreshToken = res.body.refreshToken
  })

  test('POST /api/refresh — успешное обновление токена', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  test('POST /api/refresh — невалидный refresh', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken: 'invalidtoken' })

    expect(res.status).toBe(401)
  })
})
